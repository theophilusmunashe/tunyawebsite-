import { useEffect, useMemo, useRef, useState } from "react";
import { RATE_CARD } from "../data/catalog.js";
import { uid, nextRef } from "../lib/ids.js";
import { guestMailDraft, OFFICE_FROM, sendWorkspaceMail } from "../lib/notify.js";
import { documentHtml, downloadPdf, openPrint, pdfForMail, totalsOf } from "../lib/printDoc.js";
import { todayISO } from "../lib/time.js";
import { useWorkspace, workspaceKey } from "../store.jsx";
import { Button, Empty, Field, Kicker, Modal, Money, PageHead } from "../ui.jsx";

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
  const wrapRef = useRef(null);
  const frameRef = useRef(null);
  const kind = doc._kind === "invoice" || doc.ref?.startsWith("TI") ? "invoice" : "quote";
  const html = documentHtml({
    kind,
    doc,
    settings,
    logo: `${window.location.origin}/assets/logo-cream.png`
  });
  const fit = () => {
    const frame = frameRef.current;
    const wrap = wrapRef.current;
    if (!frame || !wrap) return;
    const sheet = frame.contentDocument?.querySelector(".sheet");
    const height = sheet?.scrollHeight || 1123;
    const scale = wrap.clientWidth / 794;
    frame.style.height = `${height}px`;
    wrap.style.setProperty("--letter-scale", String(scale));
    wrap.style.height = `${Math.ceil(height * scale)}px`;
  };
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => fit());
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [html]);
  return (
    <div className="ws-letter-wrap" ref={wrapRef}>
      <iframe
        ref={frameRef}
        title="Document preview"
        className="ws-letter-frame"
        srcDoc={html}
        onLoad={fit}
      />
    </div>
  );
}

export default function Ledger() {
  const { quotes, invoices, journeys, settings, upsert, updateSettings, remove, toast, you } = useWorkspace();
  const [tab, setTab] = useState("quotes");
  const [doc, setDoc] = useState(null);
  const [busyPdf, setBusyPdf] = useState(false);
  const [mail, setMail] = useState(null);
  const [busyMail, setBusyMail] = useState(false);
  const [mailError, setMailError] = useState("");

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

  const download = async (row, as) => {
    setBusyPdf(true);
    try {
      await downloadPdf({
        kind: as,
        doc: row,
        settings,
        filename: `${row.ref || as}.pdf`
      });
      toast(`${row.ref} downloaded.`);
    } catch (err) {
      toast(err.message || "Could not create the PDF.");
    } finally {
      setBusyPdf(false);
    }
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

  const openMail = (row, as) => {
    if (!row.guestEmail) {
      toast("Add a guest email first.");
      return;
    }
    const draft = guestMailDraft({ kind: as, doc: row, settings, you });
    setMailError("");
    setMail({ row, kind: as, ...draft });
  };

  const sendMail = async () => {
    if (!mail) return;
    const to = (mail.to || "").trim();
    if (!to) {
      setMailError("Add a guest email first.");
      return;
    }
    if (!(mail.subject || "").trim() || !(mail.message || "").trim()) {
      setMailError("Add a subject and a message.");
      return;
    }
    setBusyMail(true);
    setMailError("");
    try {
      let pdfBase64 = "";
      let pdfName = "";
      if (mail.attach) {
        const pdf = await pdfForMail({
          kind: mail.kind,
          doc: mail.row,
          settings,
          filename: `${mail.row.ref || mail.kind}.pdf`
        });
        pdfBase64 = pdf.base64;
        pdfName = pdf.filename;
      }
      await sendWorkspaceMail({
        to,
        toName: mail.row.guestName,
        subject: mail.subject.trim(),
        message: mail.message.trim(),
        pdfBase64,
        pdfName,
        key: workspaceKey()
      });
      const collection = mail.kind === "invoice" ? "invoices" : "quotes";
      if (mail.row.id) {
        await upsert(collection, { ...mail.row, guestEmail: to, status: "sent" });
      }
      if (doc && doc.id === mail.row.id) setDoc({ ...doc, guestEmail: to, status: "sent" });
      toast(`${mail.row.ref} sent to ${to}.`);
      setMail(null);
    } catch (err) {
      setMailError(err.message || "Could not send the email.");
    } finally {
      setBusyMail(false);
    }
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
        <div className="ws-table-wrap">
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
                      <Button kind="ghost" className="slim" disabled={busyPdf} onClick={() => download(row, kind)}>PDF</Button>
                      <Button kind="ghost" className="slim" onClick={() => print(row, kind)}>Print</Button>
                      <Button kind="ghost" className="slim" disabled={busyPdf || busyMail} onClick={() => openMail(row, kind)}>Mail</Button>
                      {kind === "quote" && row.status !== "invoiced" && <Button className="slim" onClick={() => convert(row)}>To invoice</Button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
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
            <div className="ws-split">
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
              <div key={line.id} className="ws-line-row">
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
              <Button kind="ghost" disabled={busyPdf} onClick={() => download(doc, doc._kind || kind)}>{busyPdf ? "Preparing…" : "Download PDF"}</Button>
              <Button kind="ghost" disabled={busyPdf || busyMail} onClick={() => openMail(doc, doc._kind || kind)}>Mail</Button>
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

      {mail && (
        <Modal title={`Send ${mail.label}`} onClose={() => { if (!busyMail) setMail(null); }}>
          <p className="ws-lede" style={{ marginTop: 0 }}>From {OFFICE_FROM}. The guest stays in this window.</p>
          <Field label="To">
            <input type="email" value={mail.to} onChange={(e) => setMail({ ...mail, to: e.target.value })} />
          </Field>
          <Field label="Subject">
            <input value={mail.subject} onChange={(e) => setMail({ ...mail, subject: e.target.value })} />
          </Field>
          <Field label="Message">
            <textarea
              className="ws-mail-body"
              value={mail.message}
              onChange={(e) => setMail({ ...mail, message: e.target.value })}
            />
          </Field>
          <label className="ws-mail-attach">
            <input
              type="checkbox"
              checked={mail.attach}
              onChange={(e) => setMail({ ...mail, attach: e.target.checked })}
            />
            Attach {mail.row.ref || mail.label} PDF
          </label>
          {mailError && <p className="ws-mail-error">{mailError}</p>}
          <div className="ws-actions">
            <Button disabled={busyMail} onClick={sendMail}>{busyMail ? "Sending…" : "Send"}</Button>
            <Button kind="ghost" disabled={busyMail} onClick={() => setMail(null)}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
