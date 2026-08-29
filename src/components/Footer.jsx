import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const headingStyle = {fontSize: "11px", fontWeight: "500", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b3955c"};
const linkStyle = {cursor: "pointer", fontSize: "15px", fontWeight: "300", color: "rgba(250,243,232,0.85)"};

const ICONS = {
  facebook: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5H16.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z"></path></svg>,
  instagram: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"></circle></svg>,
  x: <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M17.53 3H20.5l-6.49 7.42L21.75 21h-5.98l-4.68-6.12L5.7 21H2.73l6.94-7.93L2.25 3h6.13l4.23 5.6L17.53 3zm-1.04 16.2h1.64L7.6 4.71H5.84L16.49 19.2z"></path></svg>,
  tiktok: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8a5 5 0 0 1-1.4-3.3h-3v12a2.6 2.6 0 1 1-1.9-2.5V8.9a5.7 5.7 0 1 0 4.9 5.6V9.2a8.2 8.2 0 0 0 4.5 1.4V7.5a4.9 4.9 0 0 1-3.1-1.7z"></path></svg>,
  whatsapp: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.4 12.1c-.2.6-1.1 1.1-1.6 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.4-4.8c-.6-1-.9-1.9-.6-2.6.2-.4.6-1 .9-1.1h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3-.1.5.5.9 1.9 2.3 3.2 2.9.2.1.4.1.5-.1l.7-.8c.2-.2.3-.3.6-.2l1.8.9c.3.1.4.2.4.4 0 .1 0 .5-.2.7z"></path></svg>
};

export default function Footer({ go }) {
  const { site } = useContent();
  const f = site.footer;

  return (
    <div className="site-footer" style={{background: "#04301f", color: "#faf3e8", borderTop: "1px solid rgba(179,149,92,0.35)"}}>
        <div className="site-footer-grid" style={{maxWidth: "1400px", margin: "0 auto", padding: "70px 48px 46px", display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: "50px"}}>
          <div>
            <span className="site-footer-logo-frame">
              <img className="site-footer-logo" src={imageSrc(site.logo, "/assets/logo-cream.png")} alt={site.logoAlt} style={{width: "220px", margin: "-60px -50px -44px"}} />
            </span>
            <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.34em", textTransform: "uppercase", color: "#b3955c", marginTop: "8px"}}>{f.tagline}</div>
            <p style={{margin: "16px 0 0", fontWeight: "300", fontSize: "15px", lineHeight: "1.85", color: "rgba(250,243,232,0.75)", maxWidth: "34ch"}}>{f.blurb}</p>
          </div>
          <div>
            <div style={headingStyle}>{f.exploreHeading}</div>
            <div style={{display: "grid", gap: "10px", marginTop: "16px"}}>
              {f.explore.map((item) => (
                <div key={item.label} className="x3" onClick={() => go(item.page)} style={linkStyle}>{item.label}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={headingStyle}>{f.bookHeading}</div>
            <div style={{display: "grid", gap: "10px", marginTop: "16px"}}>
              {f.book.map((item) => (
                <div key={item.label} className="x3" onClick={() => go(item.page)} style={linkStyle}>{item.label}</div>
              ))}
              <div style={{fontSize: "15px", fontWeight: "300", color: "rgba(250,243,232,0.85)"}}>{f.bookNote}</div>
            </div>
          </div>
          <div>
            <div style={headingStyle}>{f.contactHeading}</div>
            <div style={{display: "grid", gap: "10px", marginTop: "16px", fontSize: "15px", fontWeight: "300", color: "rgba(250,243,232,0.85)"}}>
              <div>{f.phone}</div>
              <div>{f.email}</div>
              <div style={{lineHeight: "1.6"}}>{f.addressLine1}<br />{f.addressLine2}</div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "16px", marginTop: "20px", color: "rgba(250,243,232,0.8)"}}>
              {f.socials.map((s) => (
                <a key={s.network} className="x3" href={s.href} target="_blank" rel="noopener" aria-label={s.network} style={{color: "inherit", display: "flex"}}>{ICONS[s.network]}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="site-footer-copy" style={{maxWidth: "1400px", margin: "0 auto", padding: "0 48px 40px", fontSize: "12px", fontWeight: "300", letterSpacing: "0.08em", color: "rgba(250,243,232,0.5)"}}>{f.copyright}</div>
      </div>
  );
}
