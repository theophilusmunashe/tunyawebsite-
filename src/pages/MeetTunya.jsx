import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const bubbleBase = {padding: "22px 26px", fontSize: "18px", fontWeight: "300", lineHeight: "1.6"};

export default function MeetTunya({ go }) {
  const { ai } = useContent();
  const { hero, features, closing } = ai;

  return (
    <div data-screen-label="Meet Tunya">
          <div style={{background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 100px", display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: "80px", alignItems: "center"}}>
              <div>
                <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
                <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "76px", lineHeight: "1.05", margin: "18px 0 0", maxWidth: "16ch"}}>{hero.title}</h1>
                {hero.paragraphs.map((text, i) => (
                  <p key={i} style={{margin: i === 0 ? "24px 0 0" : "18px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>{text}</p>
                ))}
                <div style={{display: "inline-flex", alignItems: "center", gap: "12px", marginTop: "34px", background: "#b3955c", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase"}}>{hero.badge}</div>
              </div>
              <div style={{display: "grid", gap: "16px"}}>
                {hero.conversation.map((msg, i) => (
                  <div
                    key={i}
                    style={msg.from === "tunya"
                      ? {...bubbleBase, background: "#b3955c", color: "#0d2b1e", maxWidth: msg.width, justifySelf: "end"}
                      : {...bubbleBase, background: "rgba(250,243,232,0.95)", color: "#0d2b1e", maxWidth: msg.width}}
                  >{msg.text}</div>
                ))}
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px"}}>
            {features.map((item) => (
              <div key={item.title} style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>{item.title}</div>
                <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>{item.body}</p>
              </div>
            ))}
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 110px"}}>
            <div style={{position: "relative"}}>
              <img src={imageSrc(closing.image)} alt={closing.imageAlt} style={{width: "100%", height: "460px", objectFit: "cover", display: "block"}} />
              <div className="deco-frame" style={{position: "absolute", top: "-16px", left: "-16px", right: "16px", bottom: "16px", border: "1px solid #b3955c", pointerEvents: "none"}}></div>
            </div>
            <div className="stack-m" style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", marginTop: "48px"}}>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "46px", lineHeight: "1.12", margin: "0", maxWidth: "22ch"}}>{closing.title}</h2>
              <a className="x6" href={closing.cta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", textDecoration: "none"}}>{closing.cta.label}</a>
            </div>
          </div>
        </div>
  );
}
