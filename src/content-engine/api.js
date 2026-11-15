import { adminFetch } from "../lib/adminSession.js";

const RELATIVE_ENDPOINT = "/api/content.php";
const LIVE_ENDPOINT = "https://www.tunyafrika.com/api/content.php";

/** Hosts that can execute /api/content.php (cPanel PHP or local Vite plugin). */
function canRunPhpApi(hostname = "") {
  const host = String(hostname || "").toLowerCase();
  if (!host || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return true;
  if (host === "www.tunyafrika.com" || host === "tunyafrika.com") return true;
  return false;
}

/** Static preview hosts (Vercel/Netlify) serve .php as files — POST returns 405. */
export function isStaticPreviewHost(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  const host = String(hostname || "").toLowerCase();
  if (!host) return false;
  return (
    host.endsWith(".vercel.app") ||
    host.endsWith(".netlify.app") ||
    host.endsWith(".netlify.com") ||
    host.includes("vercel") ||
    host.includes("netlify")
  );
}

/**
 * Prefer relative /api on the live site and local Vite.
 * On Vercel/Netlify (and other static hosts), call the live cPanel API so admin
 * actions do not hit HTTP 405 from a non-executing PHP file.
 */
export function contentEndpoint() {
  const override = import.meta.env.VITE_CONTENT_API_URL;
  if (override) return String(override).replace(/\/$/, "");
  if (typeof window === "undefined") return RELATIVE_ENDPOINT;
  const host = window.location.hostname;
  if (canRunPhpApi(host)) return RELATIVE_ENDPOINT;
  if (isStaticPreviewHost(host)) return LIVE_ENDPOINT;
  // Unknown deploy target: try live API so POST is not stuck on static 405.
  return LIVE_ENDPOINT;
}

export function usesRemoteContentApi() {
  return contentEndpoint() === LIVE_ENDPOINT || Boolean(import.meta.env.VITE_CONTENT_API_URL);
}

function httpErrorMessage(status, data = {}) {
  if (data.error) return data.error;
  if (status === 405) {
    return "Content API returned HTTP 405. Use https://www.tunyafrika.com/admin — Vercel/static hosts cannot run the PHP content engine.";
  }
  if (status === 0 || status === 404) {
    return `Request failed (${status}). Open the admin on https://www.tunyafrika.com/admin.`;
  }
  return `Request failed (${status})`;
}

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    const err = new Error(httpErrorMessage(res.status, data));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function adminPost(action, payload = {}) {
  // Admin actions are same-origin only (session cookie + CSRF). Previews on
  // Vercel/Netlify can read public updates but cannot sign in.
  return parse(await adminFetch(RELATIVE_ENDPOINT, { method: "POST", body: { action, ...payload } }));
}

export async function publicUpdates() {
  let endpoint = contentEndpoint();
  let res = await fetch(`${endpoint}?action=public_list`, {
    headers: { Accept: "application/json" }
  });
  if ((res.status === 405 || res.status === 404) && endpoint !== LIVE_ENDPOINT) {
    res = await fetch(`${LIVE_ENDPOINT}?action=public_list`, {
      headers: { Accept: "application/json" }
    });
  }
  const data = await parse(res);
  return data.items || [];
}

export async function adminBootstrap() {
  return adminPost("admin_bootstrap");
}

export async function fetchUpdates() {
  return adminPost("fetch_updates");
}

export async function importUrl(url) {
  const data = await adminPost("import_url", { url });
  return data.item;
}

export async function saveItem(item) {
  const data = await adminPost("save_item", { item });
  return data.item;
}

export async function deleteItem(id) {
  return adminPost("delete_item", { id });
}

/** Strip leftover feed markup from headlines/summaries before display or share. */
export function cleanCopy(text = "") {
  return String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<[^>]*>/g, " ")
    .replace(/<[^>]*$/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function captionFor(item) {
  const lines = [
    "Tunyafrika Updates",
    "",
    cleanCopy(item.headline || ""),
    cleanCopy(item.summary || ""),
    "",
    item.sourceName ? `Source: ${item.sourceName}` : null,
    item.sourceUrl || null,
    "",
    "www.tunyafrika.com"
  ].filter((line) => line !== null);
  return lines.join("\n").trim();
}

export function socialOpeners(item) {
  const text = captionFor(item);
  const encoded = encodeURIComponent(text);
  const url = encodeURIComponent(item.sourceUrl || "https://www.tunyafrika.com/content");
  return {
    x: `https://twitter.com/intent/tweet?text=${encoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(item.headline || "")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${encoded}`,
    // Instagram has no web compose intent — admin downloads image + pastes caption.
    instagram: "https://www.instagram.com/"
  };
}
