import { useContent } from "../content/ContentProvider.jsx";
import { imageSrc } from "../lib/sanity.js";

const cardStyle = {textDecoration: "none", color: "#0d2b1e", border: "1px solid rgba(13,43,30,0.2)", padding: "34px 32px", display: "block"};
const handleStyle = {fontSize: "15px", fontWeight: "300", color: "rgba(13,43,30,0.72)", marginTop: "6px"};
const cardBodyStyle = {fontSize: "15px", fontWeight: "300", lineHeight: "1.8", color: "rgba(13,43,30,0.72)", marginTop: "12px"};

const ICONS = {
  facebook: <svg width="30" height="30" viewBox="0 0 24 24" fill="#04301f"><path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5H16.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z"></path></svg>,
  instagram: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#04301f" strokeWidth="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="1.1" fill="#04301f" stroke="none"></circle></svg>,
  whatsapp: <svg width="30" height="30" viewBox="0 0 24 24" fill="#04301f"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.4 12.1c-.2.6-1.1 1.1-1.6 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.4-4.8c-.6-1-.9-1.9-.6-2.6.2-.4.6-1 .9-1.1h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3-.1.5.5.9 1.9 2.3 3.2 2.9.2.1.4.1.5-.1l.7-.8c.2-.2.3-.3.6-.2l1.8.9c.3.1.4.2.4.4 0 .1 0 .5-.2.7z"></path></svg>,
  x: <svg width="30" height="30" viewBox="0 0 24 24" fill="#04301f"><path d="M17.53 3H20.5l-6.49 7.42L21.75 21h-5.98l-4.68-6.12L5.7 21H2.73l6.94-7.93L2.25 3h6.13l4.23 5.6L17.53 3zm-1.04 16.2h1.64L7.6 4.71H5.84L16.49 19.2z"></path></svg>,
  tiktok: <svg width="30" height="30" viewBox="0 0 24 24" fill="#04301f"><path d="M16.6 5.8a5 5 0 0 1-1.4-3.3h-3v12a2.6 2.6 0 1 1-1.9-2.5V8.9a5.7 5.7 0 1 0 4.9 5.6V9.2a8.2 8.2 0 0 0 4.5 1.4V7.5a4.9 4.9 0 0 1-3.1-1.7z"></path></svg>
};

export default function Socials({ go }) {
  const { social } = useContent();
  const { hero, channels, tunyaCard, feed } = social;

  return (
    <div data-screen-label="Our Footprints on Socials">
          <div style={{background: "#04301f", color: "#faf3e8"}}>
            <div style={{maxWidth: "1400px", margin: "0 auto", padding: "100px 48px 90px", display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: "70px", alignItems: "end"}}>
              <div>
                <div style={{fontSize: "13px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{hero.kicker}</div>
                <h1 style={{fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "76px", lineHeight: "1.05", margin: "18px 0 0", maxWidth: "15ch"}}>{hero.title}</h1>
              </div>
              <p style={{margin: "0", fontWeight: "300", fontSize: "19px", lineHeight: "1.9", color: "rgba(250,243,232,0.9)"}}>{hero.body}</p>
            </div>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px"}}>
            {channels.map((channel) => (
              <a key={channel.network} className="x7" href={channel.href} target="_blank" rel="noopener" style={cardStyle}>
                {ICONS[channel.network]}
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", marginTop: "18px"}}>{channel.name}</div>
                <div style={handleStyle}>{channel.handle}</div>
                <div style={cardBodyStyle}>{channel.body}</div>
                <div style={{ marginTop: 16, fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a7040" }}>Follow</div>
              </a>
            ))}
            <a className="x6" href={tunyaCard.href} target="_blank" rel="noopener" style={{textDecoration: "none", color: "#faf3e8", background: "#04301f", padding: "34px 32px", display: "block"}}>
              <div style={{fontSize: "11px", fontWeight: "500", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b3955c"}}>{tunyaCard.kicker}</div>
              <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", marginTop: "14px"}}>{tunyaCard.title}</div>
              <div style={{fontSize: "15px", fontWeight: "300", color: "#b3955c", marginTop: "6px"}}>{tunyaCard.handle}</div>
              <div style={{fontSize: "15px", fontWeight: "300", lineHeight: "1.8", color: "rgba(250,243,232,0.85)", marginTop: "12px"}}>{tunyaCard.body}</div>
            </a>
          </div>
    
          <div style={{maxWidth: "1400px", margin: "0 auto", padding: "80px 48px 0"}}>
            <div style={{fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c"}}>{feed.kicker}</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "26px"}}>
              {feed.images.map((shot, i) => (
                <img key={i} src={imageSrc(shot.image)} alt={shot.imageAlt} style={{width: "100%", height: "260px", objectFit: "cover"}} />
              ))}
            </div>
          </div>
    
          <div style={{height: "110px"}}></div>
        </div>
  );
}
