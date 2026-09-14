const ENDPOINT = "/api/content.php";

function workspaceKey() {
  return import.meta.env.VITE_MAIL_KEY || import.meta.env.VITE_WORKSPACE_KEY || "123456";
}

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function adminPost(action, payload = {}) {
  const key = workspaceKey();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Tunya-Key": key
    },
    body: JSON.stringify({ action, key, ...payload })
  });
  return parse(res);
}

export async function publicUpdates() {
  const res = await fetch(`${ENDPOINT}?action=public_list`, { headers: { Accept: "application/json" } });
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
