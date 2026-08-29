import { useMemo, useState } from "react";
import { RATE_CARD } from "../data/catalog.js";
import { uid, nextRef } from "../lib/ids.js";
import { notifyPerson } from "../lib/notify.js";
import { documentHtml, openPrint, totalsOf } from "../lib/printDoc.js";
import { todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Field, Kicker, Money, PageHead } from "../ui.jsx";

function blankDoc(kind, settings) {
  const year = new Date().getFullYear();
  const ref = kind === "quote"
    ? nextRef("TQ", year, settings.quoteCounter || 1)
    : nextRef("TI", year, settings.invoiceCounter || 1);
  return {
    ref,
    status: "draft",
    guestName: "",
    guestEmail: "",
    pax: "",
    dates: "",
    journey: "",
    journeyId: "",
    issued: todayISO(),
    vatPercent: settings.vatPercent || 0,
    depositPercent: settings.depositPercent || 50,
    lines: [{ id: uid("ln"), code: "", description: "", qty: 1, unit: 0 }],
    terms: ""
  };
}

function Letter({ doc, settings }) {
  const t = totalsOf(doc, settings);
  const logo = `${window.location.origin}/assets/logo-cream.png`;
  const isQuote = (doc.kind || "quote") === "quote" || !!doc.ref?.startsWith("TQ");
  return (
    <div className="ws-letter">
      <div className="ws-letter-mast">
        <div>
          <img src={logo} alt="Tunyafrika" />
          <div className="ws-kicker" style={{ marginTop: 8 }}>Xpectional Xperiences</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="ws-kicker">{isQuote ? "Quotation" : "Invoice"}</div>
          <div className="ws-serif" style={{ fontSize: 32 }}>{doc.ref}</div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>{doc.issued}</div>
        </div>
      </div>
      <div className="ws-letter-body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div className="ws-kicker">From</div>
            <div style={{ marginTop: 6, lineHeight: 1.6 }}>
              {settings.company}<br />{settings.address1}<br />{settings.address2}
            </div>
          </div>
          <div>
            <div className="ws-kicker">{isQuote ? "Prepared for" : "Billed to"}</div>
            <div style={{ marginTop: 6, lineHeight: 1.6 }}>
              {doc.guestName || "Guest"}<br />{doc.guestEmail}<br />{doc.pax}<br />{doc.dates}
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Description</th><th className="num">Qty</th><th className="num">Unit</th><th className="num">Amount</th></tr>
          </thead>
          <tbody>
            {(doc.lines || []).map((line) => (
              <tr key={line.id}>
                <td>{line.description || "—"}</td>
                <td className="num">{line.qty}</td>
                <td className="num"><Money value={line.unit} currency={settings.currency} /></td>
                <td className="num"><Money value={(line.qty || 1) * (line.unit || 0)} currency={settings.currency} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginLeft: "auto", width: 220, marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Total</span><strong><Money value={t.total} currency={settings.currency} /></strong></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#8a7040" }}><span>Deposit {t.depositPct}%</span><span><Money value={t.deposit} currency={settings.currency} /></span></div>
        </div>
      </div>
    </div>
  );
}

export default function Ledger() {
  const { quotes, invoices, journeys, settings, upsert, updateSettings, remove, toast } = useWorkspace();
  const [tab, setTab] = useState("quotes");
  const [doc, setDoc] = useState(null);

  const list = tab === "quotes" ? quotes : invoices;
  const kind = tab === "quotes" ? "quote" : "invoice";

  const groupedCard = useMemo(() => {
    const groups = {};
    for (const item of RATE_CARD) {
      (groups[item.group] ||= []).push(item);
    }
    return groups;
  }, []);

  const startNew = () => setDoc({ ...blankDoc(kind, settings), _kind: kind });

  const addRate = (item) => {
    setDoc((d) => ({
      ...d,
      lines: [...(d.lines || []), { id: uid("ln"), code: item.code, description: item.name, qty: 1, unit: item.unit }]
    }));
  };

  const save = async () => {
    const collection = doc._kind === "invoice" || doc.ref?.startsWith("TI") ? "invoices" : "quotes";
    const isNew = !doc.id;
    await upsert(collection, { ...doc });
    if (isNew) {
      if (collection === "quotes") await updateSettings({ quoteCounter: (settings.quoteCounter || 1) + 1 });
      else await updateSettings({ invoiceCounter: (settings.invoiceCounter || 1) + 1 });
    }
    toast(`${doc.ref} saved.`);
    setDoc(null);
  };

  const print = (row, as) => {
    const html = documentHtml({
      kind: as,
      doc: row,
      settings,
      logo: `${window.location.origin}/assets/logo-cream.png`
    });
    if (!openPrint(html)) toast("Allow pop-ups to print.");
  };

  const convert = async (quote) => {
    const invoice = {
      ...quote,
      id: undefined,
      ref: nextRef("TI", new Date().getFullYear(), settings.invoiceCounter || 1),
      status: "issued",
      issued: todayISO(),
      quoteRef: quote.ref
    };
    await upsert("invoices", invoice);
    await upsert("quotes", { ...quote, status: "invoiced" });
    await updateSettings({ invoiceCounter: (settings.invoiceCounter || 1) + 1 });
    toast(`${invoice.ref} raised from ${quote.ref}.`);
    setTab("invoices");
  };

  const mailGuest = async (row) => {
    if (!row.guestEmail) {
      toast("Add a guest email first.");
      return;
    }
    const t = totalsOf(row, settings);
    const isQuote = row.ref?.startsWith("TQ");
    const subject = `${isQuote ? "Quotation" : "Invoice"} ${row.ref} — Tunyafrika Xperiences`;
    const body = [
      `Dear ${row.guestName || "guest"},`,
      ``,
      `Please find ${isQuote ? "your quotation" : "your invoice"} ${row.ref}.`,
      ``,
      row.journey || "",
      row.dates || "",
      `Total: ${settings.currency || "USD"} ${t.total.toFixed(2)}`,
      isQuote ? `A ${t.depositPct}% deposit confirms the booking.` : `Please use ${row.ref} as payment reference.`,
      ``,
      settings.email,
      settings.phone,
      `Tunyafrika Xperiences`
    ].join("\n");
    const result = await notifyPerson({ to: row.guestEmail, toName: row.guestName, subject, body });
    if (result.emailed) toast(`Mailed ${row.ref} to ${row.guestEmail}.`);
    else window.location.href = result.mailto;
  };

  const patchLine = (id, patch) => {
    setDoc((d) => ({ ...d, lines: d.lines.map((line) => line.id === id ? { ...line, ...patch } : line) }));
  };

  return (
    <div>
      <PageHead
        title="Finance"
        action={<Button onClick={startNew}>{tab === "quotes" ? "New quote" : "New invoice"}</Button>}
      />

      <div className="ws-folders">
        <button type="button" className={tab === "quotes" ? "is-on" : ""} onClick={() => { setTab("quotes"); setDoc(null); }}>Quotations</button>
        <button type="button" className={tab === "invoices" ? "is-on" : ""} onClick={() => { setTab("invoices"); setDoc(null); }}>Invoices</button>
      </div>

      {!doc && list.length === 0 && <Empty>No {tab} yet.</Empty>}

      {!doc && list.length > 0 && (
        <table className="ws-table">
          <thead>
            <tr><th>Ref</th><th>Guest</th><th>Package</th><th>Total</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((row) => {
              const t = totalsOf(row, settings);
              return (
                <tr key={row.id}>
                  <td>{row.ref}</td>
                  <td>{row.guestName}<div style={{ color: "#e8dcc4", fontWeight: 400 }}>{row.guestEmail}</div></td>
                  <td>{row.journey || row.dates}</td>
                  <td><Money value={t.total} currency={settings.currency} /></td>
                  <td>{row.status}</td>
                  <td>
                    <div className="ws-actions" style={{ marginTop: 0 }}>
                      <Button kind="ghost" className="slim" onClick={() => setDoc({ ...row, _kind: kind })}>Open</Button>
                      <Button kind="ghost" className="slim" onClick={() => print(row, kind)}>Print</Button>
                      <Button kind="ghost" className="slim" onClick={() => mailGuest(row)}>Mail</Button>
                      {kind === "quote" && row.status !== "invoiced" && <Button className="slim" onClick={() => convert(row)}>To invoice</Button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {doc && (
        <div className="ws-grid-2 ws-paper-field">
          <div className="ws-panel paper">
            <Kicker>{doc._kind === "invoice" || doc.ref?.startsWith("TI") ? "Invoice" : "Quotation"} {doc.ref}</Kicker>
            <h2 style={{ color: "#0d2b1e" }}>{doc.ref}</h2>
            <Field label="Guest">
              <input value={doc.guestName} onChange={(e) => setDoc({ ...doc, guestName: e.target.value })} />
            </Field>
            <Field label="Email">
              <input value={doc.guestEmail} onChange={(e) => setDoc({ ...doc, guestEmail: e.target.value })} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Guests">
                <input value={doc.pax} onChange={(e) => setDoc({ ...doc, pax: e.target.value })} />
              </Field>
              <Field label="Dates">
                <input value={doc.dates} onChange={(e) => setDoc({ ...doc, dates: e.target.value })} />
              </Field>
            </div>
            <Field label="Package">
              <input value={doc.journey} onChange={(e) => setDoc({ ...doc, journey: e.target.value })} />
            </Field>
            <Field label="Link booking">
              <select value={doc.journeyId || ""} onChange={(e) => {
                const j = journeys.find((x) => x.id === e.target.value);
                setDoc({
                  ...doc,
                  journeyId: e.target.value,
                  guestName: j?.guestName || doc.guestName,
                  guestEmail: j?.guestEmail || doc.guestEmail,
                  pax: j?.pax || doc.pax,
                  dates: j?.dates || doc.dates,
                  journey: j ? `${j.product}` : doc.journey
                });
              }}>
                <option value="">None</option>
                {journeys.map((j) => <option key={j.id} value={j.id}>{j.guestName} — {j.product}</option>)}
              </select>
            </Field>
            <Kicker>Line items</Kicker>
            {(doc.lines || []).map((line) => (
              <div key={line.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 70px 100px 28px", gap: 8, marginTop: 8, alignItems: "end" }}>
                <Field label="Description">
                  <input value={line.description} onChange={(e) => patchLine(line.id, { description: e.target.value })} />
                </Field>
                <Field label="Qty">
                  <input type="number" min="1" value={line.qty} onChange={(e) => patchLine(line.id, { qty: Number(e.target.value) })} />
                </Field>
                <Field label="Unit USD">
                  <input type="number" min="0" value={line.unit} onChange={(e) => patchLine(line.id, { unit: Number(e.target.value) })} />
                </Field>
                <button type="button" className="ws-btn warn slim" onClick={() => setDoc({ ...doc, lines: doc.lines.filter((l) => l.id !== line.id) })}>×</button>
              </div>
            ))}
            <div className="ws-actions">
              <Button kind="ghost" className="slim" onClick={() => setDoc({ ...doc, lines: [...doc.lines, { id: uid("ln"), code: "", description: "", qty: 1, unit: 0 }] })}>Add line</Button>
            </div>
            <Field label="Deposit %">
              <input type="number" value={doc.depositPercent} onChange={(e) => setDoc({ ...doc, depositPercent: Number(e.target.value) })} />
            </Field>
            <Field label="Terms">
              <textarea value={doc.terms} onChange={(e) => setDoc({ ...doc, terms: e.target.value })} />
            </Field>
            <div className="ws-actions">
              <Button onClick={save}>Save</Button>
              <Button kind="ghost" onClick={() => print(doc, doc._kind || kind)}>Print</Button>
              <Button kind="ghost" onClick={() => setDoc(null)}>Close</Button>
              {doc.id && <Button kind="warn" onClick={() => { remove(kind === "quote" ? "quotes" : "invoices", doc.id); setDoc(null); }}>Remove</Button>}
            </div>
          </div>
          <div>
            <div className="ws-panel" style={{ marginBottom: 12 }}>
              <Kicker>Rates</Kicker>
              {Object.entries(groupedCard).map(([group, items]) => (
                <div key={group} style={{ marginTop: 12 }}>
                  <div className="ws-kicker">{group}</div>
                  {items.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => addRate(item)}
                      style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 8, background: "none", border: 0, borderBottom: "1px solid rgba(179,149,92,0.18)", color: "inherit", padding: "8px 0", cursor: "pointer", textAlign: "left" }}
                    >
                      <span>{item.name}</span>
                      <span style={{ color: "#b3955c", whiteSpace: "nowrap" }}>{item.unit}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <Letter doc={doc} settings={settings} />
          </div>
        </div>
      )}
    </div>
  );
}
