import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const kickerStyle = {fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"};

export default function About({ go }) {
  const { about } = useContent();
  const { hero, who, mandate, beliefs, team, closing } = about;

  return (
    <div data-screen-label="About Tunyafrika">
          <div style={{position: "relative", height: "62vh", minHeight: "480px", background: "#04301f", overflow: "hidden"}}>
            <img src={imageSrc(hero.image)} alt={hero.imageAlt} style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.5) 0%, rgba(4,48,31,0.12) 40%, rgba(4,48,31,0.92) 85%, rgba(4,48,31,0.98) 100%)"}}></div>
            <div style={{position: "absolute", left: "0", right: "0", bottom: "68px", maxWidth: "1400px", margin: "0 auto", padding: "0 48px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "74px", lineHeight: "1.05", color: "#faf3e8", margin: "16px 0 0", maxWidth: "18ch"}}>{hero.title}</h1>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "80px"}}>
            <div>
              <div style={kickerStyle}>{who.kicker}</div>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "46px", lineHeight: "1.1", margin: "16px 0 0"}}>{who.title}</h2>
            </div>
            <div>
              {who.paragraphs.map((text, i) => (
                <p key={i} style={{margin: i === 0 ? "0" : "20px 0 0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9"}}>{text}</p>
              ))}
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0"}}>
            <div style={kickerStyle}>{mandate.kicker}</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "34px", marginTop: "30px"}}>
              {mandate.items.map((item) => (
                <div key={item.title} style={{borderTop: "1px solid #b3955c", paddingTop: "18px"}}>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px"}}>{item.title}</div>
                  <p style={{margin: "10px 0 0", fontWeight: "300", fontSize: "16px", lineHeight: "1.85", color: "rgba(13,43,30,0.78)"}}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
    
          <div style={{marginTop: "100px", background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "70px"}}>
              <div>
                <div style={kickerStyle}>{beliefs.kicker}</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "50px", lineHeight: "1.08", margin: "16px 0 0"}}>{beliefs.title}</h2>
              </div>
              <div style={{display: "grid", gap: "22px", alignContent: "center"}}>
                {beliefs.items.map((item, i) => (
                  <div key={i} style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px", fontWeight: "300", fontSize: "18px", lineHeight: "1.8", color: "rgba(250,243,232,0.9)"}}>{item}</div>
                ))}
              </div>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 0"}}>
            <div className="stack-m" style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "40px"}}>
              <div>
                <div style={kickerStyle}>{team.kicker}</div>
                <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "50px", lineHeight: "1.1", margin: "16px 0 0"}}>{team.title}</h2>
              </div>
              <div style={{fontSize: "13px", fontWeight: "300", color: "rgba(13,43,30,0.6)", maxWidth: "34ch", textAlign: "right"}}>{team.note}</div>
            </div>
            <div className="team-grid" style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", marginTop: "44px"}}>
              {team.members.map((member) => (
                <div key={member.name}>
                  <div style={{height: "320px", background: "linear-gradient(160deg, #0b3d28 0%, #04301f 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(179,149,92,0.45)", overflow: "hidden"}}>
                    {member.photo
                      ? <img src={imageSrc(member.photo)} alt={member.name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                      : <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "58px", color: "#b3955c"}}>{member.initials}</div>}
                  </div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", marginTop: "16px", lineHeight: "1.25"}}>{member.name}</div>
                  <div style={{fontSize: "12px", fontWeight: "400", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b3955c", marginTop: "6px"}}>{member.role}</div>
                </div>
              ))}
            </div>
          </div>
    
          <div className="stack-m" style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 110px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "46px", lineHeight: "1.12", margin: "0", maxWidth: "22ch"}}>{closing.title}</h2>
            <a className="x6" href={closing.cta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", textDecoration: "none"}}>{closing.cta.label}</a>
          </div>
        </div>
  );
}
