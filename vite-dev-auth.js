/**
 * Local-dev stand-in for public/api/auth.php so /admin works under `npm run dev`.
 * Never used in production builds (Vite plugins only run in the dev server).
 *
 * The dev password comes from TUNYA_DEV_PASSWORD. If it isn't set, a random one
 * is generated and printed in the terminal when the dev server starts.
 */
import crypto from "node:crypto";

const COOKIE = "tunya_admin";
const sessions = new Map(); // sid -> { user, csrf, seen }
const IDLE_MS = 8 * 3600 * 1000;

let devPassword = process.env.TUNYA_DEV_PASSWORD || "";
function password() {
  if (!devPassword) {
    devPassword = crypto.randomBytes(9).toString("base64url");
    console.log(`\n  [tunya] Dev admin password: ${devPassword}  (set TUNYA_DEV_PASSWORD to choose your own)\n`);
  }
  return devPassword;
}

function readCookie(req) {
  const raw = req.headers.cookie || "";
  const hit = raw.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  return hit ? decodeURIComponent(hit.slice(COOKIE.length + 1)) : "";
}

function send(res, code, payload) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function currentSession(req) {
  const sid = readCookie(req);
  const s = sid && sessions.get(sid);
  if (!s) return null;
  if (Date.now() - s.seen > IDLE_MS) {
    sessions.delete(sid);
    return null;
  }
  s.seen = Date.now();
  return { sid, ...s };
}

/** Same contract as tunya_require_admin() in PHP: throws {status} on failure. */
export function requireDevAdmin(req) {
  const s = currentSession(req);
  if (!s) {
    const err = new Error("Please sign in again.");
    err.status = 401;
    throw err;
  }
  if (req.method === "POST" && req.headers["x-csrf-token"] !== s.csrf) {
    const err = new Error("Your session expired. Refresh the page and sign in again.");
    err.status = 403;
    throw err;
  }
  return s.user;
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
}

const CREW_NAMES = { crew_tm: "Theophilus Munashe Maposa", crew_rv: "Rudolph Benjamin Volkwyn", crew_dm: "Dzikamai Ronald Muchemedzi" };

export function devAuthPlugin() {
  return {
    name: "tunya-dev-auth",
    configureServer(server) {
      server.httpServer?.once("listening", () => password());
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || "").split("?")[0];
        if (path !== "/api/auth.php") return next();
        if (req.method === "GET") {
          const s = currentSession(req);
          if (!s) return send(res, 401, { ok: false, signin: true });
          return send(res, 200, { ok: true, user: s.user, csrf: s.csrf });
        }
        if (req.method !== "POST") return send(res, 405, { ok: false, error: "Use GET or POST." });
        const body = await readBody(req);
        if (body.action === "logout") {
          const s = currentSession(req);
          if (s) sessions.delete(s.sid);
          res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`);
          return send(res, 200, { ok: true });
        }
        if (body.action !== "login") return send(res, 400, { ok: false, error: "Unknown action." });
        const id = String(body.user || "");
        const given = Buffer.from(String(body.password || ""));
        const want = Buffer.from(password());
        const ok = given.length === want.length && crypto.timingSafeEqual(given, want);
        if (!ok || !CREW_NAMES[id]) return send(res, 401, { ok: false, error: "Wrong password." });
        const sid = crypto.randomBytes(32).toString("hex");
        const user = { id, name: CREW_NAMES[id] };
        const csrf = crypto.randomBytes(32).toString("hex");
        sessions.set(sid, { user, csrf, seen: Date.now() });
        res.setHeader("Set-Cookie", `${COOKIE}=${sid}; Path=/; HttpOnly; SameSite=Strict`);
        return send(res, 200, { ok: true, user, csrf });
      });
    }
  };
}
