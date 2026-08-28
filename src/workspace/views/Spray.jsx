import { catParts, sprayForMonth } from "../lib/time.js";
import { Kicker } from "../ui.jsx";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function Spray() {
  const now = catParts();
  const current = sprayForMonth();

  return (
    <div>
      <div className="ws-page-head">
        <div>
          <Kicker>Spray Index</Kicker>
          <h1>Sell the river that is actually there.</h1>
          <p className="ws-lede">Victoria Falls is not one photograph. It is a year of different waters. This index is how the desk stays honest — and how we stop promising Devil's Pool in April or "the smoke that thunders" in November.</p>
        </div>
      </div>

      <div className="ws-panel" style={{ marginBottom: 16 }}>
        <Kicker>{now.month} on the Zambezi</Kicker>
        <h2>{current.label}</h2>
        <p className="ws-lede">{current.river}</p>
        <div className="ws-curtain" style={{ margin: "18px 0 8px", height: 18 }}><span style={{ width: `${current.curtain}%` }} /></div>
        <div className="ws-kicker">Curtain {current.curtain}%</div>
        <div className="ws-grid-2" style={{ marginTop: 22 }}>
          <div>
            <Kicker>Sell this</Kicker>
            <ul style={{ paddingLeft: 18, fontWeight: 300, lineHeight: 1.8 }}>
              {current.sell.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div>
            <Kicker>Do not promise</Kicker>
            <ul style={{ paddingLeft: 18, fontWeight: 300, lineHeight: 1.8 }}>
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
              <Kicker>{on ? "This month" : "The year"}</Kicker>
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
