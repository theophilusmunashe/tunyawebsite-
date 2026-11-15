<?php
/**
 * Admin sign-in for /admin.
 *   GET  ?action=me      → { ok, user, csrf } when signed in, 401 otherwise
 *   POST {action:login, user, password, remember}
 *   POST {action:logout}   (needs X-CSRF-Token)
 */
require __DIR__ . "/_lib/security.php";
tunya_api_headers();
tunya_require_same_origin_post();

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "GET") {
  $user = tunya_current_admin();
  if (!$user) tunya_json(401, ["ok" => false, "signin" => true]);
  tunya_json(200, ["ok" => true, "user" => $user, "csrf" => tunya_csrf_token()]);
}

if ($method !== "POST") tunya_json(405, ["ok" => false, "error" => "Use GET or POST."]);

$body = json_decode(file_get_contents("php://input") ?: "", true);
if (!is_array($body)) tunya_json(400, ["ok" => false, "error" => "Invalid request."]);
$action = (string)($body["action"] ?? "");

if ($action === "logout") {
  tunya_require_admin();
  tunya_destroy_session();
  tunya_json(200, ["ok" => true]);
}

if ($action !== "login") tunya_json(400, ["ok" => false, "error" => "Unknown action."]);

$users = tunya_admin_users();
if (!$users) {
  tunya_json(503, ["ok" => false, "error" => "Admin sign-in is not set up on the server yet. Add tunya-config.php (see README)."]);
}

$ip = tunya_client_ip();
$id = tunya_clean($body["user"] ?? "", 64);
$password = (string)($body["password"] ?? "");
$remember = !empty($body["remember"]);

// 5 failed attempts per IP and 10 per account in 15 minutes.
$ipBucket = "login-ip:" . $ip;
$userBucket = "login-user:" . strtolower($id);
if (!tunya_rate_limit($ipBucket, 5, 900, false) || !tunya_rate_limit($userBucket, 10, 900, false)) {
  header("Retry-After: 900");
  tunya_json(429, ["ok" => false, "error" => "Too many attempts. Wait 15 minutes and try again."]);
}

$record = $users[$id] ?? null;
// Always run password_verify so response time doesn't reveal which accounts exist.
$hash = is_array($record) ? (string)($record["hash"] ?? "") : '$2y$12$BrocyVy84pAep/NP24.5COIMjooEsX5uLpB0uMLzPdQeAk2w4Q8wC';
$valid = strlen($password) <= 256 && password_verify($password, $hash) && is_array($record);

if (!$valid) {
  tunya_rate_limit($ipBucket, 5, 900);
  tunya_rate_limit($userBucket, 10, 900);
  usleep(400000);
  tunya_json(401, ["ok" => false, "error" => "Wrong password."]);
}

tunya_session_start($remember ? TUNYA_REMEMBER_SECONDS : 0);
session_regenerate_id(true);
$now = time();
$_SESSION["tunya_user"] = ["id" => $id, "name" => (string)($record["name"] ?? $id)];
$_SESSION["tunya_since"] = $now;
$_SESSION["tunya_seen"] = $now;
$_SESSION["tunya_remember"] = $remember;
$_SESSION["tunya_csrf"] = bin2hex(random_bytes(32));

tunya_json(200, ["ok" => true, "user" => $_SESSION["tunya_user"], "csrf" => $_SESSION["tunya_csrf"]]);
