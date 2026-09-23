const ENDPOINT = "/api/book-request.php";

export async function sendBookRequest({ email, packageName, name = "" }) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, packageName, name, website: "" })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    throw new Error(data.error || "Could not send the booking request.");
  }
  return data;
}
