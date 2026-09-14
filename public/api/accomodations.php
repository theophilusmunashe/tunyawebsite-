<?php
/**
 * Accommodations marketplace API for Tunyafrika.
 * Public reads strip provider/location details. Admin writes require the workspace key.
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
$DATA_DIR = __DIR__ . "/accomodations-data";
$STORE_FILE = $DATA_DIR . "/store.json";
$MEDIA_DIR = dirname(__DIR__) . "/accomodations-media";

if (!is_dir($DATA_DIR)) {
  @mkdir($DATA_DIR, 0755, true);
}
if (!is_dir($MEDIA_DIR)) {
  @mkdir($MEDIA_DIR, 0755, true);
}

function respond($code, $payload) {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function empty_store() {
  return [
    "providers" => [],
    "listings" => [],
    "enquiries" => [],
    "updatedAt" => 0
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
  return [
    "providers" => array_values($data["providers"] ?? []),
    "listings" => array_values($data["listings"] ?? []),
    "enquiries" => array_values($data["enquiries"] ?? []),
    "updatedAt" => (int)($data["updatedAt"] ?? 0)
  ];
}

function save_store($file, $store) {
  $store["updatedAt"] = (int)(microtime(true) * 1000);
  $tmp = $file . ".tmp";
  $json = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  if (file_put_contents($tmp, $json, LOCK_EX) === false) {
    respond(500, ["ok" => false, "error" => "Could not save data."]);
  }
  if (!rename($tmp, $file)) {
    @unlink($tmp);
    respond(500, ["ok" => false, "error" => "Could not finalise save."]);
  }
}

function uid($prefix) {
  return $prefix . "_" . bin2hex(random_bytes(6));
}

function request_key() {
  $hdr = $_SERVER["HTTP_X_TUNYA_KEY"] ?? "";
  if ($hdr !== "") return (string)$hdr;
  return "";
}

function require_admin($expected) {
  global $body;
  $key = request_key();
  if ($key === "" && is_array($body)) {
    $key = (string)($body["key"] ?? "");
  }
  if (!hash_equals($expected, $key)) {
    respond(403, ["ok" => false, "error" => "Not authorised."]);
  }
}

function public_listing($listing) {
  $images = [];
  foreach (($listing["images"] ?? []) as $img) {
    if (!is_array($img)) continue;
    $images[] = [
      "id" => (string)($img["id"] ?? ""),
      "url" => (string)($img["url"] ?? ""),
      "caption" => (string)($img["caption"] ?? "")
    ];
  }
  $pricing = is_array($listing["pricing"] ?? null) ? $listing["pricing"] : [];
  $capacity = is_array($listing["capacity"] ?? null) ? $listing["capacity"] : [];
  return [
    "id" => (string)($listing["id"] ?? ""),
    "title" => (string)($listing["title"] ?? ""),
    "subtitle" => (string)($listing["subtitle"] ?? ""),
    "summary" => (string)($listing["summary"] ?? ""),
    "propertyType" => (string)($listing["propertyType"] ?? ""),
    "amenities" => array_values(array_filter(array_map("strval", $listing["amenities"] ?? []))),
    "pricing" => [
      "currency" => (string)($pricing["currency"] ?? "USD"),
      "amount" => (float)($pricing["amount"] ?? 0),
      "unit" => (string)($pricing["unit"] ?? "per night"),
      "note" => (string)($pricing["note"] ?? "")
    ],
    "capacity" => [
      "guests" => (string)($capacity["guests"] ?? ""),
      "rooms" => (string)($capacity["rooms"] ?? "")
    ],
    "images" => $images,
    "coverUrl" => (string)($listing["coverUrl"] ?? ($images[0]["url"] ?? "")),
    "status" => (string)($listing["status"] ?? "draft"),
    "updatedAt" => (int)($listing["updatedAt"] ?? 0),
    "publishedAt" => (int)($listing["publishedAt"] ?? 0)
  ];
}

function find_by_id($list, $id) {
  foreach ($list as $i => $row) {
    if (($row["id"] ?? "") === $id) return [$i, $row];
  }
  return [-1, null];
}


function store_listing_image($MEDIA_DIR, $listingId, $dataBase64, $filename, $caption) {
  if (strpos($dataBase64, "data:") === 0) {
    $parts = explode(",", $dataBase64, 2);
    $dataBase64 = isset($parts[1]) ? $parts[1] : "";
  }
  $dataBase64 = preg_replace("/\s+/", "", (string)$dataBase64);
  $bin = base64_decode($dataBase64, true);
  if ($bin === false || strlen($bin) < 32) {
    return ["ok" => false, "error" => "Image data was invalid."];
  }
  if (strlen($bin) > 8 * 1024 * 1024) {
    return ["ok" => false, "error" => "Image is too large (max 8MB)."];
  }
  $ext = "jpg";
  $b0 = isset($bin[0]) ? ord($bin[0]) : 0;
  $b1 = isset($bin[1]) ? ord($bin[1]) : 0;
  if ($b0 === 0x89 && $b1 === 0x50) $ext = "png";
  elseif ($b0 === 0x47 && $b1 === 0x49) $ext = "gif";
  elseif (substr($bin, 0, 4) === "RIFF" && substr($bin, 8, 4) === "WEBP") $ext = "webp";
  elseif (!($b0 === 0xFF && $b1 === 0xD8)) {
    return ["ok" => false, "error" => "Use a JPG, PNG, WEBP or GIF image."];
  }
  $imageId = uid("img");
  $safeName = $listingId . "-" . $imageId . "." . $ext;
  $abs = $MEDIA_DIR . "/" . $safeName;
  if (file_put_contents($abs, $bin) === false) {
    return ["ok" => false, "error" => "Could not store the image."];
  }
  return [
    "ok" => true,
    "image" => [
      "id" => $imageId,
      "url" => "/accomodations-media/" . $safeName,
      "caption" => trim((string)$caption),
      "name" => preg_replace("/[^A-Za-z0-9._-]/", "", (string)$filename) ?: "photo.jpg"
    ]
  ];
}


$method = $_SERVER["REQUEST_METHOD"];
$action = "";
$body = null;

if ($method === "GET") {
  $action = (string)($_GET["action"] ?? "public_list");
} elseif ($method === "POST") {
  $raw = file_get_contents("php://input");
  $body = json_decode($raw, true);
  if (!is_array($body)) {
    respond(400, ["ok" => false, "error" => "Invalid request."]);
  }
  $action = (string)($body["action"] ?? "");
} else {
  respond(405, ["ok" => false, "error" => "Use GET or POST."]);
}

$store = load_store($STORE_FILE);

switch ($action) {
  case "public_list": {
    $items = [];
    foreach ($store["listings"] as $listing) {
      if (($listing["status"] ?? "") !== "published") continue;
      $items[] = public_listing($listing);
    }
    usort($items, function ($a, $b) {
      return ($b["publishedAt"] ?: $b["updatedAt"]) <=> ($a["publishedAt"] ?: $a["updatedAt"]);
    });
    respond(200, ["ok" => true, "listings" => $items]);
  }

  case "public_get": {
    $id = (string)($_GET["id"] ?? ($body["id"] ?? ""));
    [, $listing] = find_by_id($store["listings"], $id);
    if (!$listing || ($listing["status"] ?? "") !== "published") {
      respond(404, ["ok" => false, "error" => "Stay not found."]);
    }
    respond(200, ["ok" => true, "listing" => public_listing($listing)]);
  }

  case "enquire": {
    if ($method !== "POST") respond(405, ["ok" => false, "error" => "Use POST."]);
    $listingId = trim((string)($body["listingId"] ?? ""));
    [, $listing] = find_by_id($store["listings"], $listingId);
    if (!$listing || ($listing["status"] ?? "") !== "published") {
      respond(404, ["ok" => false, "error" => "Stay not found."]);
    }
    $guestName = trim((string)($body["guestName"] ?? ""));
    $guestEmail = trim((string)($body["guestEmail"] ?? ""));
    $guestPhone = trim((string)($body["guestPhone"] ?? ""));
    $checkIn = trim((string)($body["checkIn"] ?? ""));
    $checkOut = trim((string)($body["checkOut"] ?? ""));
    $guests = trim((string)($body["guests"] ?? ""));
    $message = trim((string)($body["message"] ?? ""));
    if ($guestName === "" || ($guestEmail === "" && $guestPhone === "")) {
      respond(400, ["ok" => false, "error" => "Add your name and an email or phone number."]);
    }
    if ($guestEmail !== "" && !filter_var($guestEmail, FILTER_VALIDATE_EMAIL)) {
      respond(400, ["ok" => false, "error" => "Enter a valid email."]);
    }
    if (strlen($message) > 4000) {
      respond(400, ["ok" => false, "error" => "Message is too long."]);
    }
    $now = (int)(microtime(true) * 1000);
    $enquiry = [
      "id" => uid("enq"),
      "listingId" => $listingId,
      "listingTitle" => (string)($listing["title"] ?? ""),
      "providerId" => (string)($listing["providerId"] ?? ""),
      "guestName" => $guestName,
      "guestEmail" => $guestEmail,
      "guestPhone" => $guestPhone,
      "checkIn" => $checkIn,
      "checkOut" => $checkOut,
      "guests" => $guests,
      "message" => $message,
      "status" => "new",
      "staffNotes" => "",
      "createdAt" => $now,
      "updatedAt" => $now
    ];
    array_unshift($store["enquiries"], $enquiry);
    save_store($STORE_FILE, $store);

    // Optional mail ping to operations inbox (non-fatal).
    $ops = "operations@tunyafrika.com";
    $subject = "Accommodation enquiry — " . ($listing["title"] ?? "Stay");
    $text = "New availability enquiry\n\n"
      . "Stay: " . ($listing["title"] ?? "") . "\n"
      . "Guest: {$guestName}\n"
      . "Email: {$guestEmail}\n"
      . "Phone: {$guestPhone}\n"
      . "Check-in: {$checkIn}\n"
      . "Check-out: {$checkOut}\n"
      . "Guests: {$guests}\n\n"
      . $message . "\n\n"
      . "Open workspace → Accommodations to contact the provider.";
    @mail($ops, "=?UTF-8?B?" . base64_encode($subject) . "?=", $text, "From: {$ops}\r\nContent-Type: text/plain; charset=UTF-8", "-f{$ops}");

    respond(200, ["ok" => true, "enquiryId" => $enquiry["id"]]);
  }

  case "admin_bootstrap": {
    require_admin($EXPECTED_KEY);
    respond(200, [
      "ok" => true,
      "providers" => $store["providers"],
      "listings" => $store["listings"],
      "enquiries" => $store["enquiries"],
      "updatedAt" => $store["updatedAt"]
    ]);
  }

  case "save_provider": {
    require_admin($EXPECTED_KEY);
    if ($method !== "POST") respond(405, ["ok" => false, "error" => "Use POST."]);
    $provider = $body["provider"] ?? null;
    if (!is_array($provider)) respond(400, ["ok" => false, "error" => "Missing provider."]);
    $now = (int)(microtime(true) * 1000);
    $id = trim((string)($provider["id"] ?? ""));
    if ($id === "") $id = uid("prv");
    $saved = [
      "id" => $id,
      "name" => trim((string)($provider["name"] ?? "")),
      "contactName" => trim((string)($provider["contactName"] ?? "")),
      "phone" => trim((string)($provider["phone"] ?? "")),
      "email" => trim((string)($provider["email"] ?? "")),
      "whatsapp" => trim((string)($provider["whatsapp"] ?? "")),
      "address" => trim((string)($provider["address"] ?? "")),
      "notes" => trim((string)($provider["notes"] ?? "")),
      "createdAt" => (int)($provider["createdAt"] ?? $now),
      "updatedAt" => $now
    ];
    if ($saved["name"] === "") respond(400, ["ok" => false, "error" => "Provider name is required."]);
    [$idx] = find_by_id($store["providers"], $id);
    if ($idx >= 0) $store["providers"][$idx] = $saved;
    else array_unshift($store["providers"], $saved);
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "provider" => $saved]);
  }

  case "delete_provider": {
    require_admin($EXPECTED_KEY);
    $id = trim((string)($body["id"] ?? ""));
    $store["providers"] = array_values(array_filter($store["providers"], function ($p) use ($id) {
      return ($p["id"] ?? "") !== $id;
    }));
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true]);
  }

  case "save_listing": {
    require_admin($EXPECTED_KEY);
    $listing = $body["listing"] ?? null;
    if (!is_array($listing)) respond(400, ["ok" => false, "error" => "Missing listing."]);
    $now = (int)(microtime(true) * 1000);
    $id = trim((string)($listing["id"] ?? ""));
    if ($id === "") $id = uid("lst");
    [$idx, $existing] = find_by_id($store["listings"], $id);
    $status = (string)($listing["status"] ?? "draft");
    if (!in_array($status, ["draft", "published", "paused"], true)) $status = "draft";
    $pricing = is_array($listing["pricing"] ?? null) ? $listing["pricing"] : [];
    $capacity = is_array($listing["capacity"] ?? null) ? $listing["capacity"] : [];
    $location = is_array($listing["location"] ?? null) ? $listing["location"] : [];
    // Photos are managed by upload/delete endpoints. Keep existing images on
    // metadata saves so Publish/Save never wipe a bulk upload.
    $sourceImages = $listing["images"] ?? null;
    if (!is_array($sourceImages) || (count($sourceImages) === 0 && is_array($existing))) {
      $sourceImages = $existing["images"] ?? [];
    }
    $images = [];
    foreach ($sourceImages as $img) {
      if (!is_array($img) || empty($img["url"])) continue;
      $images[] = [
        "id" => (string)($img["id"] ?? uid("img")),
        "url" => (string)$img["url"],
        "caption" => (string)($img["caption"] ?? "")
      ];
    }
    $amenities = [];
    if (is_array($listing["amenities"] ?? null)) {
      foreach ($listing["amenities"] as $a) {
        $t = trim((string)$a);
        if ($t !== "") $amenities[] = $t;
      }
    } elseif (is_string($listing["amenities"] ?? null)) {
      foreach (preg_split("/[\n,]+/", $listing["amenities"]) as $a) {
        $t = trim($a);
        if ($t !== "") $amenities[] = $t;
      }
    }
    $publishedAt = (int)($existing["publishedAt"] ?? 0);
    if ($status === "published" && !$publishedAt) $publishedAt = $now;
    if ($status !== "published") {
      // keep publishedAt history if it existed
      $publishedAt = (int)($listing["publishedAt"] ?? $publishedAt);
    }
    $coverUrl = trim((string)($listing["coverUrl"] ?? ""));
    if ($coverUrl === "" && is_array($existing)) $coverUrl = trim((string)($existing["coverUrl"] ?? ""));
    if ($coverUrl === "" && count($images)) $coverUrl = (string)$images[0]["url"];
    $saved = [
      "id" => $id,
      "providerId" => trim((string)($listing["providerId"] ?? "")),
      "title" => trim((string)($listing["title"] ?? "")),
      "subtitle" => trim((string)($listing["subtitle"] ?? "")),
      "summary" => trim((string)($listing["summary"] ?? "")),
      "propertyType" => trim((string)($listing["propertyType"] ?? "Lodge")),
      "amenities" => $amenities,
      "pricing" => [
        "currency" => trim((string)($pricing["currency"] ?? "USD")) ?: "USD",
        "amount" => (float)($pricing["amount"] ?? 0),
        "unit" => trim((string)($pricing["unit"] ?? "per night")) ?: "per night",
        "note" => trim((string)($pricing["note"] ?? ""))
      ],
      "capacity" => [
        "guests" => trim((string)($capacity["guests"] ?? "")),
        "rooms" => trim((string)($capacity["rooms"] ?? ""))
      ],
      "images" => $images,
      "coverUrl" => $coverUrl,
      "location" => [
        "area" => trim((string)($location["area"] ?? "")),
        "address" => trim((string)($location["address"] ?? "")),
        "mapsNote" => trim((string)($location["mapsNote"] ?? ""))
      ],
      "providerNotes" => trim((string)($listing["providerNotes"] ?? "")),
      "availabilityNote" => trim((string)($listing["availabilityNote"] ?? "")),
      "status" => $status,
      "createdAt" => (int)($existing["createdAt"] ?? ($listing["createdAt"] ?? $now)),
      "updatedAt" => $now,
      "publishedAt" => $publishedAt
    ];
    if ($saved["title"] === "") respond(400, ["ok" => false, "error" => "Listing title is required."]);
    if ($idx >= 0) $store["listings"][$idx] = $saved;
    else array_unshift($store["listings"], $saved);
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "listing" => $saved]);
  }

  case "delete_listing": {
    require_admin($EXPECTED_KEY);
    $id = trim((string)($body["id"] ?? ""));
    [, $listing] = find_by_id($store["listings"], $id);
    if ($listing) {
      foreach (($listing["images"] ?? []) as $img) {
        $url = (string)($img["url"] ?? "");
        if (strpos($url, "/accomodations-media/") === 0) {
          $path = dirname(__DIR__) . $url;
          if (is_file($path)) @unlink($path);
        }
      }
    }
    $store["listings"] = array_values(array_filter($store["listings"], function ($l) use ($id) {
      return ($l["id"] ?? "") !== $id;
    }));
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true]);
  }

  case "upload_image": {
    require_admin($EXPECTED_KEY);
    $listingId = trim((string)($body["listingId"] ?? ""));
    [$idx, $listing] = find_by_id($store["listings"], $listingId);
    if ($idx < 0) respond(404, ["ok" => false, "error" => "Listing not found. Save the stay first, then add photos."]);
    $stored = store_listing_image(
      $MEDIA_DIR,
      $listingId,
      (string)($body["dataBase64"] ?? ""),
      (string)($body["filename"] ?? "photo.jpg"),
      (string)($body["caption"] ?? "")
    );
    if (empty($stored["ok"])) {
      respond(400, ["ok" => false, "error" => $stored["error"] ?? "Could not upload image."]);
    }
    $image = $stored["image"];
    $images = $listing["images"] ?? [];
    $images[] = $image;
    $listing["images"] = $images;
    if (empty($listing["coverUrl"])) $listing["coverUrl"] = $image["url"];
    $listing["updatedAt"] = (int)(microtime(true) * 1000);
    $store["listings"][$idx] = $listing;
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "image" => $image, "listing" => $listing]);
  }

  case "upload_images": {
    require_admin($EXPECTED_KEY);
    $listingId = trim((string)($body["listingId"] ?? ""));
    [$idx, $listing] = find_by_id($store["listings"], $listingId);
    if ($idx < 0) respond(404, ["ok" => false, "error" => "Listing not found. Save the stay first, then add photos."]);
    $batch = $body["images"] ?? null;
    if (!is_array($batch) || count($batch) === 0) {
      respond(400, ["ok" => false, "error" => "Add one or more photos."]);
    }
    if (count($batch) > 30) {
      respond(400, ["ok" => false, "error" => "Upload up to 30 photos at a time."]);
    }
    $images = $listing["images"] ?? [];
    $added = [];
    $errors = [];
    foreach ($batch as $i => $item) {
      if (!is_array($item)) {
        $errors[] = "Photo " . ($i + 1) . " was invalid.";
        continue;
      }
      $stored = store_listing_image(
        $MEDIA_DIR,
        $listingId,
        (string)($item["dataBase64"] ?? ""),
        (string)($item["filename"] ?? ("photo-" . ($i + 1) . ".jpg")),
        (string)($item["caption"] ?? "")
      );
      if (empty($stored["ok"])) {
        $errors[] = (string)($item["filename"] ?? ("Photo " . ($i + 1))) . ": " . ($stored["error"] ?? "failed");
        continue;
      }
      $images[] = $stored["image"];
      $added[] = $stored["image"];
    }
    if (count($added) === 0) {
      respond(400, ["ok" => false, "error" => $errors[0] ?? "Could not upload photos.", "errors" => $errors]);
    }
    $listing["images"] = $images;
    if (empty($listing["coverUrl"]) && count($images)) $listing["coverUrl"] = $images[0]["url"];
    $listing["updatedAt"] = (int)(microtime(true) * 1000);
    $store["listings"][$idx] = $listing;
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "added" => count($added), "images" => $added, "errors" => $errors, "listing" => $listing]);
  }

  case "delete_image": {
    require_admin($EXPECTED_KEY);
    $listingId = trim((string)($body["listingId"] ?? ""));
    $imageId = trim((string)($body["imageId"] ?? ""));
    [$idx, $listing] = find_by_id($store["listings"], $listingId);
    if ($idx < 0) respond(404, ["ok" => false, "error" => "Listing not found."]);
    $kept = [];
    foreach (($listing["images"] ?? []) as $img) {
      if (($img["id"] ?? "") === $imageId) {
        $url = (string)($img["url"] ?? "");
        if (strpos($url, "/accomodations-media/") === 0) {
          $path = dirname(__DIR__) . $url;
          if (is_file($path)) @unlink($path);
        }
        continue;
      }
      $kept[] = $img;
    }
    $listing["images"] = $kept;
    $cover = $listing["coverUrl"] ?? "";
    $coverStillThere = false;
    foreach ($kept as $img) {
      if (($img["url"] ?? "") === $cover) { $coverStillThere = true; break; }
    }
    if ($cover && !$coverStillThere) {
      $listing["coverUrl"] = $kept[0]["url"] ?? "";
    }
    $listing["updatedAt"] = (int)(microtime(true) * 1000);
    $store["listings"][$idx] = $listing;
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "listing" => $listing]);
  }

  case "save_enquiry": {
    require_admin($EXPECTED_KEY);
    $enquiry = $body["enquiry"] ?? null;
    if (!is_array($enquiry) || empty($enquiry["id"])) {
      respond(400, ["ok" => false, "error" => "Missing enquiry."]);
    }
    [$idx, $existing] = find_by_id($store["enquiries"], $enquiry["id"]);
    if ($idx < 0) respond(404, ["ok" => false, "error" => "Enquiry not found."]);
    $status = (string)($enquiry["status"] ?? $existing["status"]);
    $allowed = ["new", "contacting", "awaiting_provider", "replied", "closed"];
    if (!in_array($status, $allowed, true)) $status = $existing["status"];
    $saved = array_merge($existing, [
      "status" => $status,
      "staffNotes" => trim((string)($enquiry["staffNotes"] ?? $existing["staffNotes"] ?? "")),
      "updatedAt" => (int)(microtime(true) * 1000)
    ]);
    $store["enquiries"][$idx] = $saved;
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "enquiry" => $saved]);
  }

  case "delete_enquiry": {
    require_admin($EXPECTED_KEY);
    $id = trim((string)($body["id"] ?? ""));
    $store["enquiries"] = array_values(array_filter($store["enquiries"], function ($e) use ($id) {
      return ($e["id"] ?? "") !== $id;
    }));
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true]);
  }

  default:
    respond(400, ["ok" => false, "error" => "Unknown action."]);
}
