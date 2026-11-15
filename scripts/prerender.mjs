/**
 * Build-time pre-render: turns the single-page app into one real HTML file per page,
 * with its own title, description, canonical URL, social tags and structured data.
 * Search engines and link previews get full content without running JavaScript;
 * the browser then hydrates the same markup.
 *
 * Runs after `vite build` (client) and `vite build --ssr src/entry-server.jsx` (server).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const { PAGE_PATHS, SITE_PAGE_KEYS } = await import(pathToFileURL(path.join(root, "src/routes.js")).href);

const SITE_URL = "https://www.tunyafrika.com";
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const HEAD_RE = /<!--seo-head-->[\s\S]*?<!--\/seo-head-->/;
if (!HEAD_RE.test(template) || !template.includes("<!--app-html-->")) {
  throw new Error("index.html is missing the <!--seo-head--> or <!--app-html--> markers.");
}

function page(html, head) {
  return template.replace(HEAD_RE, head).replace("<!--app-html-->", html);
}

function fileFor(urlPath) {
  return urlPath === "/" ? "index.html" : `${urlPath.replace(/^\//, "")}.html`;
}

// Untouched SPA shell for client-only routes (/admin, /accomodations/:id).
fs.writeFileSync(path.join(dist, "spa.html"), template.replace("<!--app-html-->", "").replace(/<!--\/?seo-head-->/g, ""));

const keys = [...SITE_PAGE_KEYS, "accomodations", "content"];
for (const key of keys) {
  const url = PAGE_PATHS[key];
  const { html, head } = render(url, key);
  if (!html || html.length < 500) throw new Error(`Pre-render of ${url} looks empty.`);
  fs.writeFileSync(path.join(dist, fileFor(url)), page(html, head));
  console.log(`  prerendered ${url.padEnd(20)} → ${fileFor(url)}`);
}

const notFound = render("/this-page-does-not-exist", "notFound");
fs.writeFileSync(path.join(dist, "404.html"), page(notFound.html, notFound.head));
console.log("  prerendered 404                 → 404.html");

const today = new Date().toISOString().slice(0, 10);
const priority = { home: "1.0", xp: "0.9", falls: "0.9", stays: "0.8", plan: "0.8", beyond: "0.8", visas: "0.8" };
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${keys
  .map((key) => `  <url>
    <loc>${SITE_URL}${PAGE_PATHS[key]}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority[key] || "0.6"}</priority>
  </url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`  sitemap.xml (${keys.length} URLs), robots.txt, spa.html written`);
