/**
 * One real URL per page, so every page can be indexed, shared and linked to.
 * Keys are the page keys used across the content files (go("falls") etc.).
 */
export const PAGE_PATHS = {
  home: "/",
  falls: "/victoria-falls",
  xp: "/things-to-do",
  stays: "/where-to-stay",
  beyond: "/beyond-the-falls",
  visas: "/visas",
  about: "/about",
  social: "/socials",
  ai: "/ask-tunya",
  plan: "/plan-my-trip",
  accomodations: "/accomodations",
  content: "/content"
};

const PATH_TO_PAGE = Object.fromEntries(Object.entries(PAGE_PATHS).map(([k, v]) => [v, k]));

/** Pages rendered by the main site shell (App.jsx) and pre-rendered at build time. */
export const SITE_PAGE_KEYS = ["home", "falls", "xp", "stays", "beyond", "visas", "about", "social", "ai", "plan"];

export function pathFor(key) {
  if (!key) return "/";
  if (typeof key === "string" && key.startsWith("/")) return key;
  return PAGE_PATHS[key] || "/";
}

/** Maps a pathname to a site page key, or "notFound". */
export function pageForPath(pathname = "/") {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return PATH_TO_PAGE[clean] || "notFound";
}

/** Shared go(): navigates to the page's URL and scrolls to the top. */
export function makeGo(navigate) {
  return (key) => {
    navigate(pathFor(key));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  };
}

/** Click handler for <a href> links that keeps SPA navigation (and lets ctrl/cmd-click open a tab). */
export function linkClick(go, key, before) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (before) before();
    go(key);
  };
}
