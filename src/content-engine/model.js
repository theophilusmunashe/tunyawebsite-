export const ITEM_STATUSES = [
  { id: "pending", label: "Pending review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "posted", label: "Posted" }
];

export function blankManualItem() {
  return {
    id: "",
    headline: "",
    summary: "",
    sourceName: "",
    sourceUrl: "",
    status: "pending"
  };
}

export function formatWhen(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "—";
  }
}
