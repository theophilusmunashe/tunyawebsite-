import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const coverStyle = {position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"};
const cardKickerStyle = {fontSize: "11px", fontWeight: "500", letterSpacing: "0.32em", textTransform: "uppercase", color: "#b3955c"};

export default function BeyondTheFalls({ go }) {
  const { beyond } = useContent();
  const { hero, feature, countries, closing } = beyond;

  return (
    <div data-screen-label="Beyond the Falls">
          <div style={{background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 90px", display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: "70px", alignItems: "end"}}>
              <div>
                <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
                <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "78px", lineHeight: "1.05", margin: "18px 0 0", maxWidth: "16ch"}}>{hero.title}</h1>
              </div>
              <p style={{margin: "0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>{hero.body}</p>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0", display: "grid", gap: "20px"}}>
            <div className="feature-banner" style={{position: "relative", height: "520px", overflow: "hidden"}}>
              <img src={imageSrc(feature.image)} alt={feature.imageAlt} style={{...coverStyle, objectPosition: feature.imagePosition}} />
              <div style={{position: "absolute", inset: "0", background: "linear-gradient(90deg, rgba(4,48,31,0.9) 0%, rgba(4,48,31,0.55) 42%, rgba(4,48,31,0.15) 100%)"}}></div>
              <div className="overlay-panel" style={{position: "absolute", left: "44px", top: "0", bottom: "0", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "46%", color: "#faf3e8"}}>
                <div style={cardKickerStyle}>{feature.kicker}</div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "52px", lineHeight: "1.08", marginTop: "10px"}}>{feature.title}</div>
                <div style={{fontSize: "17px", fontWeight: "300", lineHeight: "1.8", marginTop: "12px", color: "rgba(250,243,232,0.9)"}}>{feature.body}</div>
              </div>
            </div>
    
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
              {countries.map((country) => (
                <div key={country.title} style={{position: "relative", height: "460px", overflow: "hidden"}}>
                  <img src={imageSrc(country.image)} alt={country.imageAlt} style={coverStyle} />
                  <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.1) 40%, rgba(4,48,31,0.93) 100%)"}}></div>
                  <div style={{position: "absolute", left: "32px", right: "32px", bottom: "30px", color: "#faf3e8"}}>
                    <div style={cardKickerStyle}>{country.kicker}</div>
                    <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", lineHeight: "1.1", marginTop: "6px"}}>{country.title}</div>
                    <div style={{fontSize: "16px", fontWeight: "300", marginTop: "8px", color: "rgba(250,243,232,0.88)"}}>{country.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 110px", textAlign: "center"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "52px", lineHeight: "1.1", margin: "0 auto", maxWidth: "22ch"}}>{closing.title}</h2>
            <div style={{display: "flex", justifyContent: "center", marginTop: "34px"}}>
              <a className="x6" href={closing.cta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none"}}>{closing.cta.label}</a>
            </div>
          </div>
        </div>
  );
}
