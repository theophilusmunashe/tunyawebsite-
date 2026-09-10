<?php
header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["ok" => false, "error" => "Use POST."]);
  exit;
}

$FROM = "operations@tunyafrika.com";
$FROM_NAME = "Tunyafrika Xperiences";
$EXPECTED_KEY = getenv("TUNYA_MAIL_KEY") ?: "123456";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Invalid request."]);
  exit;
}

$key = (string)($data["key"] ?? "");
if (!hash_equals($EXPECTED_KEY, $key)) {
  http_response_code(403);
  echo json_encode(["ok" => false, "error" => "Not authorised."]);
  exit;
}

function clean_header($value) {
  return trim(str_replace(["\r", "\n"], "", (string)$value));
}

$to = clean_header($data["to"] ?? "");
$toName = clean_header($data["toName"] ?? "");
$subject = clean_header($data["subject"] ?? "");
$message = trim((string)($data["message"] ?? ""));
$pdfName = clean_header($data["pdfName"] ?? "document.pdf");
$pdfBase64 = preg_replace("/\s+/", "", (string)($data["pdfBase64"] ?? ""));

if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Enter a valid guest email."]);
  exit;
}

if ($subject === "" || $message === "") {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Add a subject and a message."]);
  exit;
}

if (strlen($message) > 20000) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "The message is too long."]);
  exit;
}

$pdfBin = "";
if ($pdfBase64 !== "") {
  $pdfBin = base64_decode($pdfBase64, true);
  if ($pdfBin === false || strncmp($pdfBin, "%PDF", 4) !== 0) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "The PDF could not be attached."]);
    exit;
  }
  if (strlen($pdfBin) > 8 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "The PDF is too large to email."]);
    exit;
  }
  if (!preg_match("/^[A-Za-z0-9._-]+\\.pdf$/", $pdfName)) {
    $pdfName = "document.pdf";
  }
}

function enc_header($value) {
  return "=?UTF-8?B?" . base64_encode($value) . "?=";
}

$html = "<div style=\"font-family:Poppins,Segoe UI,sans-serif;color:#000;font-size:15px;line-height:1.7;max-width:640px\">"
  . nl2br(htmlspecialchars($message, ENT_QUOTES, "UTF-8"))
  . "<p style=\"margin-top:28px;font-size:13px;color:#000\">Tunyafrika Xperiences · {$FROM}</p></div>";

$boundary = "=_tunya_" . bin2hex(random_bytes(12));
$altBoundary = "=_tunya_alt_" . bin2hex(random_bytes(8));

$headers = [];
$headers[] = "From: " . enc_header($FROM_NAME) . " <{$FROM}>";
$headers[] = "Reply-To: {$FROM}";
$headers[] = "Bcc: {$FROM}";
$headers[] = "MIME-Version: 1.0";
$headers[] = "X-Mailer: Tunyafrika Workspace";

$body = "";
if ($pdfBin !== "") {
  $headers[] = "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";
  $body .= "--{$boundary}\r\n";
  $body .= "Content-Type: multipart/alternative; boundary=\"{$altBoundary}\"\r\n\r\n";
  $body .= "--{$altBoundary}\r\n";
  $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
  $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
  $body .= $message . "\r\n\r\n";
  $body .= "--{$altBoundary}\r\n";
  $body .= "Content-Type: text/html; charset=UTF-8\r\n";
  $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
  $body .= $html . "\r\n\r\n";
  $body .= "--{$altBoundary}--\r\n";
  $body .= "--{$boundary}\r\n";
  $body .= "Content-Type: application/pdf; name=\"{$pdfName}\"\r\n";
  $body .= "Content-Disposition: attachment; filename=\"{$pdfName}\"\r\n";
  $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
  $body .= chunk_split(base64_encode($pdfBin)) . "\r\n";
  $body .= "--{$boundary}--\r\n";
} else {
  $headers[] = "Content-Type: text/plain; charset=UTF-8";
  $body = $message;
}

$ok = @mail(
  $to,
  enc_header($subject),
  $body,
  implode("\r\n", $headers),
  "-f{$FROM}"
);

if (!$ok) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "The mail server could not send this message."]);
  exit;
}

echo json_encode(["ok" => true]);
