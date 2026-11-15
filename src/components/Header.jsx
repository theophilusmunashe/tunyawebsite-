import { useEffect, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";
import { linkClick, pathFor } from "../routes.js";

const HINT_KEY = "tunya-saw-menu-hint";

function hintAlreadySeen() {
  try {
    return window.localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

function itemTarget(item) {
  return item.href ? { href: item.href } : item.page;
}

export default function Header({ go, page }) {
  const { site } = useContent();
  const nav = site.nav;
  const [navOpen, setNavOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const dismissHint = () => {
    setShowHint(false);
    try {
      window.localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const visit = (next) => {
    setNavOpen(false);
    dismissHint();
    if (typeof next === "object" && next?.href) {
      if (next.href.startsWith("http")) {
        window.open(next.href, "_blank", "noopener");
        return;
      }
      go(next.href);
      return;
    }
    go(next);
  };

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  useEffect(() => {
    if (page !== "home" || hintAlreadySeen()) {
      setShowHint(false);
      return;
    }
    const t = window.setTimeout(() => setShowHint(true), 600);
    return () => window.clearTimeout(t);
  }, [page]);

  return (
    <div className="site-header">
      <div className="site-header-inner">
        <div className="site-header-side">
          <div className="site-burger-wrap">
            <button
              type="button"
              className={`site-burger${navOpen ? " is-open" : ""}${showHint && !navOpen ? " is-hint" : ""}`}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-expanded={navOpen}
              onClick={() => {
                setNavOpen((v) => {
                  const next = !v;
                  if (next) dismissHint();
                  return next;
                });
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            {showHint && !navOpen && (
              <div className="site-nav-hint" role="status">
                <p>Visas, destinations and our team are in the menu.</p>
                <button type="button" className="site-nav-hint-ok" onClick={dismissHint}>Got it</button>
              </div>
            )}
          </div>
        </div>

        <a className="site-header-brand" href="/" aria-label="Tunyafrika Xperiences home" onClick={linkClick(visit, "home")} style={{ color: "inherit", textDecoration: "none" }}>
          <span className="site-logo-frame">
            <img className="site-logo" src={imageSrc(site.logo, "/assets/logo-cream.png")} alt={site.logoAlt} />
          </span>
        </a>

        <div className="site-header-side site-header-side-end">
          <a className="x12 site-header-cta" href={nav.cta.href} target="_blank" rel="noopener">{nav.cta.label}</a>
        </div>
      </div>

      {navOpen && (
        <div className="site-mobile-nav">
          {nav.primary.map((item) => (
            <a key={item.label} className="x11" href={item.href || pathFor(item.page)} onClick={linkClick(visit, itemTarget(item))}>{item.label}</a>
          ))}
          <div className="site-mobile-label">{nav.menuLabel}</div>
          {nav.menu.map((item) => (
            <a key={item.label} className="x11 site-mobile-sub" href={item.href || pathFor(item.page)} onClick={linkClick(visit, itemTarget(item))}>{item.label}</a>
          ))}
          <a className="x11" href={nav.meetTunya.href} target="_blank" rel="noopener">{nav.meetTunya.label}</a>
          <a className="x12 site-mobile-cta" href={nav.cta.href} target="_blank" rel="noopener">{nav.cta.label}</a>
        </div>
      )}
    </div>
  );
}
