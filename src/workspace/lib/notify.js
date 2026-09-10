import { totalsOf } from "./printDoc.js";

export const OFFICE_FROM = "operations@tunyafrika.com";

function waDigits(phone = "") {
  return String(phone).replace(/[^\d]/g, "");
}

export function mailtoHref(to, subject, body) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappHref(phone, text) {
  const digits = waDigits(phone);
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function guestMailDraft({ kind, doc, settings, you }) {
  const currency = settings.currency || "USD";
  const t = totalsOf(doc, settings);
  const isQuote = kind === "quote";
  const label = isQuote ? "quotation" : "invoice";
  const from = settings.email || OFFICE_FROM;
  const sender = you?.name || "Tunyafrika Xperiences";
  const subject = `${isQuote ? "Quotation" : "Invoice"} ${doc.ref || ""} — Tunyafrika Xperiences`.trim();
  const message = [
    `Dear ${doc.guestName || "guest"},`,
    ``,
    `Please find ${isQuote ? "your quotation" : "your invoice"} ${doc.ref || ""} attached.`,
    ``,
    doc.journey || null,
    doc.dates || null,
    `Total: ${currency} ${t.total.toFixed(2)}`,
    isQuote
      ? `A ${t.depositPct}% deposit confirms the booking.`
      : `Please use ${doc.ref} as the payment reference.`,
    ``,
    `Warm regards,`,
    sender,
    `Tunyafrika Xperiences`,
    from,
    settings.phone || null
  ].filter((line) => line !== null).join("\n").trim();

  return {
    to: doc.guestEmail || "",
    subject,
    message,
    attach: true,
    label
  };
}

async function postMail(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    const missing = data.ok !== true && !data.error;
    const err = new Error(data.error || (missing
      ? "Email sending is available on the live site. Deploy this update, then send from tunyafrika.com/admin."
      : `Could not send the email (${res.status}).`));
    err.status = missing ? 404 : res.status;
    throw err;
  }
  return data;
}

async function sendEmailJs({ to, toName, subject, message }) {
  const service = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!service || !template || !key) return false;
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: service,
      template_id: template,
      user_id: key,
      template_params: {
        to_email: to,
        to_name: toName || to,
        from_email: OFFICE_FROM,
        subject,
        message
      }
    })
  });
  return res.ok;
}

export async function sendWorkspaceMail({ to, toName, subject, message, pdfBase64, pdfName, key }) {
  const payload = {
    key: key || import.meta.env.VITE_MAIL_KEY || "",
    to,
    toName: toName || "",
    subject,
    message,
    from: OFFICE_FROM,
    pdfName: pdfName || "",
    pdfBase64: pdfBase64 || ""
  };

  const endpoint = import.meta.env.VITE_MAIL_URL || "/api/send-mail.php";
  try {
    await postMail(endpoint, payload);
    return { emailed: true };
  } catch (err) {
    if (err.status && err.status !== 404) throw err;
    const emailed = await sendEmailJs({ to, toName, subject, message });
    if (emailed) return { emailed: true, attached: false };
    throw err.status === 404
      ? new Error("Email sending is available on the live site. Deploy this update, then send from tunyafrika.com/admin.")
      : err;
  }
}
