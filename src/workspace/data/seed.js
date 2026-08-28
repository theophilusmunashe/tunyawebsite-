import { filePut, kvGet, kvSet } from "../lib/db.js";
import { uid } from "../lib/ids.js";
import { todayISO } from "../lib/time.js";

export const DEFAULT_SETTINGS = {
  company: "Tunyafrika Xperiences",
  tagline: "Xpectional Xperiences",
  address1: "619 Ngugwuma Road",
  address2: "Victoria Falls, Zimbabwe",
  email: "enquiries@tunyafrika.com",
  phone: "+263 78 266 9251",
  web: "www.tunyafrika.com",
  bankName: "",
  bankAccount: "",
  bankBranch: "",
  quoteDays: 14,
  depositPercent: 50,
  vatPercent: 0,
  currency: "USD",
  quoteCounter: 2,
  invoiceCounter: 1,
  chalkboard: "Sell the spray this week — the rainforest is at full voice. Devil's Pool stays off the page until the river falls."
};

export const DEFAULT_CREW = [
  { id: "crew_tm", initials: "TM", name: "Theophilus Munashe Maposa", role: "Guest relations", email: "theophilus@tunyafrika.com", phone: "", seat: "The deck" },
  { id: "crew_rv", initials: "RV", name: "Rudolph Benjamin Volksgyn", role: "Field operations", email: "rudolph@tunyafrika.com", phone: "", seat: "The river" },
  { id: "crew_dm", initials: "DM", name: "Dzikamai Ronald Muchemedzi", role: "Accounts & ledger", email: "dzikamai@tunyafrika.com", phone: "", seat: "The books" },
  { id: "crew_tc", initials: "TC", name: "Tatenda Blessing Chakwesha", role: "Bookings & stays", email: "tatenda@tunyafrika.com", phone: "", seat: "The rooms" },
  { id: "crew_f", initials: "F", name: "Fungai", role: "Border desk & visas", email: "fungai@tunyafrika.com", phone: "", seat: "The bridge" }
];

function daysFromToday(n) {
  const [y, m, d] = todayISO().split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

let seedLock = null;

export async function seedIfEmpty() {
  if (!seedLock) {
    seedLock = writeSeed().catch((err) => {
      seedLock = null;
      throw err;
    });
  }
  return seedLock;
}

async function writeSeed() {
  if (await kvGet("seeded")) return;

  const moyo = uid("jn");
  const anika = uid("jn");
  const samir = uid("jn");
  const quoteAnika = uid("tq");

  await kvSet("settings", DEFAULT_SETTINGS);
  await kvSet("crew", DEFAULT_CREW);

  await kvSet("journeys", [
    {
      id: moyo,
      guestName: "The Moyo family",
      guestEmail: "nomsa.moyo@email.com",
      pax: "Two adults, one child",
      nationality: "Zimbabwe",
      product: "The Weekend Escape",
      dates: `${daysFromToday(2)} → ${daysFromToday(4)}`,
      arrive: daysFromToday(2),
      depart: daysFromToday(4),
      stage: "confirmed",
      value: 1450,
      assignedTo: "crew_tc",
      notes: "Anniversary add-on: private deck dinner on Saturday. Child is eight — no gorge swing.",
      days: [
        { title: "Arrive VFA · lodge check-in · sunset cruise", notes: "Flight UM 731, 11:40. Rudolph on the pickup." },
        { title: "Rainforest morning · Flight of Angels · The Boma", notes: "Boma table for 19:30, name Moyo." },
        { title: "Slow Sunday · transfer out", notes: "14:10 flight. Late checkout arranged." }
      ]
    },
    {
      id: anika,
      guestName: "Anika & João Silva",
      guestEmail: "anika.silva@email.com",
      pax: "Two adults",
      nationality: "Portugal",
      product: "The Grand Signature",
      dates: `${daysFromToday(18)} → ${daysFromToday(25)}`,
      arrive: daysFromToday(18),
      depart: daysFromToday(25),
      stage: "quoted",
      value: 6420,
      assignedTo: "crew_tm",
      notes: "Honeymoon. She is uneasy with heights — no bungee. They want both sides of the Falls and a night that feels like nowhere else.",
      days: [
        { title: "Victoria Falls · rainforest · sunset cruise", notes: "" },
        { title: "Chobe day — riverfront and boat", notes: "KAZA UniVisa required." },
        { title: "Suite above the river · Boma Dinner", notes: "" }
      ]
    },
    {
      id: samir,
      guestName: "Samir Patel",
      guestEmail: "samir.patel@email.com",
      pax: "One adult",
      nationality: "India",
      product: "The Adrenaline Run",
      dates: "Dates TBA",
      arrive: "",
      depart: "",
      stage: "enquiry",
      value: 0,
      assignedTo: "crew_rv",
      notes: "Solo. Asked about rafting in September and a night at a riverside lodge.",
      days: []
    }
  ]);

  await kvSet("quotes", [
    {
      id: quoteAnika,
      ref: "TQ-2026-0001",
      status: "sent",
      journeyId: anika,
      guestName: "Anika & João Silva",
      guestEmail: "anika.silva@email.com",
      pax: "Two adults",
      dates: `${daysFromToday(18)} → ${daysFromToday(25)}`,
      journey: "The Grand Signature · Victoria Falls & Chobe",
      issued: todayISO(),
      vatPercent: 0,
      depositPercent: 50,
      lines: [
        { id: uid("ln"), code: "PK-GRAND", description: "Flagship IV — The Grand Signature (per person, excl. lodge)", qty: 2, unit: 890 },
        { id: uid("ln"), code: "ST-HONEY", description: "Honeymoon retreat — 4 nights", qty: 4, unit: 410 },
        { id: uid("ln"), code: "ST-LODGE", description: "Riverside lodge, Chobe side — 2 nights", qty: 2, unit: 260 },
        { id: uid("ln"), code: "VS-ASSIST", description: "KAZA UniVisa & border assistance", qty: 2, unit: 35 }
      ],
      terms: ""
    }
  ]);

  await kvSet("invoices", []);

  await kvSet("tasks", [
    {
      id: uid("tk"),
      title: "Hold the Boma table for the Moyo family — Saturday 19:30",
      notes: "Party of three, child eight. Ask for a quieter seat away from the drums if they look overwhelmed.",
      priority: "thunder",
      status: "open",
      due: daysFromToday(0),
      assignedTo: "crew_tc",
      journeyId: moyo
    },
    {
      id: uid("tk"),
      title: "Build the KAZA pack for Anika & João",
      notes: "Portuguese passports. Confirm UniVisa eligibility and which side they enter first.",
      priority: "spray",
      status: "on-it",
      due: daysFromToday(2),
      assignedTo: "crew_f",
      journeyId: anika
    },
    {
      id: uid("tk"),
      title: "Driver briefing — Friday VFA pickup, UM 731 11:40",
      notes: "Name board: MOYO. Child seat not required. Lodge: riverside.",
      priority: "mist",
      status: "open",
      due: daysFromToday(1),
      assignedTo: "crew_rv",
      journeyId: moyo
    }
  ]);

  await kvSet("movements", [
    {
      id: uid("mv"),
      whenDate: daysFromToday(2),
      whenTime: "11:40",
      kind: "Airport pickup",
      detail: "VFA · UM 731 · Moyo family x3",
      assignedTo: "crew_rv",
      journeyId: moyo
    },
    {
      id: uid("mv"),
      whenDate: daysFromToday(2),
      whenTime: "16:30",
      kind: "Activity",
      detail: "Sunset cruise — Moyo family",
      assignedTo: "crew_tm",
      journeyId: moyo
    },
    {
      id: uid("mv"),
      whenDate: daysFromToday(3),
      whenTime: "19:30",
      kind: "Evening",
      detail: "The Boma Dinner — table for three, Moyo",
      assignedTo: "crew_tc",
      journeyId: moyo
    }
  ]);

  await kvSet("visaCases", [
    {
      id: uid("vs"),
      journeyId: anika,
      guestName: "Anika & João Silva",
      nationality: "Portugal",
      kaza: "needed",
      notes: "Enter Zimbabwe first. Day trip to Chobe only — no overnight in Botswana.",
      checks: { passport: true, pages: true, visa: true, kaza: false, cash: false, return: true, lodge: false, yellow: true, tip: true, child: true }
    },
    {
      id: uid("vs"),
      journeyId: moyo,
      guestName: "The Moyo family",
      nationality: "Zimbabwe",
      kaza: "not-required",
      notes: "Domestic. Child travelling with both parents.",
      checks: { passport: true, pages: true, visa: true, kaza: true, cash: true, return: true, lodge: true, yellow: true, tip: true, child: true }
    },
    {
      id: uid("vs"),
      journeyId: samir,
      guestName: "Samir Patel",
      nationality: "India",
      kaza: "check",
      notes: "Confirm current VOA / UniVisa eligibility before quoting the Zambia side.",
      checks: { passport: false, pages: false, visa: false, kaza: false, cash: false, return: false, lodge: false, yellow: false, tip: true, child: true }
    }
  ]);

  await kvSet("briefs", []);
  await kvSet("notices", []);

  const welcome = new Blob(
    [`THE VAULT — Tunyafrika Basecamp

This is the house cupboard. Contracts, itineraries, permits, guest documents and supplier rates live here so anyone at the desk can find them.

How we keep it useful
• Name files as Guest_Product_Date (e.g. Silva_GrandSignature_2026-09).
• Guest passports and IDs go in Guest documents, never in Marketing.
• Permits and operator licences go in Permits & licences with the expiry in the filename.
• A workspace pack (Settings → Export) is how another machine receives the same cupboard.

The river is loud. The paperwork should be quiet.
`],
    { type: "text/plain" }
  );

  await filePut({
    id: uid("file"),
    name: "How we keep the Vault.txt",
    mime: "text/plain",
    size: welcome.size,
    folder: "House",
    uploadedBy: "Basecamp",
    uploadedAt: Date.now(),
    blob: welcome
  });

  await kvSet("seeded", true);
}
