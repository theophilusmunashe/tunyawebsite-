import { useEffect, useState } from "react";

export default function Header({ go }) {
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
              <img className="site-logo" src="/assets/logo-cream.png" alt="Tunyafrika" style={{width: "190px", margin: "-58px -44px"}} />
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
            <div className="x10" onClick={() => visit("falls")} style={{cursor: "pointer", fontSize: "12px", fontWeight: "400", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(250,243,232,0.85)", padding: "6px 0", borderBottom: "1px solid transparent"}}>Victoria Falls</div>
            <div className="x10" onClick={() => visit("xp")} style={{cursor: "pointer", fontSize: "12px", fontWeight: "400", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(250,243,232,0.85)", padding: "6px 0", borderBottom: "1px solid transparent"}}>Xperiences</div>
            <div className="x10" onClick={() => visit("stays")} style={{cursor: "pointer", fontSize: "12px", fontWeight: "400", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(250,243,232,0.85)", padding: "6px 0", borderBottom: "1px solid transparent"}}>Stays</div>
            <div style={{position: "relative"}}>
              <div className="x10" onClick={() => setMenu(v => !v)} style={{cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "400", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(250,243,232,0.85)", padding: "6px 0", borderBottom: "1px solid transparent"}}>
                <span>Beyond the Falls</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 9l7 7 7-7"></path></svg>
              </div>
              {menu && (
                <div style={{position: "absolute", top: "100%", right: "0", marginTop: "18px", minWidth: "268px", background: "#04301f", border: "1px solid rgba(179,149,92,0.5)", padding: "8px 0"}}>
                  <div className="x11" onClick={() => visit("beyond")} style={{cursor: "pointer", padding: "14px 24px", fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,243,232,0.88)"}}>Destinations</div>
                  <div className="x11" onClick={() => visit("about")} style={{cursor: "pointer", padding: "14px 24px", fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,243,232,0.88)"}}>About Tunyafrika</div>
                  <div className="x11" onClick={() => visit("social")} style={{cursor: "pointer", padding: "14px 24px", fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,243,232,0.88)"}}>Our Footprints on Socials</div>
                </div>
              )}
            </div>
            <a className="x10" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{fontSize: "12px", fontWeight: "400", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(250,243,232,0.85)", padding: "6px 0", borderBottom: "1px solid transparent", textDecoration: "none"}}>Meet Tunya</a>
            <a className="x12" href="https://www.tunya.africa" target="_blank" rel="noopener" style={{background: "#b3955c", color: "#04301f", padding: "13px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>Plan My Trip</a>
          </div>
        </div>
        {navOpen && (
          <div className="site-mobile-nav">
            <div className="x11" onClick={() => visit("falls")}>Victoria Falls</div>
            <div className="x11" onClick={() => visit("xp")}>Xperiences</div>
            <div className="x11" onClick={() => visit("stays")}>Stays</div>
            <div className="site-mobile-label">Beyond the Falls</div>
            <div className="x11 site-mobile-sub" onClick={() => visit("beyond")}>Destinations</div>
            <div className="x11 site-mobile-sub" onClick={() => visit("about")}>About Tunyafrika</div>
            <div className="x11 site-mobile-sub" onClick={() => visit("social")}>Our Footprints on Socials</div>
            <a className="x11" href="https://www.tunya.africa" target="_blank" rel="noopener">Meet Tunya</a>
            <a className="x12 site-mobile-cta" href="https://www.tunya.africa" target="_blank" rel="noopener">Plan My Trip</a>
          </div>
        )}
      </div>
  );
}
