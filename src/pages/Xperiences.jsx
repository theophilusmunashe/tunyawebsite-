import { useEffect, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { sendBookRequest } from "../lib/bookRequest.js";
import { imageSrc } from "../lib/sanity.js";

const coverStyle = {position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover"};
const kickerStyle = {fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"};
const cardKickerStyle = {fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"};

function PackageModal({ item, onClose }) {
  const [booking, setBooking] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [busy, onClose]);

  const send = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendBookRequest({ email, name, packageName: item.title });
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send the booking request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="xp-modal" onClick={() => { if (!busy) onClose(); }} role="presentation">
      <div className="xp-modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="xp-package-title">
        <button type="button" className="xp-modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="xp-modal-hero">
          <img src={imageSrc(item.image)} alt={item.imageAlt} />
        </div>
        <div className="xp-modal-body">
          <div style={cardKickerStyle}>{item.kicker}</div>
          <h2 id="xp-package-title">{item.title}</h2>
          {item.lede && <p className="xp-modal-lede">{item.lede}</p>}
          <p className="xp-modal-copy">{item.body}</p>

          {(item.days || []).length > 0 && (
            <div className="xp-days">
              {item.days.map((day) => (
                <div key={day.title}>
                  <div className="xp-day-title">{day.title}</div>
                  <p>{day.body}</p>
                </div>
              ))}
            </div>
          )}

          {(item.included || []).length > 0 && (
            <div className="xp-included">
              <div className="xp-day-title">Included</div>
              <ul>
                {item.included.map((entry) => <li key={entry}>{entry}</li>)}
              </ul>
            </div>
          )}

          {sent ? (
            <div className="xp-book-sent">
              Request sent. Operations will reply to {email} about {item.title}.
            </div>
          ) : booking ? (
            <form className="xp-book-form" onSubmit={send}>
              <p className="xp-modal-copy" style={{ marginTop: 0 }}>Leave your email and we will send this booking request to operations@tunyafrika.com.</p>
              <label>
                <span>Email</span>
                <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </label>
              <label>
                <span>Name <em>(optional)</em></span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </label>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="xp-honeypot" />
              {error && <p className="xp-book-error">{error}</p>}
              <div className="xp-modal-actions">
                <button type="submit" className="x12 xp-btn-gold" disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
                <button type="button" className="xp-btn-ghost" disabled={busy} onClick={() => setBooking(false)}>Back</button>
              </div>
            </form>
          ) : (
            <div className="xp-modal-actions">
              <button type="button" className="x12 xp-btn-gold" onClick={() => setBooking(true)}>Book now</button>
              <button type="button" className="xp-btn-ghost" onClick={onClose}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Xperiences({ go }) {
  const { xp } = useContent();
  const { hero, headline, secondary, boma, flagship, closing } = xp;
  const [open, setOpen] = useState(null);

  return (
    <div data-screen-label="Xperiences">
      <div style={{background: "#04301f", color: "#faf3e8"}}>
        <div style={{maxWidth: "1400px", margin: "0 auto", padding: "72px 48px 36px", textAlign: "center"}}>
          <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{flagship.kicker || hero.kicker}</div>
          <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "72px", lineHeight: "1.06", margin: "18px auto 0", maxWidth: "18ch"}}>{flagship.title || hero.title}</h1>
          <p style={{margin: "20px auto 0", maxWidth: "58ch", fontWeight: "300", fontSize: "19px", lineHeight: "1.85", color: "rgba(250,243,232,0.88)"}}>{flagship.body || hero.body}</p>
        </div>
      </div>

      <div style={{maxWidth: "1400px", margin: "0 auto", padding: "28px 48px 0"}}>
        <div className="xp-flagship-grid">
          {flagship.items.map((item) => (
            <div key={item.title} className="xp-flagship-card">
              <img src={imageSrc(item.image)} alt={item.imageAlt} style={coverStyle} />
              <div style={{position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(4,48,31,0.05) 26%, rgba(4,48,31,0.55) 60%, rgba(4,48,31,0.96) 100%)"}}></div>
              <div className="xp-flagship-copy">
                <div style={cardKickerStyle}>{item.kicker}</div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", lineHeight: "1.1", marginTop: "6px"}}>{item.title}</div>
                <div style={{fontSize: "15px", fontWeight: "300", marginTop: "8px", color: "rgba(250,243,232,0.88)"}}>{item.lede || item.body}</div>
                <button type="button" className="x12 xp-view-btn" onClick={() => setOpen(item)}>View package</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
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

      <div className="stack-m" style={{maxWidth: "1400px", margin: "0 auto", padding: "90px 48px 110px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px"}}>
        <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "48px", lineHeight: "1.1", margin: "0", maxWidth: "20ch"}}>{closing.title}</h2>
        <a className="x6" href={closing.cta.href} target="_blank" rel="noopener" style={{background: "#04301f", color: "#faf3e8", padding: "18px 34px", fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap", textDecoration: "none"}}>{closing.cta.label}</a>
      </div>

      {open && <PackageModal item={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
