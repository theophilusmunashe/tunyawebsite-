import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const dataDir = path.join(root, "public/api/workspace-data");
const storeFile = path.join(dataDir, "store.json");
const EXPECTED_KEY = process.env.TUNYA_MAIL_KEY || process.env.VITE_WORKSPACE_KEY || "123456";

function emptyStore() {
  return {
    kind: "tunyafrika-workspace",
    version: 1,
    updatedAt: 0,
    kv: {},
    files: []
  };
}

function loadStore() {
  try {
    if (!fs.existsSync(storeFile)) return emptyStore();
    const data = JSON.parse(fs.readFileSync(storeFile, "utf8"));
    return {
      kind: "tunyafrika-workspace",
      version: 1,
      updatedAt: Number(data.updatedAt) || 0,
      kv: data.kv && typeof data.kv === "object" && !Array.isArray(data.kv) ? data.kv : {},
      files: Array.isArray(data.files) ? data.files : []
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  store.kind = "tunyafrika-workspace";
  store.version = 1;
  store.updatedAt = Date.now();
  const tmp = `${storeFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(store));
  fs.renameSync(tmp, storeFile);
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
  if (!url.pathname.endsWith("/api/workspace.php") && url.pathname !== "/api/workspace.php") {
    return false;
  }

  try {
    const method = req.method || "GET";
    let action = "";
    let body = {};
    if (method === "GET") {
      action = url.searchParams.get("action") || "pull";
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

    requireAdmin(req, body);
    const store = loadStore();

    if (action === "pull") {
      send(res, 200, { ok: true, pack: store });
      return true;
    }

    if (action === "push") {
      const pack = body.pack;
      if (!pack || pack.kind !== "tunyafrika-workspace") {
        send(res, 400, { ok: false, error: "This is not a Tunyafrika workspace pack." });
        return true;
      }
      const next = {
        kind: "tunyafrika-workspace",
        version: 1,
        kv: pack.kv && typeof pack.kv === "object" && !Array.isArray(pack.kv) ? pack.kv : {},
        files: Array.isArray(pack.files) ? pack.files : []
      };
      saveStore(next);
      send(res, 200, { ok: true, updatedAt: next.updatedAt, pack: next });
      return true;
    }

    send(res, 400, { ok: false, error: "Unknown action." });
    return true;
  } catch (err) {
    send(res, err.status || 500, { ok: false, error: err.message || "Workspace API failed." });
    return true;
  }
}

export function workspaceApiPlugin() {
  return {
    name: "tunya-workspace-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const handled = await handle(req, res);
        if (!handled) next();
      });
    }
  };
}
