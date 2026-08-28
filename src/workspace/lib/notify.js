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

export function taskMessage(task, assignee, actor) {
  const due = task.due ? `Due ${task.due}` : "No due date";
  return [
    `Dispatch from the Tunyafrika Basecamp`,
    ``,
    `${actor?.name || "A colleague"} assigned you a task.`,
    ``,
    `Task: ${task.title}`,
    `Priority: ${task.priority || "Spray"}`,
    due,
    task.notes ? `Notes: ${task.notes}` : null,
    ``,
    `Open the desk: https://www.tunyafrika.com/admin`,
    ``,
    `— Tunyafrika Xperiences`
  ].filter((line) => line !== null).join("\n");
}

async function sendEmailJs({ to, toName, subject, body }) {
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
        subject,
        message: body
      }
    })
  });
  return res.ok;
}

async function sendFormSubmit({ to, subject, body }) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: subject,
      _template: "box",
      name: "Tunyafrika Workspace",
      message: body
    })
  });
  return res.ok;
}

export async function notifyPerson({ to, toName, phone, subject, body }) {
  const result = {
    emailed: false,
    mailto: to ? mailtoHref(to, subject, body) : "",
    whatsapp: phone ? whatsappHref(phone, body) : ""
  };
  if (!to) return result;
  try {
    result.emailed = await sendEmailJs({ to, toName, subject, body });
  } catch {
    result.emailed = false;
  }
  if (!result.emailed) {
    try {
      result.emailed = await sendFormSubmit({ to, subject, body });
    } catch {
      result.emailed = false;
    }
  }
  return result;
}
