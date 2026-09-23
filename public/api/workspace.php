<?php
/**
 * Shared workspace store for Tunyafrika admin.
 * Quotes, invoices, cash book, loans, bookings, and files sync here
 * so every signed-in machine reads the same records.
 */
header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Tunya-Key");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

$EXPECTED_KEY = getenv("TUNYA_MAIL_KEY") ?: (getenv("TUNYA_WORKSPACE_KEY") ?: "123456");
$DATA_DIR = __DIR__ . "/workspace-data";
$STORE_FILE = $DATA_DIR . "/store.json";

if (!is_dir($DATA_DIR)) {
  @mkdir($DATA_DIR, 0755, true);
}

function respond($code, $payload) {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function empty_store() {
  return [
    "kind" => "tunyafrika-workspace",
    "version" => 1,
    "updatedAt" => 0,
    "kv" => new stdClass(),
    "files" => []
  ];
}

function load_store($file) {
  if (!is_file($file)) {
    return empty_store();
  }
  $raw = file_get_contents($file);
  $data = json_decode($raw, true);
  if (!is_array($data)) {
    return empty_store();
  }
  $kv = $data["kv"] ?? [];
  if (!is_array($kv)) {
    $kv = [];
  }
  return [
    "kind" => "tunyafrika-workspace",
    "version" => 1,
    "updatedAt" => (int)($data["updatedAt"] ?? 0),
    "kv" => $kv,
    "files" => array_values($data["files"] ?? [])
  ];
}

function save_store($file, $store) {
  $store["kind"] = "tunyafrika-workspace";
  $store["version"] = 1;
  $store["updatedAt"] = (int)(microtime(true) * 1000);
  $tmp = $file . ".tmp";
  $json = json_encode($store, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false) {
    respond(500, ["ok" => false, "error" => "Could not save workspace."]);
  }
  if (!rename($tmp, $file)) {
    @unlink($tmp);
    respond(500, ["ok" => false, "error" => "Could not finalise workspace save."]);
  }
}

function request_key($body) {
  $hdr = $_SERVER["HTTP_X_TUNYA_KEY"] ?? "";
  if ($hdr !== "") return (string)$hdr;
  if (is_array($body) && isset($body["key"])) return (string)$body["key"];
  return (string)($_GET["key"] ?? "");
}

function require_admin($expected, $body) {
  if (!hash_equals((string)$expected, request_key($body))) {
    respond(403, ["ok" => false, "error" => "Not authorised."]);
  }
}

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";
$raw = file_get_contents("php://input");
$body = json_decode($raw ?: "{}", true);
if (!is_array($body)) $body = [];

$action = "";
if ($method === "GET") {
  $action = (string)($_GET["action"] ?? "pull");
} elseif ($method === "POST") {
  $action = (string)($body["action"] ?? "");
} else {
  respond(405, ["ok" => false, "error" => "Use GET or POST."]);
}

require_admin($EXPECTED_KEY, $body);
$store = load_store($STORE_FILE);

if ($action === "pull") {
  respond(200, ["ok" => true, "pack" => $store]);
}

if ($action === "push") {
  $pack = $body["pack"] ?? null;
  if (!is_array($pack) || ($pack["kind"] ?? "") !== "tunyafrika-workspace") {
    respond(400, ["ok" => false, "error" => "This is not a Tunyafrika workspace pack."]);
  }
  $kv = $pack["kv"] ?? [];
  if (!is_array($kv)) $kv = [];
  $next = [
    "kind" => "tunyafrika-workspace",
    "version" => 1,
    "kv" => $kv,
    "files" => array_values($pack["files"] ?? [])
  ];
  save_store($STORE_FILE, $next);
  $saved = load_store($STORE_FILE);
  respond(200, ["ok" => true, "updatedAt" => $saved["updatedAt"], "pack" => $saved]);
}

respond(400, ["ok" => false, "error" => "Unknown action."]);
