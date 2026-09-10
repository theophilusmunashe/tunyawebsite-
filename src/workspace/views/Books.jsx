import { useMemo, useState } from "react";
import { CASH_CATEGORIES, DIRECTORS, LOAN_KINDS } from "../data/seed.js";
import { cashBookHtml, cashTotals, directorBalance, directorOf, kindLabel, loanAccountsHtml, loanBalances, withDirectorRunning, withRunningBalance } from "../lib/booksDoc.js";
import { downloadHtmlPdf, logoDataUrl } from "../lib/printDoc.js";
import { prettyDate, todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Field, Modal, Money } from "../ui.jsx";

function blankCash(you) {
  return {
    date: todayISO(),
    description: "",
    ref: "",
    category: "Operating",
    moneyIn: "",
    moneyOut: "",
    notes: "",
    recordedBy: you?.id || ""
  };
}

function blankLoan(you) {
  return {
    date: todayISO(),
    directorId: DIRECTORS[0].id,
    kind: "asset",
    assetName: "",
    place: "",
    amount: "",
    notes: "",
    recordedBy: you?.id || ""
  };
}

function num(value) {
  if (value === "" || value == null) return 0;
  return Number(value) || 0;
}

export default function Books({ tab }) {
  const { cashbook, loans, settings, upsert, remove, toast, you } = useWorkspace();
  const [form, setForm] = useState(null);
  const [director, setDirector] = useState("all");
  const [busyPdf, setBusyPdf] = useState(false);

  const cashRows = useMemo(() => withRunningBalance(cashbook || []).reverse(), [cashbook]);
  const cashSum = useMemo(() => cashTotals(cashbook || []), [cashbook]);
  const cashClose = cashRows[0]?.balance || 0;

  const loanRows = useMemo(
    () => withDirectorRunning(loans || []).filter((row) => director === "all" || row.directorId === director).reverse(),
    [loans, director]
  );
  const loanSum = useMemo(() => loanBalances(loans || []), [loans]);

  const saveCash = async () => {
    const inn = num(form.moneyIn);
    const out = num(form.moneyOut);
    if (!form.description?.trim()) {
      toast("Add what the money was for.");
      return;
    }
    if (!inn && !out) {
      toast("Enter money in or money out.");
      return;
    }
    await upsert("cashbook", {
      id: form.id,
      date: form.date,
      description: String(form.description || "").trim(),
      ref: String(form.ref || "").trim(),
      category: form.category || "Operating",
      moneyIn: inn,
      moneyOut: out,
      notes: String(form.notes || "").trim(),
      recordedBy: form.recordedBy || you?.id || "",
      createdAt: form.createdAt
    });
    toast("Cash book updated.");
    setForm(null);
  };

  const saveLoan = async () => {
    const amount = num(form.amount);
    if (!form.directorId) {
      toast("Choose which director.");
      return;
    }
    if (!amount) {
      toast("Enter the amount.");
      return;
    }
    if (form.kind === "asset" && !form.assetName?.trim()) {
      toast("Name the asset that was bought.");
      return;
    }
    await upsert("loans", {
      id: form.id,
      date: form.date,
      directorId: form.directorId,
      kind: form.kind,
      assetName: form.kind === "asset" ? String(form.assetName || "").trim() : "",
      place: String(form.place || "").trim(),
      amount,
      notes: String(form.notes || "").trim(),
      recordedBy: form.recordedBy || you?.id || "",
      createdAt: form.createdAt
    });
    toast("Loan account updated.");
    setForm(null);
  };

  const download = async () => {
    setBusyPdf(true);
    try {
      const logo = await logoDataUrl().catch(() => `${window.location.origin}/assets/logo-cream.png`);
      const stamp = todayISO();
      if (tab === "cash") {
        await downloadHtmlPdf(cashBookHtml({ rows: cashbook, settings, logo }), `Tunyafrika-cash-book-${stamp}.pdf`);
      } else {
        const directorId = director === "all" ? "" : director;
        const who = directorId ? directorOf(directorId).short.toLowerCase() : "all";
        await downloadHtmlPdf(
          loanAccountsHtml({ rows: loans, settings, logo, directorId }),
          `Tunyafrika-loan-accounts-${who}-${stamp}.pdf`
        );
      }
      toast("PDF downloaded.");
    } catch (err) {
      toast(err.message || "Could not create the PDF.");
    } finally {
      setBusyPdf(false);
    }
  };

  if (tab === "cash") {
    return (
      <div>
        <p className="ws-books-note">Accountant cash book — money in, money out, and the running balance. Export the full list as a PDF whenever you need a record.</p>
        <div className="ws-stats three money">
          <div className="ws-stat"><div className="ws-kicker">Money in</div><b><Money value={cashSum.in} currency={settings.currency} digits={2} /></b></div>
          <div className="ws-stat"><div className="ws-kicker">Money out</div><b><Money value={cashSum.out} currency={settings.currency} digits={2} /></b></div>
          <div className="ws-stat"><div className="ws-kicker">Balance</div><b><Money value={cashClose} currency={settings.currency} digits={2} /></b></div>
        </div>
        <div className="ws-actions" style={{ marginBottom: 16 }}>
          <Button onClick={() => setForm(blankCash(you))}>New entry</Button>
          <Button kind="ghost" disabled={busyPdf} onClick={download}>{busyPdf ? "Preparing…" : "Download PDF"}</Button>
        </div>
        {cashRows.length === 0 && <Empty>No cash movements yet.</Empty>}
        {cashRows.length > 0 && (
          <div className="ws-table-wrap">
            <table className="ws-table ws-doc-table">
              <thead>
                <tr><th>Date</th><th>Details</th><th>Ref</th><th>In</th><th>Out</th><th>Balance</th><th></th></tr>
              </thead>
              <tbody>
                {cashRows.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Date">{prettyDate(row.date)}</td>
                    <td data-label="Details">{row.description}<div className="ws-table-sub">{[row.category, row.notes].filter(Boolean).join(" · ")}</div></td>
                    <td data-label="Ref">{row.ref || "—"}</td>
                    <td data-label="In" className={row.moneyIn ? "ws-money-in" : ""}>{row.moneyIn ? <Money value={row.moneyIn} currency={settings.currency} digits={2} /> : "—"}</td>
                    <td data-label="Out" className={row.moneyOut ? "ws-money-out" : ""}>{row.moneyOut ? <Money value={row.moneyOut} currency={settings.currency} digits={2} /> : "—"}</td>
                    <td data-label="Balance"><Money value={row.balance} currency={settings.currency} digits={2} /></td>
                    <td>
                      <div className="ws-actions" style={{ marginTop: 0 }}>
                        <Button kind="ghost" className="slim" onClick={() => setForm({
                          ...row,
                          moneyIn: row.moneyIn || "",
                          moneyOut: row.moneyOut || "",
                          balance: undefined
                        })}>Open</Button>
                        <Button kind="warn" className="slim" onClick={() => { remove("cashbook", row.id); toast("Entry removed."); }}>Remove</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {form && tab === "cash" && (
          <Modal title={form.id ? "Cash book entry" : "New cash book entry"} onClose={() => setForm(null)}>
            <Field label="Date">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Details">
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What the money was for" />
            </Field>
            <div className="ws-split">
              <Field label="Reference">
                <input value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} placeholder="Receipt, transfer, cheque" />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CASH_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div className="ws-split">
              <Field label="Money in">
                <input type="number" min="0" step="0.01" value={form.moneyIn} onChange={(e) => setForm({ ...form, moneyIn: e.target.value, moneyOut: e.target.value ? "" : form.moneyOut })} />
              </Field>
              <Field label="Money out">
                <input type="number" min="0" step="0.01" value={form.moneyOut} onChange={(e) => setForm({ ...form, moneyOut: e.target.value, moneyIn: e.target.value ? "" : form.moneyIn })} />
              </Field>
            </div>
            <Field label="Notes">
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
            <div className="ws-actions">
              <Button onClick={saveCash}>Save</Button>
              <Button kind="ghost" onClick={() => setForm(null)}>Cancel</Button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="ws-books-note">Loan accounts for Theo, Dzika and Rudolph. Record assets bought for the apartments — what it was, who bought it, and the amount — plus cash they advanced and any repayments.</p>
      <div className="ws-stats money">
        {loanSum.byDirector.map((d) => (
          <div className="ws-stat" key={d.id}>
            <div className="ws-kicker">{d.short}</div>
            <b><Money value={d.balance} currency={settings.currency} digits={2} /></b>
            <div className="ws-table-sub">{d.name}</div>
          </div>
        ))}
        <div className="ws-stat">
          <div className="ws-kicker">Company owes</div>
          <b><Money value={loanSum.total} currency={settings.currency} digits={2} /></b>
        </div>
      </div>
      <div className="ws-folders">
        <button type="button" className={director === "all" ? "is-on" : ""} onClick={() => setDirector("all")}>All</button>
        {DIRECTORS.map((d) => (
          <button type="button" key={d.id} className={director === d.id ? "is-on" : ""} onClick={() => setDirector(d.id)}>
            {d.short} · <Money value={directorBalance(loans, d.id)} currency={settings.currency} digits={2} />
          </button>
        ))}
      </div>
      <div className="ws-actions" style={{ marginBottom: 16 }}>
        <Button onClick={() => setForm(blankLoan(you))}>New entry</Button>
        <Button kind="ghost" disabled={busyPdf} onClick={download}>{busyPdf ? "Preparing…" : "Download PDF"}</Button>
      </div>
      {loanRows.length === 0 && <Empty>No loan or asset entries yet{director === "all" ? "." : ` for ${directorOf(director).short}.`}</Empty>}
      {loanRows.length > 0 && (
        <div className="ws-table-wrap">
          <table className="ws-table ws-doc-table">
            <thead>
              <tr><th>Date</th><th>Director</th><th>Type</th><th>Asset / place</th><th>Amount</th><th>Balance</th><th></th></tr>
            </thead>
            <tbody>
              {loanRows.map((row) => (
                <tr key={row.id}>
                  <td data-label="Date">{prettyDate(row.date)}</td>
                  <td data-label="Director">{directorOf(row.directorId).short}<div className="ws-table-sub">{directorOf(row.directorId).name}</div></td>
                  <td data-label="Type">{kindLabel(row.kind)}</td>
                  <td data-label="Asset / place">
                    {row.kind === "asset" ? (row.assetName || "—") : "—"}
                    <div className="ws-table-sub">{[row.place, row.notes].filter(Boolean).join(" · ")}</div>
                  </td>
                  <td data-label="Amount"><Money value={row.amount} currency={settings.currency} digits={2} /></td>
                  <td data-label="Balance"><Money value={row.balance} currency={settings.currency} digits={2} /></td>
                  <td>
                    <div className="ws-actions" style={{ marginTop: 0 }}>
                        <Button kind="ghost" className="slim" onClick={() => setForm({
                          ...row,
                          amount: row.amount ?? "",
                          balance: undefined
                        })}>Open</Button>
                      <Button kind="warn" className="slim" onClick={() => { remove("loans", row.id); toast("Entry removed."); }}>Remove</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form && tab === "loans" && (
        <Modal title={form.id ? "Loan account entry" : "New loan account entry"} onClose={() => setForm(null)}>
          <Field label="Date">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <div className="ws-split">
            <Field label="Director">
              <select value={form.directorId} onChange={(e) => setForm({ ...form, directorId: e.target.value })}>
                {DIRECTORS.map((d) => <option key={d.id} value={d.id}>{d.short} — {d.name}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                {LOAN_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </Field>
          </div>
          {form.kind === "asset" && (
            <>
              <Field label="What was bought">
                <input value={form.assetName} onChange={(e) => setForm({ ...form, assetName: e.target.value })} placeholder="e.g. Queen bed, dining table, fridge" />
              </Field>
              <Field label="Apartment / place">
                <input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="Which apartment or property" />
              </Field>
            </>
          )}
          <Field label="Amount">
            <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </Field>
          <Field label="Notes">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div className="ws-actions">
            <Button onClick={saveLoan}>Save</Button>
            <Button kind="ghost" onClick={() => setForm(null)}>Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
