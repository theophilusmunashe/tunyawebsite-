import { useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { TUNYA_URL } from "../content/defaults/site.js";
import { imageSrc } from "../lib/sanity.js";

const labelStyle = {fontSize: "11px", fontWeight: "500", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(13,43,30,0.6)"};
const inputStyle = {width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none"};
const chipStyle = {cursor: "pointer", border: "1px solid rgba(13,43,30,0.25)", padding: "10px 20px", fontSize: "14px", fontWeight: "300", background: "transparent", fontFamily: "'Poppins', sans-serif", color: "#0d2b1e"};
const chipOnStyle = {...chipStyle, background: "#04301f", borderColor: "#04301f", color: "#faf3e8"};
const FIELD_KEYS = ["name", "email", "when", "who"];

export default function PlanMyTrip({ go }) {
  const { plan } = useContent();
  const { hero, form, contact } = plan;
  const rows = [form.fields.slice(0, 2), form.fields.slice(2, 4)];
  const [values, setValues] = useState({ name: "", email: "", when: "", who: "", notes: "", website: "" });
  const [types, setTypes] = useState([]);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const toggle = (type) => setTypes((list) => (list.includes(type) ? list.filter((t) => t !== type) : [...list, type]));

  const submit = async (e) => {
    e.preventDefault();
    if (status.state === "sending") return;
    setStatus({ state: "sending", message: "" });
    try {
      const res = await fetch("/api/plan-request.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, types })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok !== true) throw new Error(data.error || "We couldn't send that just now. Please WhatsApp +263 78 266 9251.");
      setStatus({ state: "sent", message: "Thank you. One of us will reply by email soon. If it's urgent, WhatsApp +263 78 266 9251." });
      setValues({ name: "", email: "", when: "", who: "", notes: "", website: "" });
      setTypes([]);
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

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
            <form onSubmit={submit} noValidate={false}>
              <input type="text" name="website" value={values.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0}} />
              <div style={{display: "grid", gap: "26px"}}>
                {rows.map((row, r) => (
                  <div key={r} style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px"}}>
                    {row.map((field, i) => {
                      const key = FIELD_KEYS[r * 2 + i];
                      return (
                        <label key={field.label} style={{display: "block"}}>
                          <div style={labelStyle}>{field.label}</div>
                          <input className="x8" name={key} type={field.type} placeholder={field.placeholder} value={values[key]} onChange={set(key)} required={key === "name" || key === "email"} autoComplete={key === "name" ? "name" : key === "email" ? "email" : "off"} style={inputStyle} />
                        </label>
                      );
                    })}
                  </div>
                ))}
                <div>
                  <div style={labelStyle}>{form.tripTypeLabel}</div>
                  <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px"}}>
                    {form.tripTypes.map((type) => (
                      <button key={type} type="button" className="x2" aria-pressed={types.includes(type)} onClick={() => toggle(type)} style={types.includes(type) ? chipOnStyle : chipStyle}>{type}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="plan-notes" style={labelStyle}>{form.notesLabel}</label>
                  <textarea id="plan-notes" name="notes" value={values.notes} onChange={set("notes")} className="x9" rows="4" placeholder={form.notesPlaceholder} style={{width: "100%", boxSizing: "border-box", marginTop: "8px", padding: "14px", border: "1px solid rgba(13,43,30,0.25)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: "300", color: "#0d2b1e", outline: "none", resize: "vertical"}}></textarea>
                </div>
                <div className="stack-m" style={{display: "flex", alignItems: "center", gap: "20px", marginTop: "6px"}}>
                  <button type="submit" className="x5" disabled={status.state === "sending"} style={{cursor: "pointer", border: "none", fontFamily: "'Poppins', sans-serif", background: "#04301f", color: "#faf3e8", padding: "18px 36px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase"}}>{status.state === "sending" ? "Sending…" : form.submitLabel}</button>
                  <div style={{fontSize: "14px", fontWeight: "300", color: "rgba(13,43,30,0.7)"}}>{form.asideNoteLead}<a href={TUNYA_URL} target="_blank" rel="noopener" style={{color: "#b3955c", textDecoration: "none"}}>{form.asideNoteLink}</a></div>
                </div>
                {status.message && (
                  <p role="status" style={{margin: 0, fontSize: "15px", fontWeight: "300", color: status.state === "error" ? "#a5452a" : "#04301f"}}>{status.message}</p>
                )}
              </div>
            </form>
    
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
