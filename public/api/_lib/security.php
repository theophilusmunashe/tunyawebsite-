<?php
/**
 * Shared security helpers for every /api/*.php endpoint.
 *
 * - Admin sign-in is a server-side PHP session (HttpOnly, Secure, SameSite=Strict cookie).
 *   No password or key is ever shipped to the browser bundle.
 * - Passwords live as bcrypt hashes in a config file OUTSIDE the web root
 *   (see tunya-config.example.php in the repo root).
 * - Every state-changing admin request must carry the session's CSRF token.
 * - CORS only answers origins on the allow-list.
 * - Simple file-based rate limiting for sign-in and public forms.
 *
 * This folder is denied to the web by its .htaccess; it is only ever included.
 */

if (!defined("TUNYA_SECURITY")) {
  define("TUNYA_SECURITY", 1);
}

const TUNYA_SESSION_NAME = "tunya_admin";
const TUNYA_IDLE_SECONDS = 8 * 3600;          // signed out after 8 hours idle
const TUNYA_REMEMBER_SECONDS = 30 * 86400;    // "stay signed in" lasts 30 days
const TUNYA_DEFAULT_ORIGINS = ["https://www.tunyafrika.com", "https://tunyafrika.com"];

/** Loads the server-only config. Returns [] when it is missing (admin then fails closed). */
function tunya_config() {
  static $config = null;
  if ($config !== null) return $config;
  $candidates = [];
  $env = getenv("TUNYA_CONFIG");
  if ($env) $candidates[] = $env;
  $docRoot = rtrim((string)($_SERVER["DOCUMENT_ROOT"] ?? ""), "/\\");
  if ($docRoot !== "") $candidates[] = dirname($docRoot) . "/tunya-config.php";
  // public_html/api/_lib → /home/<user>/tunya-config.php
  $candidates[] = dirname(__DIR__, 3) . "/tunya-config.php";
  foreach ($candidates as $path) {
    if (is_file($path) && is_readable($path)) {
      $loaded = include $path;
      if (is_array($loaded)) {
        $config = $loaded;
        return $config;
      }
    }
  }
  $config = [];
  return $config;
}

function tunya_json($code, $payload) {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function tunya_is_https() {
  if (!empty($_SERVER["HTTPS"]) && strtolower((string)$_SERVER["HTTPS"]) !== "off") return true;
  if (($_SERVER["SERVER_PORT"] ?? "") == 443) return true;
  return strtolower((string)($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "")) === "https";
}

function tunya_allowed_origins() {
  $extra = tunya_config()["allowed_origins"] ?? [];
  return array_values(array_unique(array_merge(TUNYA_DEFAULT_ORIGINS, is_array($extra) ? $extra : [])));
}

/**
 * Sends the standard API headers and handles CORS / preflight.
 * Only allow-listed origins get credentialed CORS. With $publicReads, anonymous GETs are open to all.
 */
function tunya_api_headers($publicReads = false) {
  header("Content-Type: application/json; charset=utf-8");
  header("X-Content-Type-Options: nosniff");
  header("Referrer-Policy: strict-origin-when-cross-origin");
  header("Cache-Control: no-store");
  header("X-Robots-Tag: noindex, nofollow");
  $origin = (string)($_SERVER["HTTP_ORIGIN"] ?? "");
  if ($origin !== "" && in_array($origin, tunya_allowed_origins(), true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
    header("Vary: Origin");
  } elseif ($publicReads && ($_SERVER["REQUEST_METHOD"] ?? "") === "GET") {
    // Published stays and news are public: any site may read them, but without cookies.
    header("Access-Control-Allow-Origin: *");
  }
  if (($_SERVER["REQUEST_METHOD"] ?? "") === "OPTIONS") {
    http_response_code(204);
    exit;
  }
}

/** Rejects cross-site POSTs from origins we don't know (defence in depth on top of SameSite). */
function tunya_require_same_origin_post() {
  if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") return;
  $origin = (string)($_SERVER["HTTP_ORIGIN"] ?? "");
  if ($origin === "") return; // non-browser clients; CSRF/auth still apply
  $host = (string)($_SERVER["HTTP_HOST"] ?? "");
  $self = (tunya_is_https() ? "https://" : "http://") . $host;
  if ($origin === $self || in_array($origin, tunya_allowed_origins(), true)) return;
  tunya_json(403, ["ok" => false, "error" => "Cross-site request blocked."]);
}

function tunya_client_ip() {
  // REMOTE_ADDR only: forwarded headers can be forged by the client.
  return (string)($_SERVER["REMOTE_ADDR"] ?? "0.0.0.0");
}

function tunya_data_dir($name) {
  $base = tunya_config()["data_dir"] ?? (dirname(__DIR__) . "/security-data");
  $dir = rtrim($base, "/\\") . "/" . $name;
  if (!is_dir($dir)) @mkdir($dir, 0700, true);
  return $dir;
}

/**
 * Sliding-window rate limit. Returns true when the call is allowed.
 * $bucket names the limit (e.g. "login-ip:1.2.3.4").
 */
function tunya_rate_limit($bucket, $max, $windowSeconds, $consume = true) {
  $file = tunya_data_dir("ratelimit") . "/" . hash("sha256", $bucket) . ".json";
  $now = time();
  $fh = @fopen($file, "c+");
  if (!$fh) return true; // never lock people out because of a disk problem
  flock($fh, LOCK_EX);
  $raw = stream_get_contents($fh);
  $hits = json_decode($raw ?: "[]", true);
  if (!is_array($hits)) $hits = [];
  $hits = array_values(array_filter($hits, function ($t) use ($now, $windowSeconds) {
    return is_int($t) && $t > $now - $windowSeconds;
  }));
  $allowed = count($hits) < $max;
  if ($allowed && $consume) $hits[] = $now;
  ftruncate($fh, 0);
  rewind($fh);
  fwrite($fh, json_encode($hits));
  flock($fh, LOCK_UN);
  fclose($fh);
  return $allowed;
}

function tunya_rate_limit_or_fail($bucket, $max, $windowSeconds, $message = "Too many requests. Please wait a few minutes and try again.") {
  if (!tunya_rate_limit($bucket, $max, $windowSeconds)) {
    header("Retry-After: " . (int)$windowSeconds);
    tunya_json(429, ["ok" => false, "error" => $message]);
  }
}

function tunya_session_start($rememberSeconds = 0) {
  if (session_status() === PHP_SESSION_ACTIVE) return;
  session_name(TUNYA_SESSION_NAME);
  ini_set("session.use_strict_mode", "1");
  ini_set("session.use_only_cookies", "1");
  ini_set("session.gc_maxlifetime", (string)TUNYA_REMEMBER_SECONDS);
  session_set_cookie_params([
    "lifetime" => $rememberSeconds,
    "path" => "/",
    "secure" => tunya_is_https(),
    "httponly" => true,
    "samesite" => "Strict"
  ]);
  session_start();
}

/** Returns the signed-in admin or null. Enforces idle and absolute expiry. */
function tunya_current_admin() {
  if (empty($_COOKIE[TUNYA_SESSION_NAME])) return null;
  tunya_session_start();
  $user = $_SESSION["tunya_user"] ?? null;
  if (!is_array($user)) return null;
  $now = time();
  $idle = $now - (int)($_SESSION["tunya_seen"] ?? 0);
  $age = $now - (int)($_SESSION["tunya_since"] ?? 0);
  $maxIdle = !empty($_SESSION["tunya_remember"]) ? TUNYA_REMEMBER_SECONDS : TUNYA_IDLE_SECONDS;
  if ($idle > $maxIdle || $age > TUNYA_REMEMBER_SECONDS) {
    tunya_destroy_session();
    return null;
  }
  $_SESSION["tunya_seen"] = $now;
  return $user;
}

function tunya_csrf_token() {
  if (empty($_SESSION["tunya_csrf"])) $_SESSION["tunya_csrf"] = bin2hex(random_bytes(32));
  return $_SESSION["tunya_csrf"];
}

/**
 * Gate for every admin action. GET requests need a session; POST requests also
 * need the CSRF token in the X-CSRF-Token header.
 */
function tunya_require_admin() {
  $user = tunya_current_admin();
  if (!$user) tunya_json(401, ["ok" => false, "error" => "Please sign in again.", "signin" => true]);
  if (($_SERVER["REQUEST_METHOD"] ?? "") === "POST") {
    $sent = (string)($_SERVER["HTTP_X_CSRF_TOKEN"] ?? "");
    if ($sent === "" || !hash_equals(tunya_csrf_token(), $sent)) {
      tunya_json(403, ["ok" => false, "error" => "Your session expired. Refresh the page and sign in again.", "signin" => true]);
    }
  }
  return $user;
}

function tunya_destroy_session() {
  if (session_status() !== PHP_SESSION_ACTIVE) tunya_session_start();
  $_SESSION = [];
  $p = session_get_cookie_params();
  setcookie(session_name(), "", [
    "expires" => time() - 3600,
    "path" => $p["path"],
    "secure" => $p["secure"],
    "httponly" => true,
    "samesite" => "Strict"
  ]);
  session_destroy();
}

/** Admin users from config: [id => ["name" => ..., "hash" => bcrypt]]. */
function tunya_admin_users() {
  $users = tunya_config()["users"] ?? [];
  return is_array($users) ? $users : [];
}

/** Trims a string to a max length (multibyte-safe) after removing control characters. */
function tunya_clean($value, $max = 500, $multiline = false) {
  $s = (string)$value;
  $s = $multiline
    ? preg_replace("/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u", "", $s)
    : preg_replace("/[\x00-\x1F\x7F]/u", "", $s);
  $s = trim((string)$s);
  if (function_exists("mb_substr")) return mb_substr($s, 0, $max);
  return substr($s, 0, $max);
}

/**
 * Blocks server-side fetches to private, loopback, link-local and metadata addresses (SSRF).
 * Returns true when the URL is a public http(s) address.
 */
function tunya_is_public_url($url) {
  $parts = parse_url($url);
  if (!$parts || !in_array(strtolower($parts["scheme"] ?? ""), ["http", "https"], true)) return false;
  $host = $parts["host"] ?? "";
  if ($host === "") return false;
  $ips = filter_var($host, FILTER_VALIDATE_IP) ? [$host] : (gethostbynamel($host) ?: []);
  if (!$ips) return false;
  foreach ($ips as $ip) {
    if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) return false;
  }
  return true;
}
