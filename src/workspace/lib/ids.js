export function uid(prefix = "id") {
  const core = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${core}`;
}

export function padNum(n, width = 4) {
  return String(n).padStart(width, "0");
}

export function nextRef(prefix, year, counter) {
  return `${prefix}-${year}-${padNum(counter)}`;
}

export function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}
