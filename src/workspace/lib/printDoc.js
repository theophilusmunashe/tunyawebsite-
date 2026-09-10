import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { esc } from "./ids.js";
import { prettyDate } from "./time.js";

const FONT_HREF = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Poppins:wght@400;600&display=swap";

const OFFICE_EMAIL = "operations@tunyafrika.com";

const SHEET_CSS = `
.sheet {
  width: 794px;
  background: #fff;
  font-family: Poppins, "Segoe UI", sans-serif;
  color: #000;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.sheet * { box-sizing: border-box; }
.sheet .mast { background: #04301f; color: #faf3e8; padding: 28px 32px; display: flex; justify-content: space-between; gap: 24px; align-items: center; }
.sheet .mast img { height: 52px; }
.sheet .kicker { font-size: 10px; letter-spacing: 0.42em; text-transform: uppercase; color: #b3955c; }
.sheet h1 { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500; font-size: 42px; margin: 6px 0 0; color: #faf3e8; }
.sheet .meta { text-align: right; font-size: 13px; line-height: 1.7; color: #faf3e8; }
.sheet .body { padding: 28px 32px 12px; color: #000; }
.sheet .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px; }
.sheet .label { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #000; font-weight: 600; }
.sheet .block { margin-top: 6px; font-size: 14px; line-height: 1.65; font-weight: 400; color: #000; }
.sheet table { width: 100%; border-collapse: collapse; }
.sheet th { text-align: left; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #000; font-weight: 600; border-bottom: 1px solid #000; padding: 8px 0; }
.sheet td { padding: 12px 0; border-bottom: 1px solid #000; font-size: 14px; vertical-align: top; color: #000; font-weight: 400; }
.sheet .num { text-align: right; white-space: nowrap; }
.sheet .muted { color: #000; font-size: 12px; margin-top: 3px; font-weight: 400; }
.sheet .totals { width: 280px; margin: 18px 0 0 auto; color: #000; }
.sheet .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #000; font-weight: 400; }
.sheet .grand { border-top: 1px solid #000; margin-top: 8px; padding-top: 10px; font-weight: 600; color: #000; }
.sheet .terms { margin-top: 36px; font-size: 13px; font-weight: 400; line-height: 1.7; color: #000; }
.sheet .foot { margin-top: 28px; padding: 18px 32px 28px; border-top: 1px solid #000; font-size: 13px; color: #000; font-weight: 400; display: flex; justify-content: space-between; gap: 16px; }
.sheet .gold { color: #000; font-weight: 400; }
`;

function logoSrc(logo) {
  return String(logo).startsWith("data:") ? logo : esc(logo);
}

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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="${FONT_HREF}" rel="stylesheet" />
  <style>
    @page { margin: 0; }
    html, body { margin: 0; padding: 0; background: #fff; }
    ${SHEET_CSS}
    @media print { body { background: #fff; } .noprint { display: none !important; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="mast">
      <div>
        ${logo ? `<img src="${logoSrc(logo)}" alt="Tunyafrika" />` : `<div class="kicker">Tunyafrika Xperiences</div>`}
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
          <div class="label">From</div>
          <div class="block">
            ${esc(settings.company || "Tunyafrika Xperiences")}<br />
            ${esc(settings.address1 || "")}<br />
            ${esc(settings.address2 || "")}<br />
            ${esc(settings.email || OFFICE_EMAIL)}<br />
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
      <div>${esc(settings.web || "www.tunyafrika.com")} · ${esc(settings.email || OFFICE_EMAIL)}</div>
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForAssets(doc) {
  const links = [...(doc.querySelectorAll?.('link[rel="stylesheet"]') || [])];
  await Promise.all(links.map((link) => (
    link.sheet
      ? Promise.resolve()
      : new Promise((resolve) => {
        link.onload = () => resolve();
        link.onerror = () => resolve();
      })
  )));
  const imgs = [...(doc.images || [])];
  await Promise.all(imgs.map((img) => (
    img.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      })
  )));
  if (doc.fonts?.load) {
    await Promise.all([
      doc.fonts.load("400 14px Poppins"),
      doc.fonts.load("600 14px Poppins"),
      doc.fonts.load('500 42px "Cormorant Garamond"')
    ]).catch(() => {});
  }
  if (doc.fonts?.ready) await doc.fonts.ready;
  await wait(280);
}

export async function logoDataUrl() {
  const src = `${window.location.origin}/assets/logo-cream.png`;
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function canvasHasInk(canvas) {
  const ctx = canvas.getContext("2d");
  const sample = ctx.getImageData(0, 0, Math.min(canvas.width, 160), Math.min(canvas.height, 80)).data;
  for (let i = 0; i < sample.length; i += 4) {
    if (sample[i] < 248 || sample[i + 1] < 248 || sample[i + 2] < 248) return true;
  }
  return false;
}

function loadIframe(html) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = "position:fixed;left:0;top:0;width:794px;height:1123px;opacity:0.01;pointer-events:none;border:0;background:#fff;z-index:0;";
  document.body.appendChild(iframe);
  iframe.srcdoc = html;
  return iframe;
}

async function buildPdf({ kind, doc, settings }) {
  const logo = await logoDataUrl().catch(() => `${window.location.origin}/assets/logo-cream.png`);
  const html = documentHtml({ kind, doc, settings, logo });
  const iframe = loadIframe(html);
  try {
    await new Promise((resolve) => {
      if (iframe.contentDocument?.readyState === "complete" && iframe.contentDocument.querySelector(".sheet")) resolve();
      else iframe.onload = () => resolve();
      setTimeout(resolve, 400);
    });
    const idoc = iframe.contentDocument;
    await waitForAssets(idoc);
    const target = idoc.querySelector(".sheet");
    if (!target) throw new Error("Could not render the document.");
    iframe.style.height = `${Math.max(target.scrollHeight, 1123)}px`;
    await wait(80);
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 794,
      windowWidth: 794,
      height: target.scrollHeight,
      windowHeight: target.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });
    if (!canvasHasInk(canvas)) throw new Error("Could not create the PDF.");
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let y = 0;
    let left = imgH;
    pdf.addImage(imgData, "PNG", 0, y, imgW, imgH, undefined, "FAST");
    left -= pageH;
    while (left > 1.5) {
      y -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, y, imgW, imgH, undefined, "FAST");
      left -= pageH;
    }
    return pdf;
  } finally {
    iframe.remove();
  }
}

export async function downloadPdf({ kind, doc, settings, filename }) {
  const pdf = await buildPdf({ kind, doc, settings });
  pdf.save(filename || `${doc.ref || "document"}.pdf`);
  return true;
}

export async function pdfForMail({ kind, doc, settings, filename }) {
  const pdf = await buildPdf({ kind, doc, settings });
  const name = filename || `${doc.ref || "document"}.pdf`;
  const dataUri = pdf.output("datauristring");
  const base64 = String(dataUri).split(",")[1] || "";
  if (!base64) throw new Error("Could not create the PDF.");
  return { filename: name, base64 };
}

export function totalsOf(doc, settings) {
  const subtotal = (doc.lines || []).reduce((sum, line) => sum + (line.qty || 1) * (line.unit || 0), 0);
  const vatPct = Number(doc.vatPercent ?? settings.vatPercent) || 0;
  const vat = subtotal * (vatPct / 100);
  const total = subtotal + vat;
  const depositPct = Number(doc.depositPercent ?? settings.depositPercent) || 0;
  return { subtotal, vatPct, vat, total, depositPct, deposit: total * (depositPct / 100) };
}
