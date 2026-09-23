const RELATIVE_ENDPOINT = "/api/workspace.php";
const LIVE_ENDPOINT = "https://www.tunyafrika.com/api/workspace.php";
export const CLOUD_FILE_MAX = 6 * 1024 * 1024;

const LIST_KEYS = [
  "crew",
  "tasks",
  "quotes",
  "invoices",
  "cashbook",
  "loans",
  "journeys",
  "movements",
  "visaCases",
  "briefs",
  "notices"
];

function canRunPhpApi(hostname = "") {
  const host = String(hostname || "").toLowerCase();
  if (!host || host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return true;
  if (host === "www.tunyafrika.com" || host === "tunyafrika.com") return true;
  return false;
}

function isStaticPreviewHost(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
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

export function workspaceCloudEndpoint() {
  const override = import.meta.env.VITE_WORKSPACE_API_URL;
  if (override) return String(override).replace(/\/$/, "");
  if (typeof window === "undefined") return RELATIVE_ENDPOINT;
  const host = window.location.hostname;
  if (canRunPhpApi(host)) return RELATIVE_ENDPOINT;
  if (isStaticPreviewHost(host)) return LIVE_ENDPOINT;
  return LIVE_ENDPOINT;
}

function httpErrorMessage(status, data = {}) {
  if (data.error) return data.error;
  if (status === 405 || status === 404) {
    return "Could not reach the shared workspace. Open https://www.tunyafrika.com/admin.";
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

function cloudKey() {
  return import.meta.env.VITE_MAIL_KEY || import.meta.env.VITE_WORKSPACE_KEY || "123456";
}

async function post(action, payload = {}) {
  const key = cloudKey();
  const body = JSON.stringify({ action, key, ...payload });
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Tunya-Key": key
  };
  let endpoint = workspaceCloudEndpoint();
  let res = await fetch(endpoint, { method: "POST", headers, body });
  if ((res.status === 405 || res.status === 404) && endpoint !== LIVE_ENDPOINT) {
    endpoint = LIVE_ENDPOINT;
    res = await fetch(endpoint, { method: "POST", headers, body });
  }
  return parse(res);
}

export async function pullWorkspace() {
  return post("pull");
}

export async function pushWorkspace(pack) {
  return post("push", { pack });
}

export function packHasRecords(pack) {
  if (!pack) return false;
  if ((pack.updatedAt || 0) > 0) return true;
  const kv = pack.kv || {};
  if (LIST_KEYS.some((key) => Array.isArray(kv[key]) && kv[key].length)) return true;
  return Array.isArray(pack.files) && pack.files.length > 0;
}

function mergeTombs(a = {}, b = {}) {
  const out = {};
  for (const src of [a, b]) {
    for (const [key, rows] of Object.entries(src || {})) {
      out[key] = out[key] || {};
      for (const [id, ts] of Object.entries(rows || {})) {
        out[key][id] = Math.max(out[key][id] || 0, Number(ts) || 0);
      }
    }
  }
  return out;
}

function mergeList(a = [], b = [], tombs = {}) {
  const map = new Map();
  for (const row of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!row || typeof row !== "object" || !row.id) continue;
    const stamp = row.updatedAt || row.uploadedAt || 0;
    if ((tombs[row.id] || 0) >= stamp) continue;
    const prev = map.get(row.id);
    if (!prev || stamp >= (prev.updatedAt || prev.uploadedAt || 0)) {
      map.set(row.id, row);
    }
  }
  return [...map.values()].sort((x, y) => (y.updatedAt || y.uploadedAt || 0) - (x.updatedAt || x.uploadedAt || 0));
}

function mergeSettings(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  const newer = (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b;
  const older = newer === a ? b : a;
  return {
    ...older,
    ...newer,
    quoteCounter: Math.max(Number(a.quoteCounter) || 0, Number(b.quoteCounter) || 0),
    invoiceCounter: Math.max(Number(a.invoiceCounter) || 0, Number(b.invoiceCounter) || 0),
    updatedAt: Math.max(a.updatedAt || 0, b.updatedAt || 0)
  };
}

function mergeFiles(a = [], b = [], tombs = {}) {
  const map = new Map();
  for (const row of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!row?.id) continue;
    if ((tombs[row.id] || 0) >= (row.uploadedAt || 0)) continue;
    const prev = map.get(row.id);
    if (!prev || (row.uploadedAt || 0) >= (prev.uploadedAt || 0)) {
      map.set(row.id, row);
    }
  }
  return [...map.values()]
    .filter((row) => row.dataUrl)
    .sort((x, y) => (y.uploadedAt || 0) - (x.uploadedAt || 0));
}

export function mergeWorkspacePacks(local, remote) {
  const localKv = local?.kv || {};
  const remoteKv = remote?.kv || {};
  const tombs = mergeTombs(localKv._tombstones, remoteKv._tombstones);
  const kv = {
    seeded: Boolean(localKv.seeded || remoteKv.seeded),
    settings: mergeSettings(localKv.settings, remoteKv.settings),
    _tombstones: tombs
  };
  for (const key of LIST_KEYS) kv[key] = mergeList(localKv[key], remoteKv[key], tombs[key]);
  return {
    kind: "tunyafrika-workspace",
    version: 1,
    updatedAt: Date.now(),
    kv,
    files: mergeFiles(local?.files, remote?.files, tombs.files)
  };
}

export function slimPackForCloud(pack) {
  const files = (pack.files || []).filter((f) => (f.size || 0) <= CLOUD_FILE_MAX && f.dataUrl);
  return { ...pack, files };
}
