export function Kicker({ children }) {
  return <div className="ws-kicker">{children}</div>;
}

export function Button({ children, kind = "gold", className = "", ...props }) {
  const extra = kind === "ghost" ? "ghost" : kind === "ink" ? "ink" : kind === "warn" ? "warn" : "";
  return <button type="button" className={`ws-btn ${extra} ${className}`.trim()} {...props}>{children}</button>;
}

export function Field({ label, children }) {
  return (
    <label className="ws-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Empty({ children }) {
  return <div className="ws-empty">{children}</div>;
}

export function Modal({ title, kicker, onClose, children, dark }) {
  return (
    <div className="ws-modal" onClick={onClose} role="presentation">
      <div className={`ws-modal-card${dark ? " dark" : ""}`} onClick={(e) => e.stopPropagation()} role="dialog">
        {kicker && <Kicker>{kicker}</Kicker>}
        {title && <h2 className="ws-serif" style={{ fontSize: 32, margin: "8px 0 16px" }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export function Money({ value, currency = "USD" }) {
  const n = Number(value) || 0;
  return <>{currency} {n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</>;
}

export function CrewName({ id, crew }) {
  const person = (crew || []).find((c) => c.id === id);
  return <>{person?.name || "Unassigned"}</>;
}

export function PriorityMark({ id }) {
  const label = id === "thunder" ? "Thunder" : id === "mist" ? "Mist" : "Spray";
  return <span className={`ws-pri ${id || "spray"}`}>{label}</span>;
}
