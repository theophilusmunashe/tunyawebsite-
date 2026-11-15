import { PAGE_PATHS, linkClick } from "../routes.js";

const linkStyle = { color: "#04301f", borderBottom: "1px solid #b3955c", textDecoration: "none", paddingBottom: "2px" };

const LINKS = [
  ["xp", "Things to do in Victoria Falls"],
  ["stays", "Where to stay"],
  ["visas", "Visas & borders"],
  ["plan", "Plan my trip"]
];

export default function NotFound({ go }) {
  return (
    <div data-screen-label="Not found" style={{ maxWidth: "900px", margin: "0 auto", padding: "200px 24px 140px", textAlign: "center" }}>
      <div style={{ fontSize: "12px", fontWeight: "500", letterSpacing: "0.42em", textTransform: "uppercase", color: "#b3955c" }}>404</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: "500", fontSize: "54px", lineHeight: "1.1", margin: "18px 0 0" }}>
        We can't find that page.
      </h1>
      <p style={{ margin: "22px auto 0", maxWidth: "52ch", fontWeight: "300", fontSize: "19px", lineHeight: "1.85" }}>
        It may have moved when we rebuilt the site. Try one of these, or WhatsApp us on{" "}
        <a href="https://wa.me/263782669251" style={linkStyle}>+263 78 266 9251</a> and one of us will help.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "22px", marginTop: "36px", fontSize: "16px" }}>
        <a href="/" onClick={linkClick(go, "home")} style={linkStyle}>Home</a>
        {LINKS.map(([key, label]) => (
          <a key={key} href={PAGE_PATHS[key]} onClick={linkClick(go, key)} style={linkStyle}>{label}</a>
        ))}
      </div>
    </div>
  );
}
