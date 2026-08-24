import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const labelStyle = {fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"};
const inputStyle = {width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none"};
const chipStyle = {cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300"};

export default function PlanMyTrip({ go }) {
  const { plan } = useContent();
  const { hero, form, contact } = plan;
  const rows = [form.fields.slice(0, 2), form.fields.slice(2, 4)];

  return (
    <div data-screen-label="Plan My Trip">
          <div style={{position: "relative", height: "56vh", minHeight: "440px", background: "#04301f", overflow: "hidden"}}>
            <img src={imageSrc(hero.image)} alt={hero.imageAlt} style={{position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"}} />
            <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.5) 0%, rgba(4,48,31,0.15) 40%, rgba(4,48,31,0.92) 85%, rgba(4,48,31,0.98) 100%)"}}></div>
            <div style={{position: "absolute", left: "0", right: "0", bottom: "64px", maxWidth: "1400px", margin: "0 auto", padding: "0 48px"}}>
              <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
              <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "72px", lineHeight: "1.06", color: "#faf3e8", margin: "16px 0 0", maxWidth: "18ch"}}>{hero.title}</h1>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "80px"}}>
            <div>
              <div style={{display: "grid", gap: "26px"}}>
                {rows.map((row, r) => (
                  <div key={r} style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px"}}>
                    {row.map((field) => (
                      <div key={field.label}>
                        <div style={labelStyle}>{field.label}</div>
                        <input className="x8" type={field.type} placeholder={field.placeholder} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                ))}
                <div>
                  <div style={labelStyle}>{form.tripTypeLabel}</div>
                  <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px"}}>
                    {form.tripTypes.map((type) => (
                      <div key={type} className="x2" style={chipStyle}>{type}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>{form.notesLabel}</div>
                  <textarea className="x9" rows="4" placeholder={form.notesPlaceholder} style={{width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px", border: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none", resize: "vertical"}}></textarea>
                </div>
                <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "20px", marginTop: "6px"}}>
                  <div className="x5" style={{cursor: "pointer", background: "#04301f", color: "#faf3e8", padding: "18px 36px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase"}}>{form.submitLabel}</div>
                  <div style={{fontSize: "14px", fontWeight: "300", color: "rgba(13,43,30,0.7)"}}>{form.asideNoteLead}<span style={{color: "#b3955c"}}>{form.asideNoteLink}</span></div>
                </div>
              </div>
            </div>
    
            <div style={{background: "#04301f", color: "#faf3e8", padding: "46px 44px", alignSelf: "start"}}>
              <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.38em", textTransform: "uppercase", color: "#b3955c"}}>{contact.kicker}</div>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "38px", lineHeight: "1.15", marginTop: "14px"}}>{contact.title}</div>
              <div style={{display: "grid", gap: "20px", marginTop: "34px"}}>
                {contact.items.map((item) => {
                  const lines = item.value.split("\n");
                  return (
                    <div key={item.label} style={{borderTop: "1px solid rgba(179,149,92,0.5)", paddingTop: "14px"}}>
                      <div style={{fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(250,243,232,0.6)"}}>{item.label}</div>
                      <div style={{fontSize: "19px", fontWeight: "300", marginTop: "4px", ...(lines.length > 1 ? {lineHeight: "1.6"} : {})}}>
                        {lines.map((line, i) => (
                          <span key={i}>{line}{i < lines.length - 1 && <br />}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
    
          <div style={{height: "110px"}}></div>
        </div>
  );
}
