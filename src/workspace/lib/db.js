const DB_NAME = "tunyafrika-workspace";
const DB_VER = 1;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      dbPromise = null;
      reject(new Error("IndexedDB timed out."));
    }, 8000);

    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
      if (!db.objectStoreNames.contains("files")) db.createObjectStore("files", { keyPath: "id" });
    };
    req.onsuccess = () => {
      if (settled) {
        req.result.close();
        return;
      }
      settled = true;
      clearTimeout(timer);
      const db = req.result;
      db.onclose = () => { dbPromise = null; };
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    req.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      dbPromise = null;
      reject(req.error || new Error("IndexedDB failed to open."));
    };
    req.onblocked = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      dbPromise = null;
      reject(new Error("IndexedDB is blocked by another tab."));
    };
  });
  return dbPromise;
}

function tx(store, mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const req = fn(s);
    let value;
    if (req && typeof req === "object" && "onsuccess" in req) {
      req.onsuccess = () => { value = req.result; };
      req.onerror = () => reject(req.error);
    }
    t.oncomplete = () => resolve(value);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error("IndexedDB transaction aborted."));
  }));
}

export function kvGet(key) {
  return tx("kv", "readonly", (s) => s.get(key));
}

export function kvSet(key, value) {
  return tx("kv", "readwrite", (s) => s.put(value, key));
}

export function filePut(record) {
  return tx("files", "readwrite", (s) => s.put(record));
}

export function fileGet(id) {
  return tx("files", "readonly", (s) => s.get(id));
}

export function fileDelete(id) {
  return tx("files", "readwrite", (s) => s.delete(id));
}

export function fileListMeta() {
  return tx("files", "readonly", (s) => s.getAll()).then((rows = []) =>
    rows
      .map(({ blob, ...meta }) => meta)
      .sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0))
  );
}

export async function exportBackup() {
  const keys = ["seeded", "settings", "crew", "tasks", "quotes", "invoices", "journeys", "movements", "visaCases", "briefs", "notices"];
  const kv = {};
  for (const key of keys) kv[key] = await kvGet(key);
  const files = await tx("files", "readonly", (s) => s.getAll());
  const packedFiles = await Promise.all((files || []).map(async (f) => {
    const buf = await f.blob.arrayBuffer();
    return {
      ...f,
      blob: undefined,
      dataUrl: await blobToDataUrl(new Blob([buf], { type: f.mime }))
    };
  }));
  return {
    kind: "tunyafrika-workspace",
    version: 1,
    exportedAt: Date.now(),
    kv,
    files: packedFiles
  };
}

export async function importBackup(pack) {
  if (!pack || pack.kind !== "tunyafrika-workspace") throw new Error("This is not a Tunyafrika workspace pack.");
  for (const [key, value] of Object.entries(pack.kv || {})) {
    await kvSet(key, value);
  }
  const existing = await tx("files", "readonly", (s) => s.getAll());
  for (const f of existing || []) await fileDelete(f.id);
  for (const f of pack.files || []) {
    const blob = dataUrlToBlob(f.dataUrl, f.mime);
    await filePut({ ...f, dataUrl: undefined, blob });
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl, mime) {
  const [head, body] = String(dataUrl).split(",");
  const binary = atob(body || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime || (head.match(/:(.*?);/) || [])[1] || "application/octet-stream" });
}
