import { DIRECTORS, LOAN_KINDS } from "../data/seed.js";
import { esc } from "./ids.js";
import { wrapSheet } from "./printDoc.js";
import { prettyDate } from "./time.js";

export function moneyText(n, currency = "USD") {
  const value = Number(n) || 0;
  return `${currency} ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function directorOf(id) {
  return DIRECTORS.find((d) => d.id === id) || { id, short: "—", name: "Unknown" };
}

export function kindLabel(id) {
  return LOAN_KINDS.find((k) => k.id === id)?.label || id || "—";
}

export function sortByDate(rows) {
  return [...(rows || [])].sort((a, b) => {
    const d = String(a.date || "").localeCompare(String(b.date || ""));
    if (d) return d;
    return (a.createdAt || 0) - (b.createdAt || 0);
  });
}

export function withRunningBalance(rows) {
  let balance = 0;
  return sortByDate(rows).map((row) => {
    const inn = Number(row.moneyIn) || 0;
    const out = Number(row.moneyOut) || 0;
    balance += inn - out;
    return { ...row, balance };
  });
}

export function cashTotals(rows) {
  return (rows || []).reduce((acc, row) => {
    acc.in += Number(row.moneyIn) || 0;
    acc.out += Number(row.moneyOut) || 0;
    return acc;
  }, { in: 0, out: 0 });
}

export function signedLoan(row) {
  const amount = Number(row.amount) || 0;
  return row.kind === "repay" ? -amount : amount;
}

export function directorBalance(rows, directorId) {
  return (rows || [])
    .filter((row) => row.directorId === directorId)
    .reduce((sum, row) => sum + signedLoan(row), 0);
}

export function loanBalances(rows) {
  const byDirector = DIRECTORS.map((d) => ({
    ...d,
    balance: directorBalance(rows, d.id)
  }));
  return {
    byDirector,
    total: byDirector.reduce((sum, d) => sum + d.balance, 0)
  };
}

export function withDirectorRunning(rows) {
  const running = Object.fromEntries(DIRECTORS.map((d) => [d.id, 0]));
  return sortByDate(rows).map((row) => {
    running[row.directorId] = (running[row.directorId] || 0) + signedLoan(row);
    return { ...row, balance: running[row.directorId] };
  });
}

function dash(value) {
  return value ? esc(value) : "—";
}

export function cashBookHtml({ rows, settings, logo }) {
  const currency = settings.currency || "USD";
  const lined = withRunningBalance(rows);
  const totals = cashTotals(rows);
  const closing = lined.length ? lined[lined.length - 1].balance : 0;
  const body = `
    <p class="lede">Accountant cash book. Every amount received and paid, with a running balance. This is a company record, not a tax invoice.</p>
    <div class="sum">
      <div><span class="label">Money in</span><strong>${esc(moneyText(totals.in, currency))}</strong></div>
      <div><span class="label">Money out</span><strong>${esc(moneyText(totals.out, currency))}</strong></div>
      <div><span class="label">Closing balance</span><strong>${esc(moneyText(closing, currency))}</strong></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Details</th>
          <th>Ref</th>
          <th class="num">In</th>
          <th class="num">Out</th>
          <th class="num">Balance</th>
        </tr>
      </thead>
      <tbody>
        ${lined.length ? lined.map((row) => `
          <tr>
            <td>${esc(prettyDate(row.date))}</td>
            <td>${esc(row.description || "—")}${row.category ? `<div class="muted">${esc(row.category)}</div>` : ""}${row.notes ? `<div class="muted">${esc(row.notes)}</div>` : ""}</td>
            <td>${dash(row.ref)}</td>
            <td class="num">${row.moneyIn ? esc(moneyText(row.moneyIn, currency)) : "—"}</td>
            <td class="num">${row.moneyOut ? esc(moneyText(row.moneyOut, currency)) : "—"}</td>
            <td class="num">${esc(moneyText(row.balance, currency))}</td>
          </tr>
        `).join("") : `<tr><td colspan="6">No cash movements recorded.</td></tr>`}
      </tbody>
    </table>
  `;
  return wrapSheet({
    title: "Cash book",
    kicker: "Company records",
    settings,
    logo,
    body,
    dense: true
  });
}

function loanRowHtml(row, currency) {
  const director = directorOf(row.directorId);
  const details = [
    row.kind === "asset" ? (row.assetName || "Asset") : kindLabel(row.kind),
    row.place,
    row.notes
  ].filter(Boolean);
  return `
    <tr>
      <td>${esc(prettyDate(row.date))}</td>
      <td>${esc(director.short)}<div class="muted">${esc(director.name)}</div></td>
      <td>${esc(kindLabel(row.kind))}${details.length ? `<div class="muted">${esc(details.join(" · "))}</div>` : ""}</td>
      <td class="num">${esc(moneyText(row.amount, currency))}</td>
      <td class="num">${esc(moneyText(row.balance, currency))}</td>
    </tr>
  `;
}

export function loanAccountsHtml({ rows, settings, logo, directorId }) {
  const currency = settings.currency || "USD";
  const scoped = directorId ? (rows || []).filter((row) => row.directorId === directorId) : (rows || []);
  const assets = sortByDate(scoped.filter((row) => row.kind === "asset"));
  const balances = loanBalances(directorId ? scoped : rows);
  const directors = directorId ? DIRECTORS.filter((d) => d.id === directorId) : DIRECTORS;
  const title = directorId ? `${directorOf(directorId).short} — loan account` : "Loan accounts";

  const body = `
    <p class="lede">Director loan accounts. Assets bought for the company (furniture and fittings for the apartments) and cash advanced by Theo, Dzika and Rudolph. The balance is what the company owes that director. Repayments reduce it.</p>
    <div class="sum${directorId ? "" : " four"}">
      ${(directorId ? balances.byDirector.filter((d) => d.id === directorId) : balances.byDirector).map((d) => `
        <div><span class="label">${esc(d.short)}</span><strong>${esc(moneyText(d.balance, currency))}</strong><div class="muted">${esc(d.name)}</div></div>
      `).join("")}
      ${directorId ? "" : `<div><span class="label">Company owes</span><strong>${esc(moneyText(balances.total, currency))}</strong><div class="muted">All three directors</div></div>`}
    </div>

    <h2>Assets bought</h2>
    <p class="lede">What was bought, who bought it, and the amount. These sit on that director’s loan account until repaid.</p>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Asset</th>
          <th>Place</th>
          <th>Bought by</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${assets.length ? assets.map((row) => `
          <tr>
            <td>${esc(prettyDate(row.date))}</td>
            <td>${esc(row.assetName || "—")}${row.notes ? `<div class="muted">${esc(row.notes)}</div>` : ""}</td>
            <td>${dash(row.place)}</td>
            <td>${esc(directorOf(row.directorId).short)}<div class="muted">${esc(directorOf(row.directorId).name)}</div></td>
            <td class="num">${esc(moneyText(row.amount, currency))}</td>
          </tr>
        `).join("") : `<tr><td colspan="5">No assets recorded yet.</td></tr>`}
      </tbody>
    </table>

    ${directors.map((d) => {
      const lined = withDirectorRunning(scoped).filter((row) => row.directorId === d.id);
      return `
        <h2>${esc(d.short)} — ${esc(d.name)}</h2>
        <p class="lede">Closing balance ${esc(moneyText(directorBalance(scoped, d.id), currency))}.</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Director</th>
              <th>Details</th>
              <th class="num">Amount</th>
              <th class="num">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${lined.length ? lined.map((row) => loanRowHtml(row, currency)).join("") : `<tr><td colspan="5">No entries on this account.</td></tr>`}
          </tbody>
        </table>
      `;
    }).join("")}
  `;

  return wrapSheet({
    title,
    kicker: "Company records",
    settings,
    logo,
    body,
    dense: true
  });
}
