/**
 * Admin session client. The browser never holds a password or API key:
 * sign-in creates an HttpOnly session cookie on the server, and every admin
 * write carries the session's CSRF token in the X-CSRF-Token header.
 */
const AUTH_ENDPOINT = "/api/auth.php";
export const SIGNIN_REQUIRED_EVENT = "tunya:signin-required";

let csrfToken = "";

async function readJson(res) {
  return res.json().catch(() => ({}));
}

/** Returns the signed-in user ({ id, name }) or null. */
export async function adminMe() {
  try {
    const res = await fetch(AUTH_ENDPOINT, { credentials: "same-origin", headers: { Accept: "application/json" } });
    const data = await readJson(res);
    if (!res.ok || data.ok !== true) {
      csrfToken = "";
      return null;
    }
    csrfToken = data.csrf || "";
    return data.user || null;
  } catch {
    return null;
  }
}

export async function adminLogin(user, password, remember) {
  const res = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ action: "login", user, password, remember: Boolean(remember) })
  });
  const data = await readJson(res);
  if (!res.ok || data.ok !== true) {
    throw new Error(data.error || (res.status === 404 ? "Sign-in only works on www.tunyafrika.com/admin." : "Could not sign in."));
  }
  csrfToken = data.csrf || "";
  return data.user;
}

export async function adminLogout() {
  try {
    await adminFetch(AUTH_ENDPOINT, { method: "POST", body: { action: "logout" } });
  } catch {
    /* already signed out */
  }
  csrfToken = "";
}

/**
 * fetch() for admin endpoints: same-origin cookies + CSRF header, JSON body.
 * Fires SIGNIN_REQUIRED_EVENT when the server says the session is gone.
 */
export async function adminFetch(url, { method = "POST", body, headers = {} } = {}) {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...headers
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  if (res.status === 401 || res.status === 403) {
    const peek = await res.clone().json().catch(() => ({}));
    if (peek.signin) {
      csrfToken = "";
      try { window.dispatchEvent(new Event(SIGNIN_REQUIRED_EVENT)); } catch { /* ignore */ }
    }
  }
  return res;
}
