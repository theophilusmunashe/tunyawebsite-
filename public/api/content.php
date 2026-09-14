<?php
/**
 * Tunyafrika content engine — Africa tourism headlines for admin review.
 * Stores only headline + short summary + source link (no full articles).
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
$DATA_DIR = __DIR__ . "/content-data";
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
  return ["items" => [], "fetchedAt" => 0, "updatedAt" => 0];
}

function load_store($file) {
  if (!is_file($file)) return empty_store();
  $data = json_decode((string)file_get_contents($file), true);
  if (!is_array($data)) return empty_store();
  return [
    "items" => array_values($data["items"] ?? []),
    "fetchedAt" => (int)($data["fetchedAt"] ?? 0),
    "updatedAt" => (int)($data["updatedAt"] ?? 0)
  ];
}

function save_store($file, $store) {
  $store["updatedAt"] = (int)(microtime(true) * 1000);
  $tmp = $file . ".tmp";
  $json = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  if (file_put_contents($tmp, $json, LOCK_EX) === false) {
    respond(500, ["ok" => false, "error" => "Could not save content."]);
  }
  if (!rename($tmp, $file)) {
    @unlink($tmp);
    respond(500, ["ok" => false, "error" => "Could not finalise save."]);
  }
}


function t_len($s) { return function_exists("mb_strlen") ? mb_strlen($s) : strlen($s); }
function t_lower($s) { return function_exists("mb_strtolower") ? mb_strtolower($s) : strtolower($s); }
function t_substr($s, $start, $len = null) {
  if (function_exists("mb_substr")) return $len === null ? mb_substr($s, $start) : mb_substr($s, $start, $len);
  return $len === null ? substr($s, $start) : substr($s, $start, $len);
}
function t_strrpos($hay, $needle) {
  return function_exists("mb_strrpos") ? mb_strrpos($hay, $needle) : strrpos($hay, $needle);
}
function t_strpos($hay, $needle) {
  return function_exists("mb_strpos") ? mb_strpos($hay, $needle) : strpos($hay, $needle);
}

function uid($prefix) {
  return $prefix . "_" . bin2hex(random_bytes(6));
}

function request_key() {
  return (string)($_SERVER["HTTP_X_TUNYA_KEY"] ?? "");
}

function require_admin($expected) {
  global $body;
  $key = request_key();
  if ($key === "" && is_array($body)) $key = (string)($body["key"] ?? "");
  if (!hash_equals($expected, $key)) {
    respond(403, ["ok" => false, "error" => "Not authorised."]);
  }
}

function find_by_id($list, $id) {
  foreach ($list as $i => $row) {
    if (($row["id"] ?? "") === $id) return [$i, $row];
  }
  return [-1, null];
}

function public_item($item) {
  return [
    "id" => (string)($item["id"] ?? ""),
    "headline" => (string)($item["headline"] ?? ""),
    "summary" => (string)($item["summary"] ?? ""),
    "sourceName" => (string)($item["sourceName"] ?? ""),
    "sourceUrl" => (string)($item["sourceUrl"] ?? ""),
    "publishedAt" => (int)($item["publishedAt"] ?? 0),
    "approvedAt" => (int)($item["approvedAt"] ?? 0)
  ];
}

function http_get($url, $asBrowser = false) {
  $ua = $asBrowser
    ? "Mozilla/5.0 (compatible; TunyafrikaContentBot/1.1; +https://www.tunyafrika.com/content) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    : "TunyafrikaContentBot/1.1 (+https://www.tunyafrika.com/content)";
  $accept = $asBrowser
    ? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    : "application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8";
  if (function_exists("curl_init")) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_MAXREDIRS => 8,
      CURLOPT_TIMEOUT => 25,
      CURLOPT_CONNECTTIMEOUT => 12,
      CURLOPT_ENCODING => "",
      CURLOPT_USERAGENT => $ua,
      CURLOPT_HTTPHEADER => [
        "Accept: " . $accept,
        "Accept-Language: en-US,en;q=0.9",
        "Cache-Control: no-cache"
      ]
    ]);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $code >= 400) return null;
    return $body;
  }
  $ctx = stream_context_create([
    "http" => [
      "timeout" => 25,
      "follow_location" => 1,
      "header" => "User-Agent: {$ua}\r\nAccept: {$accept}\r\nAccept-Language: en-US,en;q=0.9\r\n"
    ]
  ]);
  $body = @file_get_contents($url, false, $ctx);
  return $body === false ? null : $body;
}

function strip_text($html) {
  // Decode before stripping so escaped markup (&lt;a...&gt;) does not leak into summaries.
  $decoded = html_entity_decode((string)$html, ENT_QUOTES | ENT_HTML5, "UTF-8");
  $decoded = html_entity_decode($decoded, ENT_QUOTES | ENT_HTML5, "UTF-8");
  $text = strip_tags($decoded);
  // Drop truncated tags and bare URLs left by feed snippets.
  $text = preg_replace('/<[^>]*$/u', ' ', $text);
  $text = preg_replace('#https?://\S+#u', ' ', $text);
  $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, "UTF-8");
  $text = preg_replace("/\s+/u", " ", $text);
  return trim((string)$text, " \t\n\r\0\x0B.,;:-");
}

function shorten($text, $max = 220) {
  $text = trim((string)$text);
  if (t_len($text) <= $max) return $text;
  $cut = t_substr($text, 0, $max - 1);
  $sp = t_strrpos($cut, " ");
  if ($sp !== false && $sp > 40) $cut = t_substr($cut, 0, $sp);
  return rtrim($cut, ".,;: ") . "…";
}

function tourism_relevant($headline, $summary) {
  $hay = t_lower($headline . " " . $summary);
  $needles = [
    "tourism", "tourist", "travel", "safari", "hotel", "lodge", "airline", "airport",
    "destination", "visitor", "hospitality", "resort", "wildlife", "national park",
    "victoria falls", "eco-tourism", "ecotourism", "holiday", "vacation", "cruise",
    "tour operator", "tour operators", "heritage site", "unesco", "guesthouse",
    "backpack", "migratory", "game drive", "national parks", "conservation travel"
  ];
  $hit = false;
  foreach ($needles as $n) {
    if (t_strpos($hay, $n) !== false) { $hit = true; break; }
  }
  if (!$hit) return false;
  // Drop obvious non-travel politics even if a destination word slipped in.
  $block = ["election", "parliament", "corruption scandal", "arrested", "coup"];
  foreach ($block as $b) {
    if (t_strpos($hay, $b) !== false && t_strpos($hay, "tourism") === false && t_strpos($hay, "tourist") === false && t_strpos($hay, "travel") === false) {
      return false;
    }
  }
  return true;
}

function parse_rss_items($xml) {
  $out = [];
  libxml_use_internal_errors(true);
  $feed = @simplexml_load_string($xml);
  if (!$feed) return $out;

  $channelTitle = "";
  if (isset($feed->channel->title)) $channelTitle = strip_text((string)$feed->channel->title);

  $entries = [];
  if (isset($feed->channel->item)) $entries = $feed->channel->item;
  elseif (isset($feed->entry)) $entries = $feed->entry;

  foreach ($entries as $entry) {
    $title = strip_text((string)($entry->title ?? ""));
    $link = "";
    if (isset($entry->link["href"])) $link = (string)$entry->link["href"];
    elseif (isset($entry->link)) $link = (string)$entry->link;
    $desc = "";
    if (isset($entry->description)) $desc = strip_text((string)$entry->description);
    elseif (isset($entry->summary)) $desc = strip_text((string)$entry->summary);
    elseif (isset($entry->children("http://purl.org/rss/1.0/modules/content/")->encoded)) {
      $desc = strip_text((string)$entry->children("http://purl.org/rss/1.0/modules/content/")->encoded);
    }
    $sourceName = $channelTitle;
    if (isset($entry->source)) $sourceName = strip_text((string)$entry->source) ?: $sourceName;
    // Google News titles often end with " - Publisher"
    if (preg_match('/\s[-–—]\s(.+)$/u', $title, $m)) {
      $maybe = trim($m[1]);
      if ($maybe !== "" && t_len($maybe) < 60) {
        $sourceName = $maybe;
        $title = trim(preg_replace('/\s[-–—]\s.+$/u', "", $title));
      }
    }
    $pub = 0;
    if (isset($entry->pubDate)) $pub = strtotime((string)$entry->pubDate) ?: 0;
    elseif (isset($entry->published)) $pub = strtotime((string)$entry->published) ?: 0;
    elseif (isset($entry->updated)) $pub = strtotime((string)$entry->updated) ?: 0;

    if ($title === "" || $link === "") continue;
    $summary = shorten($desc !== "" ? $desc : $title, 220);
    if ($summary === "") $summary = shorten($title, 220);
    $out[] = [
      "headline" => shorten($title, 140),
      "summary" => $summary,
      "sourceName" => $sourceName !== "" ? $sourceName : "News source",
      "sourceUrl" => $link,
      "publishedAt" => $pub ? $pub * 1000 : 0
    ];
  }
  return $out;
}

function default_sources() {
  return [
    [
      "id" => "tourism-update",
      "name" => "Tourism Update",
      "url" => "https://www.tourismupdate.co.za/rss.xml",
      "filter" => true
    ],
    [
      "id" => "bbc-africa",
      "name" => "BBC Africa",
      "url" => "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
      "filter" => true
    ],
    [
      "id" => "guardian-africa",
      "name" => "The Guardian Africa",
      "url" => "https://www.theguardian.com/world/africa/rss",
      "filter" => true
    ],
    [
      "id" => "gnews-africa-tourism",
      "name" => "Africa tourism round-up",
      "url" => "https://news.google.com/rss/search?q=Africa+(tourism+OR+safari+OR+%22tour+operator%22+OR+hospitality)+when:7d&hl=en-US&gl=US&ceid=US:en",
      "filter" => true
    ],
    [
      "id" => "gnews-vicfalls",
      "name" => "Victoria Falls & Zimbabwe travel",
      "url" => "https://news.google.com/rss/search?q=(%22Victoria+Falls%22+OR+Zimbabwe)+(tourism+OR+travel+OR+safari+OR+hotel+OR+lodge)+when:14d&hl=en-US&gl=US&ceid=US:en",
      "filter" => true
    ]
  ];
}

function meta_content($html, $attr, $value) {
  $q = preg_quote($value, "/");
  if (preg_match('/<meta[^>]+' . $attr . '=["\']' . $q . '["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m)) {
    return html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, "UTF-8");
  }
  if (preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+' . $attr . '=["\']' . $q . '["\']/i', $html, $m)) {
    return html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, "UTF-8");
  }
  return "";
}

function json_ld_field($html, $field) {
  if (!preg_match_all('/<script[^>]+type=["\']application\/ld\+json["\'][^>]*>([\s\S]*?)<\/script>/i', $html, $blocks)) {
    return "";
  }
  foreach ($blocks[1] as $raw) {
    $data = json_decode(trim($raw), true);
    if (!$data) continue;
    $nodes = isset($data["@graph"]) && is_array($data["@graph"]) ? $data["@graph"] : [$data];
    foreach ($nodes as $node) {
      if (!is_array($node)) continue;
      if (!empty($node[$field]) && is_string($node[$field])) return $node[$field];
      if ($field === "headline" && !empty($node["name"]) && is_string($node["name"])) return $node["name"];
      if ($field === "description" && !empty($node["abstract"]) && is_string($node["abstract"])) return $node["abstract"];
    }
  }
  return "";
}

function fetch_og($url) {
  $html = http_get($url, true);
  if (!$html) $html = http_get($url, false);
  if (!$html) return null;

  $title = meta_content($html, "property", "og:title");
  if ($title === "") $title = meta_content($html, "name", "twitter:title");
  if ($title === "") $title = meta_content($html, "name", "title");
  if ($title === "") $title = meta_content($html, "itemprop", "headline");
  if ($title === "") $title = strip_text(json_ld_field($html, "headline"));
  if ($title === "" && preg_match('/<h1[^>]*>([\s\S]*?)<\/h1>/i', $html, $m)) $title = strip_text($m[1]);
  if ($title === "" && preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $m)) $title = strip_text($m[1]);

  $desc = meta_content($html, "property", "og:description");
  if ($desc === "") $desc = meta_content($html, "name", "twitter:description");
  if ($desc === "") $desc = meta_content($html, "name", "description");
  if ($desc === "") $desc = meta_content($html, "itemprop", "description");
  if ($desc === "") $desc = strip_text(json_ld_field($html, "description"));

  $site = meta_content($html, "property", "og:site_name");
  if ($site === "") {
    $host = parse_url($url, PHP_URL_HOST);
    $site = $host ? preg_replace('/^www\./', '', $host) : "Source";
  }
  if (trim($title) === "") return null;
  return [
    "headline" => shorten(strip_text($title), 140),
    "summary" => shorten(strip_text($desc !== "" ? $desc : $title), 220),
    "sourceName" => strip_text($site) ?: $site,
    "sourceUrl" => $url,
    "publishedAt" => (int)(microtime(true) * 1000)
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
  if (!is_array($body)) respond(400, ["ok" => false, "error" => "Invalid request."]);
  $action = (string)($body["action"] ?? "");
} else {
  respond(405, ["ok" => false, "error" => "Use GET or POST."]);
}

$store = load_store($STORE_FILE);

switch ($action) {
  case "public_list": {
    $items = [];
    foreach ($store["items"] as $item) {
      if (($item["status"] ?? "") !== "approved") continue;
      $items[] = public_item($item);
    }
    usort($items, function ($a, $b) {
      return ($b["approvedAt"] ?: $b["publishedAt"]) <=> ($a["approvedAt"] ?: $a["publishedAt"]);
    });
    respond(200, ["ok" => true, "items" => array_slice($items, 0, 40)]);
  }

  case "admin_bootstrap": {
    require_admin($EXPECTED_KEY);
    respond(200, [
      "ok" => true,
      "items" => $store["items"],
      "fetchedAt" => $store["fetchedAt"],
      "sources" => default_sources()
    ]);
  }

  case "fetch_updates": {
    require_admin($EXPECTED_KEY);
    $sources = default_sources();
    $existingKeys = [];
    foreach ($store["items"] as $item) {
      $existingKeys[md5(t_lower(($item["headline"] ?? "") . "|" . ($item["sourceUrl"] ?? "")))] = true;
    }
    $added = 0;
    $scanned = 0;
    $errors = [];
    $now = (int)(microtime(true) * 1000);
    foreach ($sources as $source) {
      $xml = http_get($source["url"]);
      if ($xml === null) {
        $errors[] = $source["name"] . ": could not fetch feed.";
        continue;
      }
      $entries = parse_rss_items($xml);
      foreach ($entries as $entry) {
        $scanned++;
        if (!empty($source["filter"]) && !tourism_relevant($entry["headline"], $entry["summary"])) continue;
        $key = md5(t_lower($entry["headline"] . "|" . $entry["sourceUrl"]));
        if (isset($existingKeys[$key])) continue;
        $existingKeys[$key] = true;
        $item = [
          "id" => uid("upd"),
          "headline" => $entry["headline"],
          "summary" => $entry["summary"],
          "sourceName" => $entry["sourceName"] ?: $source["name"],
          "sourceUrl" => $entry["sourceUrl"],
          "feedId" => $source["id"],
          "status" => "pending",
          "publishedAt" => $entry["publishedAt"] ?: $now,
          "createdAt" => $now,
          "updatedAt" => $now,
          "approvedAt" => 0,
          "postedAt" => 0
        ];
        array_unshift($store["items"], $item);
        $added++;
      }
    }
    // Keep store lean
    if (count($store["items"]) > 250) {
      $keep = [];
      foreach ($store["items"] as $item) {
        if (($item["status"] ?? "") === "approved" || ($item["status"] ?? "") === "pending") $keep[] = $item;
        if (count($keep) >= 250) break;
      }
      $store["items"] = $keep;
    }
    $store["fetchedAt"] = $now;
    save_store($STORE_FILE, $store);
    respond(200, [
      "ok" => true,
      "added" => $added,
      "scanned" => $scanned,
      "errors" => $errors,
      "items" => $store["items"],
      "fetchedAt" => $store["fetchedAt"]
    ]);
  }

  case "import_url": {
    require_admin($EXPECTED_KEY);
    $url = trim((string)($body["url"] ?? ""));
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
      respond(400, ["ok" => false, "error" => "Enter a valid article URL."]);
    }
    $og = fetch_og($url);
    if (!$og) respond(400, ["ok" => false, "error" => "Could not read that page. Paste the headline manually instead."]);
    $now = (int)(microtime(true) * 1000);
    $item = [
      "id" => uid("upd"),
      "headline" => $og["headline"],
      "summary" => $og["summary"],
      "sourceName" => $og["sourceName"],
      "sourceUrl" => $og["sourceUrl"],
      "feedId" => "manual",
      "status" => "pending",
      "publishedAt" => $og["publishedAt"],
      "createdAt" => $now,
      "updatedAt" => $now,
      "approvedAt" => 0,
      "postedAt" => 0
    ];
    array_unshift($store["items"], $item);
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "item" => $item]);
  }

  case "save_item": {
    require_admin($EXPECTED_KEY);
    $item = $body["item"] ?? null;
    if (!is_array($item) || empty($item["id"])) respond(400, ["ok" => false, "error" => "Missing update."]);
    [$idx, $existing] = find_by_id($store["items"], $item["id"]);
    if ($idx < 0) respond(404, ["ok" => false, "error" => "Update not found."]);
    $now = (int)(microtime(true) * 1000);
    $status = (string)($item["status"] ?? $existing["status"] ?? "pending");
    if (!in_array($status, ["pending", "approved", "rejected", "posted"], true)) $status = $existing["status"];
    $saved = array_merge($existing, [
      "headline" => shorten(trim((string)($item["headline"] ?? $existing["headline"])), 140),
      "summary" => shorten(trim((string)($item["summary"] ?? $existing["summary"])), 220),
      "sourceName" => trim((string)($item["sourceName"] ?? $existing["sourceName"])),
      "sourceUrl" => trim((string)($item["sourceUrl"] ?? $existing["sourceUrl"])),
      "status" => $status,
      "updatedAt" => $now
    ]);
    if ($status === "approved" && empty($existing["approvedAt"])) $saved["approvedAt"] = $now;
    if ($status === "posted") {
      $saved["postedAt"] = $now;
      if (empty($saved["approvedAt"])) $saved["approvedAt"] = $now;
    }
    if ($status === "pending" || $status === "rejected") {
      // keep approvedAt history if any
    }
    $store["items"][$idx] = $saved;
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true, "item" => $saved]);
  }

  case "delete_item": {
    require_admin($EXPECTED_KEY);
    $id = trim((string)($body["id"] ?? ""));
    $store["items"] = array_values(array_filter($store["items"], function ($row) use ($id) {
      return ($row["id"] ?? "") !== $id;
    }));
    save_store($STORE_FILE, $store);
    respond(200, ["ok" => true]);
  }

  default:
    respond(400, ["ok" => false, "error" => "Unknown action."]);
}
