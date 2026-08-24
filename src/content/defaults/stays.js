import { TUNYA_URL } from "./site.js";

export const stays = {
  hero: {
    image: "/assets/br-stay-deck.jpg",
    imageAlt: "A lodge deck over the bush",
    kicker: "Where you sleep",
    title: "Wake to the spray. Sleep to the river."
  },
  categories: [
    { title: "Riverside lodges", body: "Thatch, teak decks and the Zambezi sliding past your morning coffee." },
    { title: "Boutique hotels", body: "Colonial bones, modern comfort, a short walk from the rainforest gate." },
    { title: "Safari suites", body: "Canvas and copper on a private concession — game at the waterhole from bed." },
    { title: "Family villas", body: "Self-catering space, a pool for the children, staff who adore them." },
    { title: "Honeymoon retreats", body: "Private plunge pools, dinner on the deck, nobody else in sight." }
  ],
  gallery: [
    { image: "/assets/br-stay-pool.jpg", imageAlt: "", wide: true },
    { image: "/assets/br-stay-room.jpg", imageAlt: "" },
    { image: "/assets/br-stay-suite.jpg", imageAlt: "" },
    { image: "/assets/br-stay-lodge.jpg", imageAlt: "" },
    { image: "/assets/br-stay-chobe.jpg", imageAlt: "" },
    { image: "/assets/br-stay-selfcater.jpg", imageAlt: "", wide: true }
  ],
  closing: {
    title: "Tell Tunya your style — we hold the room before it's gone.",
    cta: { label: "Find My Stay", href: TUNYA_URL }
  }
};
