import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const kickerStyle = {fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"};
const headingStyle = {fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px 0 0"};
const coverStyle = {position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"};

export default function Home({ go }) {
  const { home } = useContent();
  const { hero, way, days, tunya, beyondTeaser } = home;

  return (
    <div data-screen-label="Home">
          <div style={{position: "relative", height: "92vh", minHeight: "700px", background: "#04301f", overflow: "hidden"}}>
            <img src={imageSrc(hero.image)} alt={hero.imageAlt} style={coverStyle} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.55) 0%, rgba(4,48,31,0.1) 35%, rgba(4,48,31,0.82) 78%, rgba(4,48,31,0.96) 100%)"}}></div>
            <div style={{position: "absolute", inset: "0", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 0 100px", maxWidth: "1400px", margin: "0 auto", left: "0", right: "0"}}>
              <div style={{padding: "0 48px"}}>
                <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
                <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "92px", lineHeight: "1.02", color: "#faf3e8", margin: "20px 0 0", maxWidth: "15ch", textWrap: "pretty"}}>{hero.titleLead}<em style={{color: "#b3955c"}}>{hero.titleAccent}</em></h1>
                <p style={{margin: "26px 0 0", maxWidth: "58ch", fontWeight: "300", fontSize: "19px", lineHeight: "1.85", color: "rgba(250,243,232,0.9)"}}>{hero.body}</p>
                <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "18px", marginTop: "38px"}}>
                  <a className="x12" href={hero.primaryCta.href} target="_blank" rel="noopener" style={{background: "#b3955c", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{hero.primaryCta.label}</a>
                  <div className="x2" onClick={() => go(hero.secondaryCta.page)} style={{cursor: "pointer", border: "1px solid rgba(250,243,232,0.5)", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase"}}>{hero.secondaryCta.label}</div>
                </div>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px 0", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "90px", alignItems: "start"}}>
            <div>
              <div style={kickerStyle}>{way.kicker}</div>
              <h2 style={headingStyle}>{way.titleLead}<em style={{color: "#b3955c"}}>{way.titleAccent}</em></h2>
            </div>
            <div>
              {way.paragraphs.map((text, i) => (
                <p key={i} style={{margin: i === 0 ? "0" : "20px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9"}}>{text}</p>
              ))}
              <div className="stats-grid" style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px", marginTop: "46px"}}>
                {way.stats.map((stat) => (
                  <div key={stat.label} style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                    <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", color: "#04301f"}}>{stat.value}</div>
                    <div style={{fontSize: "13px", fontWeight: "300", lineHeight: "1.7", color: "rgba(13,43,30,0.72)", marginTop: "4px"}}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px 0"}}>
            <div className="stack-m" style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "40px"}}>
              <div>
                <div style={kickerStyle}>{days.kicker}</div>
                <h2 style={headingStyle}>{days.title}</h2>
              </div>
              <div className="x3" onClick={() => go(days.linkPage)} style={{cursor: "pointer", fontSize: "12px", fontWeight: "500", letterSpacing: "0.22em", textTransform: "uppercase", color: "#04301f", borderBottom: "1px solid #b3955c", paddingBottom: "6px", whiteSpace: "nowrap"}}>{days.linkLabel}</div>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginTop: "48px"}}>
              {days.cards.map((card) => (
                <div key={card.title} onClick={() => go(card.page)} style={{cursor: "pointer", position: "relative", height: "480px", overflow: "hidden", background: "#04301f"}}>
                  <img src={imageSrc(card.image)} alt={card.imageAlt} style={coverStyle} />
                  <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.06) 40%, rgba(4,48,31,0.92) 100%)"}}></div>
                  <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                    <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"}}>{card.kicker}</div>
                    <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: "1.15", marginTop: "6px"}}>{card.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    
          <div style={{marginTop: "120px", background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center"}}>
              <div style={{position: "relative"}}>
                <img src={imageSrc(tunya.image)} alt={tunya.imageAlt} style={{width: "100%", height: "520px", objectFit: "cover", display: "block"}} />
                <div className="deco-frame" style={{position: "absolute", top: "-16px", left: "-16px", right: "16px", bottom: "16px", border: "1px solid rgba(179,149,92,0.6)", pointerEvents: "none"}}></div>
              </div>
              <div>
                <div style={kickerStyle}>{tunya.kicker}</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "56px", lineHeight: "1.08", margin: "18px 0 0"}}>{tunya.title}</h2>
                <p style={{margin: "22px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>{tunya.body}</p>
                <a className="x12" href={tunya.cta.href} target="_blank" rel="noopener" style={{display: "inline-flex", alignItems: "center", gap: "12px", marginTop: "34px", background: "#b3955c", color: "#04301f", padding: "17px 32px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{tunya.cta.label}</a>
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "110px 48px"}}>
            <div style={{textAlign: "center"}}>
              <div style={kickerStyle}>{beyondTeaser.kicker}</div>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px auto 0", maxWidth: "18ch"}}>{beyondTeaser.title}</h2>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "52px"}}>
              {beyondTeaser.cards.map((card) => (
                <div key={card.title} onClick={() => go(card.page)} style={{cursor: "pointer", position: "relative", height: "400px", overflow: "hidden"}}>
                  <img src={imageSrc(card.image)} alt={card.imageAlt} style={coverStyle} />
                  <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.05) 45%, rgba(4,48,31,0.9) 100%)"}}></div>
                  <div style={{position: "absolute", left: "26px", bottom: "24px", color: "#faf3e8", fontFamily: "'Cormorant Garamond', serif", fontSize: "32px"}}>{card.title}</div>
                </div>
              ))}
            </div>
            <div style={{display: "flex", justifyContent: "center", marginTop: "44px"}}>
              <div className="x4" onClick={() => go(beyondTeaser.cta.page)} style={{cursor: "pointer", border: "1px solid #04301f", color: "#04301f", padding: "17px 34px", fontSize: "13px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase"}}>{beyondTeaser.cta.label}</div>
            </div>
          </div>
        </div>
  );
}
