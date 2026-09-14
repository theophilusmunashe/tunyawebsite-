import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const dataDir = path.join(root, "public/api/content-data");
const storeFile = path.join(dataDir, "store.json");
const EXPECTED_KEY = process.env.TUNYA_MAIL_KEY || process.env.VITE_WORKSPACE_KEY || "123456";

function emptyStore() {
  return { items: [], fetchedAt: 0, updatedAt: 0 };
}

function loadStore() {
  try {
    if (!fs.existsSync(storeFile)) return emptyStore();
    const data = JSON.parse(fs.readFileSync(storeFile, "utf8"));
    return {
      items: Array.isArray(data.items) ? data.items : [],
      fetchedAt: Number(data.fetchedAt) || 0,
      updatedAt: Number(data.updatedAt) || 0
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  store.updatedAt = Date.now();
  fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));
}

function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function findById(list, id) {
  const idx = list.findIndex((row) => row.id === id);
  return [idx, idx >= 0 ? list[idx] : null];
}

function decodeEntities(text = "") {
  return String(text)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function stripText(html = "") {
  // Decode first so escaped markup like &lt;a href=...&gt; becomes strip-able tags.
  let text = decodeEntities(decodeEntities(html));
  text = text.replace(/<[^>]*>/g, " ");
  text = text.replace(/<[^>]*$/g, " "); // truncated tags from feed snippets
  text = text.replace(/https?:\/\/\S+/g, " ");
  text = decodeEntities(text);
  return text.replace(/\s+/g, " ").trim();
}

function shorten(text, max = 220) {
  const t = String(text || "").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 40 ? cut.slice(0, sp) : cut).replace(/[.,;:\s]+$/g, "")}…`;
}

function tourismRelevant(headline, summary) {
  const hay = `${headline} ${summary}`.toLowerCase();
  const hit = [
    "tourism", "tourist", "travel", "safari", "hotel", "lodge", "airline", "airport",
    "destination", "visitor", "hospitality", "resort", "wildlife", "national park",
    "victoria falls", "eco-tourism", "ecotourism", "holiday", "vacation", "cruise",
    "tour operator", "tour operators", "heritage site", "unesco", "guesthouse",
    "game drive", "national parks", "conservation travel"
  ].some((n) => hay.includes(n));
  if (!hit) return false;
  const blocked = ["election", "parliament", "corruption scandal", "arrested", "coup"];
  if (blocked.some((b) => hay.includes(b)) && !["tourism", "tourist", "travel"].some((k) => hay.includes(k))) {
    return false;
  }
  return true;
}

function defaultSources() {
  return [
    { id: "tourism-update", name: "Tourism Update", url: "https://www.tourismupdate.co.za/rss.xml", filter: true },
    { id: "bbc-africa", name: "BBC Africa", url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml", filter: true },
    { id: "guardian-africa", name: "The Guardian Africa", url: "https://www.theguardian.com/world/africa/rss", filter: true },
    {
      id: "gnews-africa-tourism",
      name: "Africa tourism round-up",
      url: "https://news.google.com/rss/search?q=Africa+(tourism+OR+safari+OR+%22tour+operator%22+OR+hospitality)+when:7d&hl=en-US&gl=US&ceid=US:en",
      filter: true
    },
    {
      id: "gnews-vicfalls",
      name: "Victoria Falls & Zimbabwe travel",
      url: "https://news.google.com/rss/search?q=(%22Victoria+Falls%22+OR+Zimbabwe)+(tourism+OR+travel+OR+safari+OR+hotel+OR+lodge)+when:14d&hl=en-US&gl=US&ceid=US:en",
      filter: true
    }
  ];
}

function parseRss(xml) {
  const items = [];
  const channelTitle = (xml.match(/<channel>[\s\S]*?<title>([\s\S]*?)<\/title>/i) || [])[1] || "";
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const block of blocks) {
    let title = stripText((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
    let link = (block.match(/<link[^>]*href=["']([^"']+)["']/i) || [])[1]
      || stripText((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || "");
    let desc = stripText((block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1]
      || (block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i) || [])[1]
      || "");
    let sourceName = stripText(channelTitle);
    const src = stripText((block.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1] || "");
    if (src) sourceName = src;
    const dash = title.match(/\s[-–—]\s(.+)$/);
    if (dash && dash[1].trim().length < 60) {
      sourceName = dash[1].trim();
      title = title.replace(/\s[-–—]\s.+$/, "").trim();
    }
    const pubRaw = (block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1]
      || (block.match(/<published[^>]*>([\s\S]*?)<\/published>/i) || [])[1]
      || "";
    const publishedAt = pubRaw ? (Date.parse(stripText(pubRaw)) || 0) : 0;
    if (!title || !link) continue;
    const summary = shorten(desc || title, 220) || shorten(title, 220);
    items.push({
      headline: shorten(title, 140),
      summary,
      sourceName: sourceName || "News source",
      sourceUrl: link,
      publishedAt
    });
  }
  return items;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "TunyafrikaContentBot/1.0 (+https://www.tunyafrika.com/content)",
      Accept: "application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function publicItem(item) {
  return {
    id: item.id || "",
    headline: item.headline || "",
    summary: item.summary || "",
    sourceName: item.sourceName || "",
    sourceUrl: item.sourceUrl || "",
    publishedAt: item.publishedAt || 0,
    approvedAt: item.approvedAt || 0
  };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function send(res, code, payload) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function requireAdmin(req, body) {
  const key = req.headers["x-tunya-key"] || body.key || "";
  if (key !== EXPECTED_KEY) {
    const err = new Error("Not authorised.");
    err.status = 403;
    throw err;
  }
}

async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  if (!url.pathname.endsWith("/api/content.php") && url.pathname !== "/api/content.php") return false;

  try {
    const method = req.method || "GET";
    let action = "";
    let body = {};
    if (method === "GET") action = url.searchParams.get("action") || "public_list";
    else if (method === "POST") {
      body = await readBody(req);
      action = body.action || "";
    } else if (method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return true;
    } else {
      send(res, 405, { ok: false, error: "Use GET or POST." });
      return true;
    }

    const store = loadStore();

    if (action === "public_list") {
      const items = store.items
        .filter((i) => i.status === "approved")
        .map(publicItem)
        .sort((a, b) => (b.approvedAt || b.publishedAt) - (a.approvedAt || a.publishedAt))
        .slice(0, 40);
      send(res, 200, { ok: true, items });
      return true;
    }

    if (action === "admin_bootstrap") {
      requireAdmin(req, body);
      send(res, 200, { ok: true, items: store.items, fetchedAt: store.fetchedAt, sources: defaultSources() });
      return true;
    }

    if (action === "fetch_updates") {
      requireAdmin(req, body);
      const existing = new Set(store.items.map((i) => crypto.createHash("md5").update(`${(i.headline || "").toLowerCase()}|${i.sourceUrl || ""}`).digest("hex")));
      let added = 0;
      let scanned = 0;
      const errors = [];
      const now = Date.now();
      for (const source of defaultSources()) {
        try {
          const xml = await fetchText(source.url);
          const entries = parseRss(xml);
          for (const entry of entries) {
            scanned += 1;
            if (source.filter && !tourismRelevant(entry.headline, entry.summary)) continue;
            const key = crypto.createHash("md5").update(`${entry.headline.toLowerCase()}|${entry.sourceUrl}`).digest("hex");
            if (existing.has(key)) continue;
            existing.add(key);
            store.items.unshift({
              id: uid("upd"),
              headline: entry.headline,
              summary: entry.summary,
              sourceName: entry.sourceName || source.name,
              sourceUrl: entry.sourceUrl,
              feedId: source.id,
              status: "pending",
              publishedAt: entry.publishedAt || now,
              createdAt: now,
              updatedAt: now,
              approvedAt: 0,
              postedAt: 0
            });
            added += 1;
          }
        } catch (err) {
          errors.push(`${source.name}: ${err.message || "could not fetch feed."}`);
        }
      }
      if (store.items.length > 250) {
        store.items = store.items.filter((i) => i.status === "approved" || i.status === "pending").slice(0, 250);
      }
      store.fetchedAt = now;
      saveStore(store);
      send(res, 200, { ok: true, added, scanned, errors, items: store.items, fetchedAt: store.fetchedAt });
      return true;
    }

    if (action === "import_url") {
      requireAdmin(req, body);
      const pageUrl = String(body.url || "").trim();
      if (!/^https?:\/\//i.test(pageUrl)) {
        send(res, 400, { ok: false, error: "Enter a valid article URL." });
        return true;
      }
      try {
        const html = await fetchText(pageUrl);
        const meta = (prop) => {
          const a = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"));
          if (a) return stripText(a[1]);
          const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i"));
          return b ? stripText(b[1]) : "";
        };
        let title = meta("og:title");
        if (!title) title = stripText((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
        let desc = meta("og:description");
        if (!desc) {
          const d = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
          desc = d ? stripText(d[1]) : "";
        }
        let site = meta("og:site_name");
        if (!site) {
          try { site = new URL(pageUrl).hostname.replace(/^www\./, ""); } catch { site = "Source"; }
        }
        if (!title) {
          send(res, 400, { ok: false, error: "Could not read that page. Paste the headline manually instead." });
          return true;
        }
        const now = Date.now();
        const item = {
          id: uid("upd"),
          headline: shorten(title, 140),
          summary: shorten(desc || title, 220),
          sourceName: site,
          sourceUrl: pageUrl,
          feedId: "manual",
          status: "pending",
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          approvedAt: 0,
          postedAt: 0
        };
        store.items.unshift(item);
        saveStore(store);
        send(res, 200, { ok: true, item });
      } catch (err) {
        send(res, 400, { ok: false, error: err.message || "Could not read that page." });
      }
      return true;
    }

    if (action === "save_item") {
      requireAdmin(req, body);
      const item = body.item || {};
      const [idx, existing] = findById(store.items, item.id);
      if (idx < 0) {
        send(res, 404, { ok: false, error: "Update not found." });
        return true;
      }
      const now = Date.now();
      let status = item.status || existing.status || "pending";
      if (!["pending", "approved", "rejected", "posted"].includes(status)) status = existing.status;
      const saved = {
        ...existing,
        headline: shorten(String(item.headline ?? existing.headline), 140),
        summary: shorten(String(item.summary ?? existing.summary), 220),
        sourceName: String(item.sourceName ?? existing.sourceName).trim(),
        sourceUrl: String(item.sourceUrl ?? existing.sourceUrl).trim(),
        status,
        updatedAt: now
      };
      if (status === "approved" && !existing.approvedAt) saved.approvedAt = now;
      if (status === "posted") {
        saved.postedAt = now;
        if (!saved.approvedAt) saved.approvedAt = now;
      }
      store.items[idx] = saved;
      saveStore(store);
      send(res, 200, { ok: true, item: saved });
      return true;
    }

    if (action === "delete_item") {
      requireAdmin(req, body);
      store.items = store.items.filter((i) => i.id !== body.id);
      saveStore(store);
      send(res, 200, { ok: true });
      return true;
    }

    send(res, 400, { ok: false, error: "Unknown action." });
    return true;
  } catch (err) {
    send(res, err.status || 500, { ok: false, error: err.message || "Server error." });
    return true;
  }
}

export function contentApiPlugin() {
  return {
    name: "content-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          if (!(await handle(req, res))) next();
        } catch (err) {
          next(err);
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          if (!(await handle(req, res))) next();
        } catch (err) {
          next(err);
        }
      });
    }
  };
}
