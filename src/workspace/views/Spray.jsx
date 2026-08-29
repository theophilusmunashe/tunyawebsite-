import { catParts, sprayForMonth } from "../lib/time.js";
import { PageHead } from "../ui.jsx";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function Spray() {
  const now = catParts();
  const current = sprayForMonth();

  return (
    <div>
      <PageHead title="Season" />

      <div className="ws-panel" style={{ marginBottom: 16 }}>
        <div className="ws-kicker">{now.month}</div>
        <h2>{current.label}</h2>
        <div className="ws-curtain" style={{ margin: "14px 0 8px", height: 14 }}><span style={{ width: `${current.curtain}%` }} /></div>
        <div className="ws-grid-2" style={{ marginTop: 18 }}>
          <div>
            <div className="ws-kicker">Sell</div>
            <ul style={{ paddingLeft: 18, fontWeight: 300, lineHeight: 1.7 }}>
              {current.sell.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div>
            <div className="ws-kicker">Hold</div>
            <ul style={{ paddingLeft: 18, fontWeight: 300, lineHeight: 1.7 }}>
              {current.hold.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="ws-files">
        {MONTHS.map((name, i) => {
          const s = sprayForMonth(i);
          const on = name === now.month;
          return (
            <div className="ws-file" key={name} style={on ? { borderColor: "#b3955c" } : undefined}>
              <div className="ws-kicker">{on ? "Now" : ""}</div>
              <div className="name">{name}</div>
              <p className="ws-lede" style={{ margin: "4px 0 10px" }}>{s.label}</p>
              <div className="ws-curtain"><span style={{ width: `${s.curtain}%` }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
