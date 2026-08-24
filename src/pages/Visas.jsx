import { useEffect, useRef, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const kickerStyle = {fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"};
const h2Style = {fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px 0 0"};
const bodyStyle = {fontWeight: "300", fontSize: "19px", lineHeight: "1.9"};
const shellStyle = {maxWidth: "1400px", margin: "0 auto", padding: "0 48px"};

export default function Visas({ go }) {
  const { visas } = useContent();
  const { hero, nav, essentials, kaza, countries, health, children, emigration, help } = visas;

  const [active, setActive] = useState(nav[0]?.id);
  const [country, setCountry] = useState(0);
  const [panel, setPanel] = useState(0);
  const [shot, setShot] = useState(0);
  const clickLock = useRef(0);

  // Highlights the in-page nav item for whichever section is currently in view.
  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!sections.length) return;

    const onScroll = () => {
      if (Date.now() < clickLock.current) return;
      const line = window.innerHeight * 0.32;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nav]);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    clickLock.current = Date.now() + 700;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selected = countries.items[country] || countries.items[0];

  const shots = emigration.walkthrough?.shots || [];
  const currentShot = shots[shot] || shots[0];
  const stepShot = (delta) => setShot((i) => (i + delta + shots.length) % shots.length);

  return (
    <div data-screen-label="Visas & Immigration">
      <div style={{position: "relative", background: "#04301f", color: "#faf3e8", overflow: "hidden"}}>
        <img src={imageSrc(hero.image)} alt={hero.imageAlt} style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", opacity: "0.32"}} />
        <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.82) 0%, rgba(4,48,31,0.9) 60%, #04301f 100%)"}}></div>
        <div style={{...shellStyle, position: "relative", padding: "100px 48px 90px", display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: "70px", alignItems: "end"}}>
          <div>
            <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
            <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "78px", lineHeight: "1.05", margin: "18px 0 0", maxWidth: "16ch"}}>{hero.title}</h1>
          </div>
          <div>
            <p style={{margin: "0", ...bodyStyle, color: "rgba(250,243,232,0.9)"}}>{hero.body}</p>
            <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(179,149,92,0.9)", marginTop: "20px"}}>{hero.reviewed}</div>
            <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "16px", marginTop: "26px"}}>
              <a className="x12" href={hero.primaryCta.href} target="_blank" rel="noopener" style={{background: "#b3955c", color: "#04301f", padding: "16px 28px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{hero.primaryCta.label}</a>
              <a className="x2" href={hero.secondaryCta.href} target="_blank" rel="noopener" style={{border: "1px solid rgba(250,243,232,0.5)", color: "#faf3e8", padding: "16px 28px", fontSize: "12px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{hero.secondaryCta.label}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="visa-subnav">
        <div className="visa-subnav-inner">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`visa-subnav-link${active === item.id ? " is-active" : ""}`}
              onClick={() => jump(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div id="essentials" className="visa-section" style={{...shellStyle, padding: "96px 48px 0"}}>
        <div style={{maxWidth: "62ch"}}>
          <div style={kickerStyle}>{essentials.kicker}</div>
          <h2 style={h2Style}>{essentials.title}</h2>
          <p style={{margin: "20px 0 0", ...bodyStyle}}>{essentials.body}</p>
        </div>
        <div className="visa-grid-2" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", marginTop: "52px", background: "rgba(4,48,31,0.14)"}}>
          {essentials.items.map((item) => (
            <div key={item.number} style={{background: "#faf3e8", padding: "34px 36px"}}>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", color: "#b3955c"}}>{item.number}</div>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "27px", lineHeight: "1.2", marginTop: "8px"}}>{item.title}</div>
              <p style={{margin: "12px 0 0", fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.82)"}}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="kaza" className="visa-section" style={{marginTop: "110px", background: "#04301f", color: "#faf3e8"}}>
        <div style={{...shellStyle, padding: "96px 48px"}}>
          <div style={{maxWidth: "62ch"}}>
            <div style={kickerStyle}>{kaza.kicker}</div>
            <h2 style={h2Style}>{kaza.title}</h2>
            <p style={{margin: "20px 0 0", ...bodyStyle, color: "rgba(250,243,232,0.9)"}}>{kaza.body}</p>
          </div>

          <div className="visa-facts" style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginTop: "50px"}}>
            {kaza.facts.map((fact) => (
              <div key={fact.label} style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b3955c"}}>{fact.label}</div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: "1.2", marginTop: "10px"}}>{fact.value}</div>
              </div>
            ))}
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginTop: "60px"}}>
            <div>
              <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b3955c"}}>{kaza.includesTitle}</div>
              <div style={{display: "grid", gap: "16px", marginTop: "20px"}}>
                {kaza.includes.map((line, i) => (
                  <div key={i} style={{display: "flex", gap: "14px", alignItems: "flex-start"}}>
                    <span style={{color: "#b3955c", flexShrink: "0", marginTop: "3px"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 12.5l5 5L20 6.5"></path></svg>
                    </span>
                    <span style={{fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(250,243,232,0.88)"}}>{line}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b3955c"}}>{kaza.watchTitle}</div>
              <div style={{display: "grid", gap: "16px", marginTop: "20px"}}>
                {kaza.watch.map((line, i) => (
                  <div key={i} style={{display: "flex", gap: "14px", alignItems: "flex-start"}}>
                    <span style={{color: "#b3955c", flexShrink: "0", marginTop: "3px"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 8v5"></path><circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none"></circle><path d="M12 3.6L2.6 20h18.8L12 3.6z"></path></svg>
                    </span>
                    <span style={{fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(250,243,232,0.88)"}}>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginTop: "50px", borderLeft: "1px solid #b3955c", padding: "6px 0 6px 24px", fontWeight: "300", fontSize: "17px", lineHeight: "1.85", color: "rgba(250,243,232,0.85)", maxWidth: "78ch"}}>{kaza.note}</div>

          <div className="stack-m" style={{display: "flex", flexWrap: "wrap", gap: "26px", marginTop: "36px"}}>
            {kaza.links.map((link) => (
              <a key={link.href} className="x3" href={link.href} target="_blank" rel="noopener" style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.22em", textTransform: "uppercase", color: "#faf3e8", borderBottom: "1px solid #b3955c", paddingBottom: "6px", textDecoration: "none"}}>{link.label} →</a>
            ))}
          </div>
        </div>
      </div>

      <div id="countries" className="visa-section" style={{...shellStyle, padding: "96px 48px 0"}}>
        <div style={{maxWidth: "62ch"}}>
          <div style={kickerStyle}>{countries.kicker}</div>
          <h2 style={h2Style}>{countries.title}</h2>
          <p style={{margin: "20px 0 0", ...bodyStyle}}>{countries.body}</p>
        </div>

        <div className="visa-tabs">
          {countries.items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              className={`visa-tab${country === i ? " is-active" : ""}`}
              onClick={() => setCountry(i)}
              aria-pressed={country === i}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div style={{border: "1px solid rgba(4,48,31,0.18)", borderTop: "2px solid #b3955c", padding: "44px 44px 46px", marginTop: "-1px"}}>
          <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", lineHeight: "1.1"}}>{selected.name}</div>
          <div style={{fontWeight: "300", fontSize: "18px", lineHeight: "1.8", color: "rgba(13,43,30,0.8)", marginTop: "8px", maxWidth: "62ch"}}>{selected.tagline}</div>

          <div className="visa-grid-2" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px 50px", marginTop: "36px"}}>
            {selected.facts.map((fact) => (
              <div key={fact.label} style={{borderTop: "1px solid rgba(179,149,92,0.7)", paddingTop: "14px"}}>
                <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b3955c"}}>{fact.label}</div>
                <div style={{fontWeight: "300", fontSize: "17px", lineHeight: "1.8", marginTop: "8px"}}>{fact.value}</div>
              </div>
            ))}
          </div>

          <div style={{display: "grid", gap: "14px", marginTop: "38px"}}>
            {selected.notes.map((note, i) => (
              <div key={i} style={{display: "flex", gap: "14px", alignItems: "flex-start"}}>
                <span style={{color: "#b3955c", flexShrink: "0", marginTop: "3px"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 12.5l5 5L20 6.5"></path></svg>
                </span>
                <span style={{fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.82)"}}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="health" className="visa-section" style={{...shellStyle, padding: "96px 48px 0"}}>
        <div style={{maxWidth: "62ch"}}>
          <div style={kickerStyle}>{health.kicker}</div>
          <h2 style={h2Style}>{health.title}</h2>
        </div>
        <div className="visa-grid-2" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px 50px", marginTop: "46px"}}>
          {health.items.map((item) => (
            <div key={item.title} style={{borderTop: "1px solid #b3955c", paddingTop: "18px"}}>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", lineHeight: "1.2"}}>{item.title}</div>
              <p style={{margin: "12px 0 0", fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.82)"}}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="children" className="visa-section" style={{...shellStyle, padding: "96px 48px 0"}}>
        <div style={{maxWidth: "62ch"}}>
          <div style={kickerStyle}>{children.kicker}</div>
          <h2 style={h2Style}>{children.title}</h2>
          <p style={{margin: "20px 0 0", ...bodyStyle}}>{children.body}</p>
        </div>
        <div className="visa-grid-2" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px 50px", marginTop: "46px"}}>
          {children.items.map((item) => (
            <div key={item.title} style={{borderTop: "1px solid #b3955c", paddingTop: "18px"}}>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", lineHeight: "1.2"}}>{item.title}</div>
              <p style={{margin: "12px 0 0", fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.82)"}}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="emigration" className="visa-section" style={{marginTop: "110px", background: "#04301f", color: "#faf3e8"}}>
        <div style={{...shellStyle, padding: "96px 48px"}}>
          <div style={{maxWidth: "62ch"}}>
            <div style={kickerStyle}>{emigration.kicker}</div>
            <h2 style={h2Style}>{emigration.title}</h2>
            <p style={{margin: "20px 0 0", ...bodyStyle, color: "rgba(250,243,232,0.9)"}}>{emigration.body}</p>
          </div>

          <div style={{marginTop: "44px", borderTop: "1px solid rgba(179,149,92,0.45)"}}>
            {emigration.panels.map((p, i) => {
              const open = panel === i;
              return (
                <div key={p.title} style={{borderBottom: "1px solid rgba(179,149,92,0.45)"}}>
                  <button
                    type="button"
                    className="visa-accordion-head"
                    onClick={() => setPanel(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    <span>{p.title}</span>
                    <span style={{color: "#b3955c", flexShrink: "0", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s ease"}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                    </span>
                  </button>
                  {open && (
                    <div style={{padding: "0 0 30px", maxWidth: "92ch"}}>
                      {p.items && (
                        <div style={{display: "grid", gap: "14px"}}>
                          {p.items.map((line, k) => (
                            <div key={k} style={{display: "flex", gap: "14px", alignItems: "flex-start"}}>
                              <span style={{color: "#b3955c", flexShrink: "0", marginTop: "3px"}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 12.5l5 5L20 6.5"></path></svg>
                              </span>
                              <span style={{fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(250,243,232,0.88)"}}>{line}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {p.steps && (
                        <div style={{display: "grid", gap: "18px"}}>
                          {p.steps.map((step, k) => (
                            <div key={k} style={{display: "flex", gap: "18px", alignItems: "flex-start"}}>
                              <span style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#b3955c", flexShrink: "0", width: "28px", lineHeight: "1.4"}}>{String(k + 1).padStart(2, "0")}</span>
                              <span style={{fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(250,243,232,0.88)"}}>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {currentShot && (
            <div style={{marginTop: "58px"}}>
              <div style={kickerStyle}>{emigration.walkthrough.kicker}</div>
              <h3 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "38px", lineHeight: "1.15", margin: "14px 0 0", maxWidth: "26ch"}}>{emigration.walkthrough.title}</h3>

              <div className="etip-steps" style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "28px"}}>
                {shots.map((s, i) => (
                  <button
                    key={s.image}
                    type="button"
                    className="etip-step"
                    onClick={() => setShot(i)}
                    aria-current={i === shot}
                    style={{
                      background: i === shot ? "#b3955c" : "transparent",
                      color: i === shot ? "#04301f" : "rgba(250,243,232,0.75)",
                      border: `1px solid ${i === shot ? "#b3955c" : "rgba(179,149,92,0.5)"}`
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>

              <div className="etip-frame" style={{marginTop: "24px", border: "1px solid rgba(179,149,92,0.45)", background: "rgba(250,243,232,0.06)", padding: "14px"}}>
                <img
                  src={imageSrc(currentShot.image)}
                  alt={currentShot.imageAlt}
                  loading="lazy"
                  style={{display: "block", width: "100%", height: "auto", background: "#faf3e8"}}
                />
              </div>

              <div className="etip-caption" style={{display: "flex", gap: "24px", alignItems: "flex-start", marginTop: "20px"}}>
                <div style={{display: "flex", gap: "10px", flexShrink: "0"}}>
                  <button type="button" className="etip-arrow" onClick={() => stepShot(-1)} aria-label="Previous screen">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 5l-7 7 7 7"></path></svg>
                  </button>
                  <button type="button" className="etip-arrow" onClick={() => stepShot(1)} aria-label="Next screen">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                <div style={{fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(250,243,232,0.88)", maxWidth: "76ch"}}>{currentShot.caption}</div>
              </div>

              <div style={{fontSize: "13px", fontWeight: "300", color: "rgba(250,243,232,0.55)", marginTop: "18px", maxWidth: "70ch", lineHeight: "1.7"}}>{emigration.walkthrough.note}</div>
            </div>
          )}

          <div className="visa-grid-2" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 50px", marginTop: "44px"}}>
            {emigration.tips.map((tip, i) => (
              <div key={i} style={{fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(250,243,232,0.82)", borderLeft: "1px solid rgba(179,149,92,0.6)", paddingLeft: "20px"}}>{tip}</div>
            ))}
          </div>

          <div style={{marginTop: "48px"}}>
            <a className="x12" href={emigration.cta.href} target="_blank" rel="noopener" style={{display: "inline-flex", alignItems: "center", gap: "12px", background: "#b3955c", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{emigration.cta.label}</a>
            <div style={{fontSize: "13px", fontWeight: "300", color: "rgba(250,243,232,0.6)", marginTop: "14px"}}>{emigration.ctaNote}</div>
          </div>

          {emigration.downloads?.items?.length > 0 && (
            <div style={{marginTop: "44px", paddingTop: "34px", borderTop: "1px solid rgba(179,149,92,0.45)"}}>
              <div style={kickerStyle}>{emigration.downloads.title}</div>
              <div className="etip-downloads" style={{display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "20px"}}>
                {emigration.downloads.items.map((doc) => (
                  <a
                    key={doc.href}
                    className="etip-download"
                    href={doc.href}
                    target="_blank"
                    rel="noopener"
                    download
                  >
                    <span style={{color: "#b3955c", flexShrink: "0"}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3v12"></path><path d="M7 11l5 5 5-5"></path><path d="M4 20h16"></path></svg>
                    </span>
                    <span>
                      <span style={{display: "block", fontSize: "15px", fontWeight: "400", color: "#faf3e8"}}>{doc.label}</span>
                      <span style={{display: "block", fontSize: "12px", fontWeight: "300", color: "rgba(250,243,232,0.6)", marginTop: "5px", letterSpacing: "0.04em"}}>{doc.note}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div id="help" className="visa-section" style={{...shellStyle, padding: "96px 48px 110px", textAlign: "center"}}>
        <div style={{...kickerStyle, textAlign: "center"}}>{help.kicker}</div>
        <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "52px", lineHeight: "1.1", margin: "18px auto 0", maxWidth: "24ch"}}>{help.title}</h2>
        <p style={{margin: "22px auto 0", maxWidth: "62ch", ...bodyStyle}}>{help.body}</p>
        <div className="stack-m" style={{display: "flex", justifyContent: "center", gap: "16px", marginTop: "36px"}}>
          <a className="x6" href={help.primaryCta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{help.primaryCta.label}</a>
          <div className="x4" onClick={() => go(help.secondaryCta.page)} style={{cursor: "pointer", border: "1px solid #04301f", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase"}}>{help.secondaryCta.label}</div>
        </div>
        <p style={{margin: "48px auto 0", maxWidth: "76ch", fontWeight: "300", fontSize: "14px", lineHeight: "1.85", color: "rgba(13,43,30,0.6)"}}>{help.disclaimer}</p>
      </div>
    </div>
  );
}
