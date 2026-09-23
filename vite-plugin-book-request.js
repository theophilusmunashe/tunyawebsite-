import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = path.join(__dirname, "public/api/book-requests.json");

function readLog() {
  try {
    const data = JSON.parse(fs.readFileSync(logFile, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export function bookRequestApiPlugin() {
  return {
    name: "book-request-api",
    configureServer(server) {
      server.middlewares.use("/api/book-request.php", (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== "POST") return next();

        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", () => {
          let data = {};
          try {
            data = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
          } catch {
            return json(res, 400, { ok: false, error: "Invalid request." });
          }
          if (String(data.website || "").trim() !== "") {
            return json(res, 200, { ok: true });
          }
          const email = String(data.email || "").trim();
          const packageName = String(data.packageName || "").trim();
          const name = String(data.name || "").trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return json(res, 400, { ok: false, error: "Enter a valid email." });
          }
          if (!packageName) {
            return json(res, 400, { ok: false, error: "Choose a package." });
          }
          const log = readLog();
          log.unshift({ email, name, packageName, at: Date.now(), local: true });
          fs.mkdirSync(path.dirname(logFile), { recursive: true });
          fs.writeFileSync(logFile, JSON.stringify(log.slice(0, 50), null, 2));
          return json(res, 200, { ok: true, local: true });
        });
      });
    }
  };
}
