export const PROPERTY_TYPES = ["Lodge", "Hotel", "Guesthouse", "Villa", "Self-catering", "Camp", "Apartment"];

export const LISTING_STATUSES = [
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
  { id: "paused", label: "Paused" }
];

export const ENQUIRY_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacting", label: "Contacting guest" },
  { id: "awaiting_provider", label: "Awaiting provider" },
  { id: "replied", label: "Replied" },
  { id: "closed", label: "Closed" }
];

export function blankProvider() {
  return {
    id: "",
    name: "",
    contactName: "",
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
    notes: ""
  };
}

export function blankListing() {
  return {
    id: "",
    providerId: "",
    title: "",
    subtitle: "",
    summary: "",
    propertyType: "Lodge",
    amenities: [],
    pricing: { currency: "USD", amount: 0, unit: "per night", note: "" },
    capacity: { guests: "", rooms: "" },
    images: [],
    coverUrl: "",
    location: { area: "", address: "", mapsNote: "" },
    providerNotes: "",
    availabilityNote: "",
    status: "draft"
  };
}

export function priceLabel(pricing = {}) {
  const currency = pricing.currency || "USD";
  const amount = Number(pricing.amount) || 0;
  const unit = pricing.unit || "per night";
  return `${currency} ${amount.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`;
}

export function amenitiesText(list) {
  return Array.isArray(list) ? list.join("\n") : String(list || "");
}

export function parseAmenities(text) {
  return String(text || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
