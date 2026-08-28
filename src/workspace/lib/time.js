export const CAT = "Africa/Harare";

export function formatCat(date = new Date(), options = {}) {
  return new Date(date).toLocaleString("en-GB", { timeZone: CAT, ...options });
}

export function todayISO(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CAT,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(date));
}

export function catParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CAT,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    monthNumeric: undefined
  }).formatToParts(new Date(date));
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  return {
    weekday: get("weekday"),
    day: get("day"),
    month: get("month"),
    year: get("year"),
    hour: get("hour"),
    minute: get("minute")
  };
}

export function greeting(date = new Date()) {
  const hour = Number(catParts(date).hour);
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function monthIndex(date = new Date()) {
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone: CAT, month: "numeric" }).format(new Date(date))) - 1;
}

export function prettyDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return iso;
  const dt = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function prettyWhen(ts) {
  if (!ts) return "";
  return formatCat(ts, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}

export function sprayForMonth(index = monthIndex()) {
  if (index >= 2 && index <= 4) {
    return {
      key: "high",
      label: "High water",
      curtain: 94,
      river: "The Zambezi is in full voice. The gorge is a curtain.",
      sell: ["Rainforest walks", "Flight of Angels", "Sunset cruise", "The Boma Dinner"],
      hold: ["Devil's Pool", "White-water rafting (often closed Feb–Mar)", "Livingstone Island"]
    };
  }
  if (index === 5 || index === 6) {
    return {
      key: "falling",
      label: "Falling water",
      curtain: 70,
      river: "The spray thins. Views open. Rafting typically returns in July.",
      sell: ["The rainforest with a view", "Game drives", "Chobe day trips", "Gorge swing"],
      hold: ["Devil's Pool (usually still closed)", "Assuming every rapid is running"]
    };
  }
  if (index >= 7 && index <= 11) {
    return {
      key: "low",
      label: "Low water",
      curtain: 32,
      river: "The rock face shows. Devil's Pool opens. Rafting is at its most technical.",
      sell: ["Devil's Pool", "White-water rafting", "Bungee & gorge swing", "The Angels' View"],
      hold: ["Promising 'the smoke that thunders' at full curtain"]
    };
  }
  return {
    key: "rising",
    label: "Rising water",
    curtain: 58,
    river: "The rains have come. Levels change week to week — check before you promise.",
    sell: ["The Boma Dinner", "Sunset cruise", "Boutique stays", "Flexible itineraries"],
    hold: ["Locking Devil's Pool or rafting without a weather check"]
  };
}
