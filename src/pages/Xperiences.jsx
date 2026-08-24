import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const coverStyle = {position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"};
const kickerStyle = {fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"};
const cardKickerStyle = {fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"};

export default function Xperiences({ go }) {
  const { xp } = useContent();
  const { hero, headline, secondary, boma, flagship, closing } = xp;

  return (
    <div data-screen-label="Xperiences">
          <div style={{background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 90px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "78px", lineHeight: "1.06", margin: "18px 0 0", maxWidth: "18ch"}}>{hero.title}</h1>
              <p style={{margin: "24px 0 0", maxWidth: "62ch", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.88)"}}>{hero.body}</p>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
            {headline.map((item) => (
              <div key={item.title} style={{position: "relative", height: "520px", overflow: "hidden"}}>
                <img src={imageSrc(item.image)} alt={item.imageAlt} style={coverStyle} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.08) 40%, rgba(4,48,31,0.92) 100%)"}}></div>
                <div style={{position: "absolute", left: "34px", right: "34px", bottom: "32px", color: "#faf3e8"}}>
                  <div style={cardKickerStyle}>{item.kicker}</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", lineHeight: "1.1", marginTop: "8px"}}>{item.title}</div>
                  <div style={{fontSize: "16px", fontWeight: "300", marginTop: "8px", color: "rgba(250,243,232,0.88)"}}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "20px 48px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px"}}>
            {secondary.map((item) => (
              <div key={item.title} style={{position: "relative", height: "420px", overflow: "hidden"}}>
                <img src={imageSrc(item.image)} alt={item.imageAlt} style={coverStyle} />
                <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.06) 45%, rgba(4,48,31,0.92) 100%)"}}></div>
                <div style={{position: "absolute", left: "26px", right: "26px", bottom: "26px", color: "#faf3e8"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", lineHeight: "1.15"}}>{item.title}</div>
                  <div style={{fontSize: "14px", fontWeight: "300", marginTop: "6px", color: "rgba(250,243,232,0.85)"}}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
    
          <div style={{marginTop: "100px", background: "#120b04", color: "#faf3e8"}}>
            <div style={{position: "relative", height: "420px", overflow: "hidden"}}>
              <img src={imageSrc(boma.image)} alt={boma.imageAlt} style={{...coverStyle, objectPosition: boma.imagePosition}} />
              <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(18,11,4,0.35) 0%, rgba(18,11,4,0.05) 40%, rgba(18,11,4,1) 100%)"}}></div>
            </div>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "0 48px 100px", marginTop: "-70px", position: "relative", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "70px", alignItems: "end"}}>
              <div>
                <div style={kickerStyle}>{boma.kicker}</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "60px", lineHeight: "1.08", margin: "16px 0 0"}}>{boma.title}</h2>
                <p style={{margin: "20px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>{boma.body}</p>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px"}}>
                {boma.gallery.map((shot, i) => (
                  <img key={i} src={imageSrc(shot.image)} alt={shot.imageAlt} style={{width: "100%", height: "240px", objectFit: "cover"}} />
                ))}
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 0"}}>
            <div style={{textAlign: "center"}}>
              <div style={kickerStyle}>{flagship.kicker}</div>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px auto 0", maxWidth: "20ch"}}>{flagship.title}</h2>
              <p style={{margin: "18px auto 0", maxWidth: "58ch", fontWeight: "300", fontSize: "18px", lineHeight: "1.85", color: "rgba(13,43,30,0.78)"}}>{flagship.body}</p>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "50px"}}>
              {flagship.items.map((item) => (
                <div key={item.title} style={{position: "relative", height: "440px", overflow: "hidden"}}>
                  <img src={imageSrc(item.image)} alt={item.imageAlt} style={coverStyle} />
                  <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.05) 26%, rgba(4,48,31,0.55) 60%, rgba(4,48,31,0.96) 100%)"}}></div>
                  <div style={{position: "absolute", left: "28px", right: "28px", bottom: "28px", color: "#faf3e8"}}>
                    <div style={cardKickerStyle}>{item.kicker}</div>
                    <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", lineHeight: "1.1", marginTop: "6px"}}>{item.title}</div>
                    <div style={{fontSize: "15px", fontWeight: "300", marginTop: "8px", color: "rgba(250,243,232,0.88)"}}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    
          <div className="stack-m" style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 110px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "48px", lineHeight: "1.1", margin: "0", maxWidth: "20ch"}}>{closing.title}</h2>
            <a className="x6" href={closing.cta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", textDecoration: "none"}}>{closing.cta.label}</a>
          </div>
        </div>
  );
}
