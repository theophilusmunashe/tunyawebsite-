<?php
/**
 * "Plan My Trip" form → enquiries inbox. Public, rate limited, honeypot protected.
 */
require __DIR__ . "/_lib/security.php";
tunya_api_headers();
tunya_require_same_origin_post();

if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") tunya_json(405, ["ok" => false, "error" => "Use POST."]);

$data = json_decode(file_get_contents("php://input") ?: "", true);
if (!is_array($data)) tunya_json(400, ["ok" => false, "error" => "Invalid request."]);

// Honeypot: real people never see or fill this field.
if (trim((string)($data["website"] ?? "")) !== "") tunya_json(200, ["ok" => true]);

tunya_rate_limit_or_fail("plan:" . tunya_client_ip(), 5, 3600, "You've sent a few requests already. WhatsApp us on +263 78 266 9251 and we'll reply directly.");

$name = tunya_clean($data["name"] ?? "", 120);
$email = tunya_clean($data["email"] ?? "", 160);
$when = tunya_clean($data["when"] ?? "", 160);
$who = tunya_clean($data["who"] ?? "", 160);
$types = array_slice(array_map(function ($t) { return tunya_clean($t, 40); }, is_array($data["types"] ?? null) ? $data["types"] : []), 0, 8);
$notes = tunya_clean($data["notes"] ?? "", 4000, true);

if ($name === "") tunya_json(400, ["ok" => false, "error" => "Tell us your name."]);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) tunya_json(400, ["ok" => false, "error" => "Enter a valid email so we can reply."]);

$to = "enquiries@tunyafrika.com";
$from = "operations@tunyafrika.com";
$subject = "Trip request — " . $name . ($when !== "" ? " (" . $when . ")" : "");
$body = "New trip request from the website\n\n"
  . "Name: {$name}\n"
  . "Email: {$email}\n"
  . "When: {$when}\n"
  . "Who: {$who}\n"
  . "Trip type: " . implode(", ", $types) . "\n\n"
  . "Notes:\n{$notes}\n\n"
  . "Reply to this email to answer the guest directly.";

$headers = [
  "From: Tunyafrika Website <{$from}>",
  "Reply-To: {$email}",
  "MIME-Version: 1.0",
  "Content-Type: text/plain; charset=UTF-8",
  "X-Mailer: Tunyafrika Plan Request"
];

$ok = @mail($to, "=?UTF-8?B?" . base64_encode($subject) . "?=", $body, implode("\r\n", $headers), "-f{$from}");
if (!$ok) tunya_json(500, ["ok" => false, "error" => "We couldn't send that just now. Please WhatsApp +263 78 266 9251 or email enquiries@tunyafrika.com."]);

tunya_json(200, ["ok" => true]);
