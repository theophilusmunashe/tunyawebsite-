import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

export default function Stays({ go }) {
  const { stays } = useContent();
  const { hero, categories, gallery, closing } = stays;
  const lastIndex = categories.length - 1;

  return (
    <div data-screen-label="Stays">
          <div style={{position: "relative", height: "66vh", minHeight: "520px", background: "#04301f", overflow: "hidden"}}>
            <img src={imageSrc(hero.image)} alt={hero.imageAlt} style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.45) 0%, rgba(4,48,31,0.08) 40%, rgba(4,48,31,0.9) 82%, rgba(4,48,31,0.97) 100%)"}}></div>
            <div style={{position: "absolute", left: "0", right: "0", bottom: "76px", maxWidth: "1400px", margin: "0 auto", padding: "0 48px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "76px", lineHeight: "1.06", color: "#faf3e8", margin: "16px 0 0", maxWidth: "17ch"}}>{hero.title}</h1>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gap: "0"}}>
            {categories.map((cat, i) => (
              <div key={cat.title} style={{display: "grid", gridTemplateColumns: "0.5fr 1fr", gap: "40px", borderTop: i === 0 ? "1px solid #b3955c" : "1px solid rgba(179,149,92,0.4)", ...(i === lastIndex ? {borderBottom: "1px solid rgba(179,149,92,0.4)"} : {}), padding: "24px 0"}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", color: "#04301f"}}>{cat.title}</div>
                <div style={{fontWeight: "300", fontSize: "18px", lineHeight: "1.8", color: "rgba(13,43,30,0.8)", alignSelf: "center"}}>{cat.body}</div>
              </div>
            ))}
          </div>
    
          <div className="stay-gallery" style={{maxWidth: "1400px", margin: "0 auto", padding: "60px 48px 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "280px", gap: "18px"}}>
            {gallery.map((shot, i) => (
              <img key={i} src={imageSrc(shot.image)} alt={shot.imageAlt} style={{width: "100%", height: "100%", objectFit: "cover", ...(shot.wide ? {gridColumn: "span 2"} : {})}} />
            ))}
          </div>
    
          <div className="stack-m" style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 110px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px"}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "46px", lineHeight: "1.12", margin: "0", maxWidth: "22ch"}}>{closing.title}</h2>
            <a className="x6" href={closing.cta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", textDecoration: "none"}}>{closing.cta.label}</a>
          </div>
        </div>
  );
}
