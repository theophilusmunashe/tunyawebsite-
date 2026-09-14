import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const dataDir = path.join(root, "public/api/accomodations-data");
const storeFile = path.join(dataDir, "store.json");
const mediaDir = path.join(root, "public/accomodations-media");
const EXPECTED_KEY = process.env.TUNYA_MAIL_KEY || process.env.VITE_WORKSPACE_KEY || "123456";

function emptyStore() {
  return { providers: [], listings: [], enquiries: [], updatedAt: 0 };
}

function loadStore() {
  try {
    if (!fs.existsSync(storeFile)) return emptyStore();
    const data = JSON.parse(fs.readFileSync(storeFile, "utf8"));
    return {
      providers: Array.isArray(data.providers) ? data.providers : [],
      listings: Array.isArray(data.listings) ? data.listings : [],
      enquiries: Array.isArray(data.enquiries) ? data.enquiries : [],
      updatedAt: Number(data.updatedAt) || 0
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(mediaDir, { recursive: true });
  store.updatedAt = Date.now();
  fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));
}

function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function publicListing(listing) {
  const images = (listing.images || []).map((img) => ({
    id: String(img.id || ""),
    url: String(img.url || ""),
    caption: String(img.caption || "")
  }));
  const pricing = listing.pricing || {};
  const capacity = listing.capacity || {};
  return {
    id: listing.id || "",
    title: listing.title || "",
    subtitle: listing.subtitle || "",
    summary: listing.summary || "",
    propertyType: listing.propertyType || "",
    amenities: (listing.amenities || []).map(String).filter(Boolean),
    pricing: {
      currency: pricing.currency || "USD",
      amount: Number(pricing.amount) || 0,
      unit: pricing.unit || "per night",
      note: pricing.note || ""
    },
    capacity: {
      guests: capacity.guests || "",
      rooms: capacity.rooms || ""
    },
    images,
    coverUrl: listing.coverUrl || images[0]?.url || "",
    status: listing.status || "draft",
    updatedAt: listing.updatedAt || 0,
    publishedAt: listing.publishedAt || 0
  };
}

function findById(list, id) {
  const idx = list.findIndex((row) => row.id === id);
  return [idx, idx >= 0 ? list[idx] : null];
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
  if (!url.pathname.endsWith("/api/accomodations.php") && url.pathname !== "/api/accomodations.php") {
    return false;
  }

  try {
    const method = req.method || "GET";
    let action = "";
    let body = {};
    if (method === "GET") {
      action = url.searchParams.get("action") || "public_list";
    } else if (method === "POST") {
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
      const listings = store.listings
        .filter((l) => l.status === "published")
        .map(publicListing)
        .sort((a, b) => (b.publishedAt || b.updatedAt) - (a.publishedAt || a.updatedAt));
      send(res, 200, { ok: true, listings });
      return true;
    }

    if (action === "public_get") {
      const id = url.searchParams.get("id") || body.id || "";
      const [, listing] = findById(store.listings, id);
      if (!listing || listing.status !== "published") {
        send(res, 404, { ok: false, error: "Stay not found." });
        return true;
      }
      send(res, 200, { ok: true, listing: publicListing(listing) });
      return true;
    }

    if (action === "enquire") {
      const listingId = String(body.listingId || "").trim();
      const [, listing] = findById(store.listings, listingId);
      if (!listing || listing.status !== "published") {
        send(res, 404, { ok: false, error: "Stay not found." });
        return true;
      }
      const guestName = String(body.guestName || "").trim();
      const guestEmail = String(body.guestEmail || "").trim();
      const guestPhone = String(body.guestPhone || "").trim();
      if (!guestName || (!guestEmail && !guestPhone)) {
        send(res, 400, { ok: false, error: "Add your name and an email or phone number." });
        return true;
      }
      const now = Date.now();
      const enquiry = {
        id: uid("enq"),
        listingId,
        listingTitle: listing.title || "",
        providerId: listing.providerId || "",
        guestName,
        guestEmail,
        guestPhone,
        checkIn: String(body.checkIn || "").trim(),
        checkOut: String(body.checkOut || "").trim(),
        guests: String(body.guests || "").trim(),
        message: String(body.message || "").trim(),
        status: "new",
        staffNotes: "",
        createdAt: now,
        updatedAt: now
      };
      store.enquiries.unshift(enquiry);
      saveStore(store);
      send(res, 200, { ok: true, enquiryId: enquiry.id });
      return true;
    }

    if (action === "admin_bootstrap") {
      requireAdmin(req, body);
      send(res, 200, {
        ok: true,
        providers: store.providers,
        listings: store.listings,
        enquiries: store.enquiries,
        updatedAt: store.updatedAt
      });
      return true;
    }

    if (action === "save_provider") {
      requireAdmin(req, body);
      const provider = body.provider || {};
      const now = Date.now();
      const id = String(provider.id || "").trim() || uid("prv");
      const saved = {
        id,
        name: String(provider.name || "").trim(),
        contactName: String(provider.contactName || "").trim(),
        phone: String(provider.phone || "").trim(),
        email: String(provider.email || "").trim(),
        whatsapp: String(provider.whatsapp || "").trim(),
        address: String(provider.address || "").trim(),
        notes: String(provider.notes || "").trim(),
        createdAt: provider.createdAt || now,
        updatedAt: now
      };
      if (!saved.name) {
        send(res, 400, { ok: false, error: "Provider name is required." });
        return true;
      }
      const [idx] = findById(store.providers, id);
      if (idx >= 0) store.providers[idx] = saved;
      else store.providers.unshift(saved);
      saveStore(store);
      send(res, 200, { ok: true, provider: saved });
      return true;
    }

    if (action === "delete_provider") {
      requireAdmin(req, body);
      store.providers = store.providers.filter((p) => p.id !== body.id);
      saveStore(store);
      send(res, 200, { ok: true });
      return true;
    }

    if (action === "save_listing") {
      requireAdmin(req, body);
      const listing = body.listing || {};
      const now = Date.now();
      const id = String(listing.id || "").trim() || uid("lst");
      const [idx, existing] = findById(store.listings, id);
      let status = listing.status || "draft";
      if (!["draft", "published", "paused"].includes(status)) status = "draft";
      const pricing = listing.pricing || {};
      const capacity = listing.capacity || {};
      const location = listing.location || {};
      let amenities = [];
      if (Array.isArray(listing.amenities)) amenities = listing.amenities.map(String).map((s) => s.trim()).filter(Boolean);
      else if (typeof listing.amenities === "string") {
        amenities = listing.amenities.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
      }
      const images = (listing.images || existing?.images || [])
        .filter((img) => img && img.url)
        .map((img) => ({
          id: img.id || uid("img"),
          url: img.url,
          caption: img.caption || ""
        }));
      let publishedAt = existing?.publishedAt || 0;
      if (status === "published" && !publishedAt) publishedAt = now;
      else publishedAt = listing.publishedAt ?? publishedAt;
      const saved = {
        id,
        providerId: String(listing.providerId || "").trim(),
        title: String(listing.title || "").trim(),
        subtitle: String(listing.subtitle || "").trim(),
        summary: String(listing.summary || "").trim(),
        propertyType: String(listing.propertyType || "Lodge").trim(),
        amenities,
        pricing: {
          currency: String(pricing.currency || "USD").trim() || "USD",
          amount: Number(pricing.amount) || 0,
          unit: String(pricing.unit || "per night").trim() || "per night",
          note: String(pricing.note || "").trim()
        },
        capacity: {
          guests: String(capacity.guests || "").trim(),
          rooms: String(capacity.rooms || "").trim()
        },
        images,
        coverUrl: String(listing.coverUrl || images[0]?.url || "").trim(),
        location: {
          area: String(location.area || "").trim(),
          address: String(location.address || "").trim(),
          mapsNote: String(location.mapsNote || "").trim()
        },
        providerNotes: String(listing.providerNotes || "").trim(),
        availabilityNote: String(listing.availabilityNote || "").trim(),
        status,
        createdAt: existing?.createdAt || listing.createdAt || now,
        updatedAt: now,
        publishedAt
      };
      if (!saved.title) {
        send(res, 400, { ok: false, error: "Listing title is required." });
        return true;
      }
      if (idx >= 0) store.listings[idx] = saved;
      else store.listings.unshift(saved);
      saveStore(store);
      send(res, 200, { ok: true, listing: saved });
      return true;
    }

    if (action === "delete_listing") {
      requireAdmin(req, body);
      const [, listing] = findById(store.listings, body.id);
      if (listing) {
        for (const img of listing.images || []) {
          if (String(img.url || "").startsWith("/accomodations-media/")) {
            const abs = path.join(root, "public", img.url.replace(/^\//, ""));
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
          }
        }
      }
      store.listings = store.listings.filter((l) => l.id !== body.id);
      saveStore(store);
      send(res, 200, { ok: true });
      return true;
    }

    if (action === "upload_image") {
      requireAdmin(req, body);
      const listingId = String(body.listingId || "").trim();
      const [idx, listing] = findById(store.listings, listingId);
      if (idx < 0) {
        send(res, 404, { ok: false, error: "Listing not found. Save the stay first, then add photos." });
        return true;
      }
      let dataBase64 = String(body.dataBase64 || "").replace(/\s+/g, "");
      if (dataBase64.startsWith("data:")) dataBase64 = dataBase64.split(",")[1] || "";
      const bin = Buffer.from(dataBase64, "base64");
      if (bin.length < 32) {
        send(res, 400, { ok: false, error: "Image data was invalid." });
        return true;
      }
      if (bin.length > 8 * 1024 * 1024) {
        send(res, 400, { ok: false, error: "Image is too large (max 8MB)." });
        return true;
      }
      const head = bin.subarray(0, 12);
      let ext = "jpg";
      if (head[0] === 0x89 && head[1] === 0x50) ext = "png";
      else if (head[0] === 0x47 && head[1] === 0x49) ext = "gif";
      else if (head.toString("ascii", 0, 4) === "RIFF" && head.toString("ascii", 8, 12) === "WEBP") ext = "webp";
      else if (!(head[0] === 0xff && head[1] === 0xd8)) {
        send(res, 400, { ok: false, error: "Use a JPG, PNG, WEBP or GIF image." });
        return true;
      }
      const imageId = uid("img");
      const safeName = `${listingId}-${imageId}.${ext}`;
      fs.mkdirSync(mediaDir, { recursive: true });
      fs.writeFileSync(path.join(mediaDir, safeName), bin);
      const url = `/accomodations-media/${safeName}`;
      const image = {
        id: imageId,
        url,
        caption: String(body.caption || "").trim(),
        name: String(body.filename || "photo.jpg")
      };
      const images = [...(listing.images || []), image];
      const next = {
        ...listing,
        images,
        coverUrl: listing.coverUrl || url,
        updatedAt: Date.now()
      };
      store.listings[idx] = next;
      saveStore(store);
      send(res, 200, { ok: true, image, listing: next });
      return true;
    }

    if (action === "delete_image") {
      requireAdmin(req, body);
      const [idx, listing] = findById(store.listings, body.listingId);
      if (idx < 0) {
        send(res, 404, { ok: false, error: "Listing not found." });
        return true;
      }
      const kept = [];
      for (const img of listing.images || []) {
        if (img.id === body.imageId) {
          if (String(img.url || "").startsWith("/accomodations-media/")) {
            const abs = path.join(root, "public", img.url.replace(/^\//, ""));
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
          }
          continue;
        }
        kept.push(img);
      }
      const next = {
        ...listing,
        images: kept,
        coverUrl: kept.some((i) => i.url === listing.coverUrl) ? listing.coverUrl : (kept[0]?.url || ""),
        updatedAt: Date.now()
      };
      store.listings[idx] = next;
      saveStore(store);
      send(res, 200, { ok: true, listing: next });
      return true;
    }

    if (action === "save_enquiry") {
      requireAdmin(req, body);
      const enquiry = body.enquiry || {};
      const [idx, existing] = findById(store.enquiries, enquiry.id);
      if (idx < 0) {
        send(res, 404, { ok: false, error: "Enquiry not found." });
        return true;
      }
      const allowed = ["new", "contacting", "awaiting_provider", "replied", "closed"];
      const status = allowed.includes(enquiry.status) ? enquiry.status : existing.status;
      const saved = {
        ...existing,
        status,
        staffNotes: String(enquiry.staffNotes ?? existing.staffNotes ?? "").trim(),
        updatedAt: Date.now()
      };
      store.enquiries[idx] = saved;
      saveStore(store);
      send(res, 200, { ok: true, enquiry: saved });
      return true;
    }

    if (action === "delete_enquiry") {
      requireAdmin(req, body);
      store.enquiries = store.enquiries.filter((e) => e.id !== body.id);
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

export function accomodationsApiPlugin() {
  return {
    name: "accomodations-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handle(req, res);
          if (!handled) next();
        } catch (err) {
          next(err);
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handle(req, res);
          if (!handled) next();
        } catch (err) {
          next(err);
        }
      });
    }
  };
}
