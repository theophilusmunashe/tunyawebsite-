export const FOLDERS = [
  "Itineraries",
  "Contracts",
  "Permits & licences",
  "Guest documents",
  "Visa packs",
  "Supplier rates",
  "Finance",
  "Marketing",
  "Guide notes",
  "General"
];

export const PRIORITIES = [
  { id: "mist", label: "Low", hint: "When you can" },
  { id: "spray", label: "Medium", hint: "This week" },
  { id: "thunder", label: "High", hint: "Today" }
];

export const TASK_STATUS = [
  { id: "open", label: "Open" },
  { id: "on-it", label: "In progress" },
  { id: "done", label: "Done" }
];

export const JOURNEY_STAGES = [
  { id: "enquiry", label: "Enquiry" },
  { id: "quoted", label: "Quoted" },
  { id: "confirmed", label: "Confirmed" },
  { id: "in-country", label: "On trip" },
  { id: "complete", label: "Complete" }
];

export const RATE_CARD = [
  { code: "XF-RAFT", group: "Adrenaline", name: "White-water rafting — Batoka Gorge", unit: 130 },
  { code: "XF-BUNG", group: "Adrenaline", name: "Bungee jump — Victoria Falls Bridge", unit: 160 },
  { code: "XF-SWING", group: "Adrenaline", name: "Gorge swing", unit: 140 },
  { code: "XF-ANGELS", group: "From the air", name: "Flight of Angels — helicopter", unit: 165 },
  { code: "XF-MICRO", group: "From the air", name: "Flight of Angels — microlight", unit: 185 },
  { code: "XF-CRUISE", group: "The river", name: "Zambezi sunset cruise", unit: 75 },
  { code: "XF-BOMA", group: "Evening", name: "The Boma Dinner", unit: 70 },
  { code: "XF-GAME", group: "Safari", name: "Game drive — Zambezi National Park", unit: 95 },
  { code: "XF-CHOBE", group: "Safari", name: "Chobe day trip — Botswana", unit: 185 },
  { code: "XF-HWANGE", group: "Safari", name: "Hwange day — elephants in their hundreds", unit: 210 },
  { code: "PK-ADREN", group: "Flagship", name: "Flagship I — The Adrenaline Run", unit: 420 },
  { code: "PK-ANGELS", group: "Flagship", name: "Flagship II — The Angels' View", unit: 380 },
  { code: "PK-WEEKEND", group: "Flagship", name: "Flagship III — The Weekend Escape (pp, 2 nts excl. lodge)", unit: 290 },
  { code: "PK-GRAND", group: "Flagship", name: "Flagship IV — The Grand Signature (pp, excl. lodge)", unit: 890 },
  { code: "PK-CLASSIC", group: "Flagship", name: "Flagship V — The Classic Safari", unit: 340 },
  { code: "PK-FAMILY", group: "Flagship", name: "Flagship VI — The Family Basecamp (pp, excl. lodge)", unit: 310 },
  { code: "ST-LODGE", group: "Stays", name: "Riverside lodge — per room per night (from)", unit: 220 },
  { code: "ST-BOUTIQUE", group: "Stays", name: "Boutique hotel — per room per night (from)", unit: 180 },
  { code: "ST-SUITE", group: "Stays", name: "Safari suite — per room per night (from)", unit: 320 },
  { code: "ST-VILLA", group: "Stays", name: "Family villa — per night (from)", unit: 280 },
  { code: "ST-HONEY", group: "Stays", name: "Honeymoon retreat — per night (from)", unit: 410 },
  { code: "TR-VFA", group: "Transfers", name: "Airport transfer — Victoria Falls (VFA)", unit: 25 },
  { code: "TR-LVI", group: "Transfers", name: "Airport transfer — Livingstone (LVI)", unit: 45 },
  { code: "TR-KAZ", group: "Transfers", name: "Kazungula / Chobe border transfer", unit: 55 },
  { code: "VS-KAZA", group: "Borders", name: "KAZA UniVisa — visa fee (collect at border)", unit: 50 },
  { code: "VS-ASSIST", group: "Borders", name: "Border & immigration assistance", unit: 35 },
  { code: "VS-TIP", group: "Borders", name: "ZIMRA TIP handling for self-drive", unit: 40 },
  { code: "HS-GUIDE", group: "House", name: "Private guide — full day", unit: 120 },
  { code: "HS-MEET", group: "House", name: "Meet & greet at the Falls", unit: 20 }
];

export const BORDER_CHECKS = [
  { id: "passport", label: "Passport valid 6 months beyond arrival" },
  { id: "pages", label: "Enough blank pages (3 per country)" },
  { id: "visa", label: "Visa category confirmed for this nationality" },
  { id: "kaza", label: "KAZA UniVisa — needed / issued / not required" },
  { id: "cash", label: "Clean USD cash briefed" },
  { id: "return", label: "Return ticket / proof of funds" },
  { id: "lodge", label: "Lodge address in hand for arrival form" },
  { id: "yellow", label: "Yellow fever — if arriving from a risk country" },
  { id: "tip", label: "ZIMRA TIP — if self-driving into Zimbabwe" },
  { id: "child", label: "Unabridged birth certificate — if travelling with minors" }
];
