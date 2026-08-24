import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const seasonLabelStyle = {fontFamily: "'Cormorant Garamond', serif", fontSize: "24px"};
const seasonNoteStyle = {fontSize: "15px", fontWeight: "300", color: "rgba(13,43,30,0.72)", textAlign: "right"};

export default function VictoriaFalls({ go }) {
  const { falls } = useContent();
  const { hero, intro, mosaic, know } = falls;

  return (
    <div data-screen-label="Victoria Falls">
          <div style={{position: "relative", height: "78vh", minHeight: "620px", background: "#04301f", overflow: "hidden"}}>
            <img src={imageSrc(hero.image)} alt={hero.imageAlt} style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.5) 0%, rgba(4,48,31,0.08) 38%, rgba(4,48,31,0.86) 80%, rgba(4,48,31,0.97) 100%)"}}></div>
            <div style={{position: "absolute", left: "0", right: "0", bottom: "84px", maxWidth: "1400px", margin: "0 auto", padding: "0 48px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "80px", lineHeight: "1.05", color: "#faf3e8", margin: "18px 0 0", maxWidth: "16ch"}}>{hero.title}</h1>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 0", display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "80px"}}>
            <div>
              {intro.paragraphs.map((text, i) => (
                <p key={i} style={{margin: i === 0 ? "0" : "20px 0 0", fontWeight: "300", fontSize: "20px", lineHeight: "1.9"}}>{text}</p>
              ))}
            </div>
            <div style={{display: "grid", gap: "22px", alignContent: "start"}}>
              {intro.seasons.map((season, i) => (
                <div key={season.period} className="split-line" style={{borderTop: i === 0 ? "1px solid #b3955c" : "1px solid rgba(179,149,92,0.4)", paddingTop: "14px", display: "flex", justifyContent: "space-between", gap: "24px"}}>
                  <span style={seasonLabelStyle}>{season.period}</span>
                  <span style={seasonNoteStyle}>{season.note}</span>
                </div>
              ))}
            </div>
          </div>
    
          <div className="photo-mosaic" style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0", display: "grid", gridTemplateColumns: "1.4fr 1fr", gridTemplateRows: "300px 300px", gap: "20px"}}>
            {mosaic.map((shot, i) => (
              <img key={i} src={imageSrc(shot.image)} alt={shot.imageAlt} style={{width: "100%", height: "100%", objectFit: "cover", ...(i === 0 ? {gridRow: "1 / 3"} : {})}} />
            ))}
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0"}}>
            <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{know.kicker}</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", marginTop: "34px"}}>
              {know.items.map((item) => (
                <div key={item.title} style={{borderTop: "1px solid #b3955c", paddingTop: "16px"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "26px"}}>{item.title}</div>
                  <p style={{margin: "8px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.8", color: "rgba(13,43,30,0.78)"}}>{item.body}</p>
                </div>
              ))}
            </div>
            <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "18px", marginTop: "56px", paddingBottom: "110px"}}>
              <a className="x6" href={know.primaryCta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{know.primaryCta.label}</a>
              <div className="x4" onClick={() => go(know.secondaryCta.page)} style={{cursor: "pointer", border: "1px solid #04301f", color: "#04301f", padding: "18px 34px", fontSize: "13px", fontWeight: "500", letterSpacing: "0.2em", textTransform: "uppercase"}}>{know.secondaryCta.label}</div>
            </div>
          </div>
        </div>
  );
}
