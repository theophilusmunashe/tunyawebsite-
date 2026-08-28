import { esc } from "./ids.js";
import { prettyDate } from "./time.js";

function money(n, currency = "USD") {
  const value = Number(n) || 0;
  return `${currency} ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function lineRows(lines, currency) {
  return (lines || []).map((line) => `
    <tr>
      <td>${esc(line.description)}<div class="muted">${esc(line.code || "")}</div></td>
      <td class="num">${esc(String(line.qty || 1))}</td>
      <td class="num">${money(line.unit, currency)}</td>
      <td class="num">${money((line.qty || 1) * (line.unit || 0), currency)}</td>
    </tr>
  `).join("");
}

export function documentHtml({ kind, doc, settings, logo }) {
  const currency = settings.currency || "USD";
  const isQuote = kind === "quote";
  const title = isQuote ? "Quotation" : "Tax Invoice";
  const subtotal = (doc.lines || []).reduce((sum, line) => sum + (line.qty || 1) * (line.unit || 0), 0);
  const vatPct = Number(doc.vatPercent ?? settings.vatPercent) || 0;
  const vat = subtotal * (vatPct / 100);
  const total = subtotal + vat;
  const depositPct = Number(doc.depositPercent ?? settings.depositPercent) || 0;
  const deposit = total * (depositPct / 100);
  const terms = doc.terms || (isQuote
    ? `This quotation is valid for ${settings.quoteDays || 14} days. A ${depositPct}% deposit confirms the journey. Balances are due 21 days before arrival, or on confirmation for travel inside that window.`
    : `Payment is due as shown. Please use the invoice number as reference. Tunyafrika Xperiences thanks you for travelling with the people who live beside the thunder.`);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(title)} ${esc(doc.ref || "")}</title>
  <style>
    @page { margin: 16mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Poppins, "Segoe UI", sans-serif; color: #0d2b1e; background: #fff; }
    .sheet { max-width: 820px; margin: 0 auto; }
    .mast { background: #04301f; color: #faf3e8; padding: 28px 32px; display: flex; justify-content: space-between; gap: 24px; align-items: center; }
    .mast img { height: 52px; }
    .kicker { font-size: 10px; letter-spacing: 0.42em; text-transform: uppercase; color: #b3955c; }
    h1 { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500; font-size: 42px; margin: 6px 0 0; }
    .meta { text-align: right; font-size: 13px; line-height: 1.7; }
    .body { padding: 28px 32px 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px; }
    .label { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #b3955c; }
    .block { margin-top: 6px; font-size: 14px; line-height: 1.65; font-weight: 300; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #b3955c; border-bottom: 1px solid #b3955c; padding: 8px 0; }
    td { padding: 12px 0; border-bottom: 1px solid rgba(13,43,30,0.12); font-size: 14px; vertical-align: top; }
    .num { text-align: right; white-space: nowrap; }
    .muted { color: rgba(13,43,30,0.5); font-size: 11px; margin-top: 3px; }
    .totals { width: 280px; margin: 18px 0 0 auto; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .grand { border-top: 1px solid #b3955c; margin-top: 8px; padding-top: 10px; font-weight: 600; }
    .terms { margin-top: 36px; font-size: 12px; font-weight: 300; line-height: 1.7; color: rgba(13,43,30,0.75); }
    .foot { margin-top: 28px; padding: 18px 32px 28px; border-top: 1px solid rgba(179,149,92,0.5); font-size: 12px; color: rgba(13,43,30,0.7); display: flex; justify-content: space-between; gap: 16px; }
    .gold { color: #b3955c; }
    @media print { body { background: #fff; } .noprint { display: none !important; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="mast">
      <div>
        ${logo ? `<img src="${esc(logo)}" alt="Tunyafrika" />` : `<div class="kicker">Tunyafrika Xperiences</div>`}
        <div class="kicker" style="margin-top:10px">Xpectional Xperiences</div>
      </div>
      <div class="meta">
        <div class="kicker">${esc(title)}</div>
        <h1>${esc(doc.ref || "")}</h1>
        <div>${esc(prettyDate(doc.issued || doc.createdAt))}</div>
      </div>
    </div>
    <div class="body">
      <div class="grid">
        <div>
          <div class="label">From the desk of</div>
          <div class="block">
            ${esc(settings.company || "Tunyafrika Xperiences")}<br />
            ${esc(settings.address1 || "")}<br />
            ${esc(settings.address2 || "")}<br />
            ${esc(settings.email || "")}<br />
            ${esc(settings.phone || "")}
          </div>
        </div>
        <div>
          <div class="label">${isQuote ? "Prepared for" : "Billed to"}</div>
          <div class="block">
            ${esc(doc.guestName || "Guest")}<br />
            ${esc(doc.guestEmail || "")}<br />
            ${doc.pax ? `${esc(doc.pax)} travelling` : ""}<br />
            ${doc.dates ? esc(doc.dates) : ""}<br />
            ${doc.journey ? esc(doc.journey) : ""}
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="num">Qty</th>
            <th class="num">Unit</th>
            <th class="num">Amount</th>
          </tr>
        </thead>
        <tbody>${lineRows(doc.lines, currency)}</tbody>
      </table>
      <div class="totals">
        <div><span>Subtotal</span><span>${money(subtotal, currency)}</span></div>
        ${vatPct ? `<div><span>VAT ${vatPct}%</span><span>${money(vat, currency)}</span></div>` : ""}
        <div class="grand"><span>Total</span><span>${money(total, currency)}</span></div>
        ${isQuote || depositPct ? `<div><span>Deposit ${depositPct}%</span><span>${money(deposit, currency)}</span></div>` : ""}
      </div>
      ${settings.bankName ? `<div class="terms"><span class="label">Bank</span><div class="block">${esc(settings.bankName)} · ${esc(settings.bankAccount || "")} · ${esc(settings.bankBranch || "")}</div></div>` : ""}
      <div class="terms"><span class="label">Terms</span><div class="block">${esc(terms)}</div></div>
    </div>
    <div class="foot">
      <div>${esc(settings.web || "www.tunyafrika.com")} · ${esc(settings.email || "enquiries@tunyafrika.com")}</div>
      <div class="gold">Where the earth roars — and we do not stop there.</div>
    </div>
  </div>
</body>
</html>`;
}

export function openPrint(html) {
  const frame = window.open("", "_blank", "noopener,width=900,height=1200");
  if (!frame) return false;
  frame.document.write(html);
  frame.document.close();
  const done = () => {
    try { frame.focus(); frame.print(); } catch { /* ignore */ }
  };
  setTimeout(done, 350);
  return true;
}

export function totalsOf(doc, settings) {
  const subtotal = (doc.lines || []).reduce((sum, line) => sum + (line.qty || 1) * (line.unit || 0), 0);
  const vatPct = Number(doc.vatPercent ?? settings.vatPercent) || 0;
  const vat = subtotal * (vatPct / 100);
  const total = subtotal + vat;
  const depositPct = Number(doc.depositPercent ?? settings.depositPercent) || 0;
  return { subtotal, vatPct, vat, total, depositPct, deposit: total * (depositPct / 100) };
}
