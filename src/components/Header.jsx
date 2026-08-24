import { useEffect, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const linkStyle = {cursor: "pointer", fontSize: "12px", fontWeight: "400", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(250,243,232,0.85)", padding: "6px 0", borderBottom: "1px solid transparent"};
const menuItemStyle = {cursor: "pointer", padding: "14px 24px", fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,243,232,0.88)"};

export default function Header({ go }) {
  const { site } = useContent();
  const nav = site.nav;
  const [menu, setMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const visit = (next) => {
    setMenu(false);
    setNavOpen(false);
    go(next);
  };

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        setNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  return (
    <div className="site-header" style={{position: "sticky", top: "0", zIndex: "50", background: "rgba(4,48,31,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(179,149,92,0.35)"}}>
        <div className="site-header-inner" style={{maxWidth: "1400px", margin: "0 auto", padding: "0 48px", height: "88px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px"}}>
          <div onClick={() => visit("home")} style={{cursor: "pointer", display: "flex", alignItems: "center"}}>
            <span className="site-logo-frame">
              <img className="site-logo" src={imageSrc(site.logo, "/assets/logo-cream.png")} alt={site.logoAlt} style={{width: "190px", margin: "-58px -44px"}} />
            </span>
          </div>
          <button
            type="button"
            className={`site-burger${navOpen ? " is-open" : ""}`}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            onClick={() => { setMenu(false); setNavOpen(v => !v); }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="site-nav" style={{display: "flex", alignItems: "center", gap: "34px"}}>
            {nav.primary.map((item) => (
              <div key={item.label} className="x10" onClick={() => visit(item.page)} style={linkStyle}>{item.label}</div>
            ))}
            <div style={{position: "relative"}}>
              <div className="x10" onClick={() => setMenu(v => !v)} style={{...linkStyle, display: "flex", alignItems: "center", gap: "8px"}}>
                <span>{nav.menuLabel}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 9l7 7 7-7"></path></svg>
              </div>
              {menu && (
                <div style={{position: "absolute", top: "100%", right: "0", marginTop: "18px", minWidth: "268px", background: "#04301f", border: "1px solid rgba(179,149,92,0.5)", padding: "8px 0"}}>
                  {nav.menu.map((item) => (
                    <div key={item.label} className="x11" onClick={() => visit(item.page)} style={menuItemStyle}>{item.label}</div>
                  ))}
                </div>
              )}
            </div>
            <a className="x10" href={nav.meetTunya.href} target="_blank" rel="noopener" style={{...linkStyle, cursor: undefined, textDecoration: "none"}}>{nav.meetTunya.label}</a>
            <a className="x12" href={nav.cta.href} target="_blank" rel="noopener" style={{background: "#b3955c", color: "#04301f", padding: "13px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{nav.cta.label}</a>
          </div>
        </div>
        {navOpen && (
          <div className="site-mobile-nav">
            {nav.primary.map((item) => (
              <div key={item.label} className="x11" onClick={() => visit(item.page)}>{item.label}</div>
            ))}
            <div className="site-mobile-label">{nav.menuLabel}</div>
            {nav.menu.map((item) => (
              <div key={item.label} className="x11 site-mobile-sub" onClick={() => visit(item.page)}>{item.label}</div>
            ))}
            <a className="x11" href={nav.meetTunya.href} target="_blank" rel="noopener">{nav.meetTunya.label}</a>
            <a className="x12 site-mobile-cta" href={nav.cta.href} target="_blank" rel="noopener">{nav.cta.label}</a>
          </div>
        )}
      </div>
  );
}
