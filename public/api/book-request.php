<?php
require __DIR__ . "/_lib/security.php";
tunya_api_headers();
tunya_require_same_origin_post();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["ok" => false, "error" => "Use POST."]);
  exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Invalid request."]);
  exit;
}

tunya_rate_limit_or_fail("book:" . tunya_client_ip(), 5, 3600, "You've sent several requests already. Please WhatsApp us on +263 78 266 9251 and we'll reply directly.");

// Honeypot — bots fill hidden "website" fields.
if (trim((string)($data["website"] ?? "")) !== "") {
  echo json_encode(["ok" => true]);
  exit;
}

function clean_header($value) {
  return trim(str_replace(["\r", "\n"], "", (string)$value));
}

$email = clean_header($data["email"] ?? "");
$name = clean_header($data["name"] ?? "");
$package = clean_header($data["packageName"] ?? "");

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Enter a valid email."]);
  exit;
}

if ($package === "" || strlen($package) > 160) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Choose a package."]);
  exit;
}

if (strlen($name) > 120) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Name is too long."]);
  exit;
}

$ops = "operations@tunyafrika.com";
$subject = "Book now — " . $package;
$who = $name !== "" ? $name : "A guest";
$message = $who . " asked to book " . $package . ".\n\n"
  . "Email: " . $email . "\n"
  . "Package: " . $package . "\n\n"
  . "Reply to this guest to confirm dates and next steps.";

$headers = [];
$headers[] = "From: Tunyafrika Xperiences <{$ops}>";
$headers[] = "Reply-To: {$email}";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: Tunyafrika Book Request";

$ok = @mail(
  $ops,
  "=?UTF-8?B?" . base64_encode($subject) . "?=",
  $message,
  implode("\r\n", $headers),
  "-f{$ops}"
);

if (!$ok) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Could not send the booking request. Please try again or email operations@tunyafrika.com."]);
  exit;
}

echo json_encode(["ok" => true]);
