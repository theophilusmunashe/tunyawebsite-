import { useEffect, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

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
      window.location.assign(next.href);
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
                <p>Open the menu for every Tunyafrika page.</p>
                <button type="button" className="site-nav-hint-ok" onClick={dismissHint}>Got it</button>
              </div>
            )}
          </div>
        </div>

        <div className="site-header-brand" onClick={() => visit("home")}>
          <span className="site-logo-frame">
            <img className="site-logo" src={imageSrc(site.logo, "/assets/logo-cream.png")} alt={site.logoAlt} />
          </span>
        </div>

        <div className="site-header-side site-header-side-end" aria-hidden="true" />
      </div>

      {navOpen && (
        <div className="site-mobile-nav">
          {nav.primary.map((item) => (
            <div key={item.label} className="x11" onClick={() => visit(itemTarget(item))}>{item.label}</div>
          ))}
          <div className="site-mobile-label">{nav.menuLabel}</div>
          {nav.menu.map((item) => (
            <div key={item.label} className="x11 site-mobile-sub" onClick={() => visit(itemTarget(item))}>{item.label}</div>
          ))}
          <a className="x11" href={nav.meetTunya.href} target="_blank" rel="noopener">{nav.meetTunya.label}</a>
          <a className="x12 site-mobile-cta" href={nav.cta.href} target="_blank" rel="noopener">{nav.cta.label}</a>
        </div>
      )}
    </div>
  );
}
