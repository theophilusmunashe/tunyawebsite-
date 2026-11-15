import { TUNYA_URL } from "./site.js";

export const stays = {
  hero: {
    image: "/assets/br-stay-deck.jpg",
    imageAlt: "A lodge deck over the bush",
    kicker: "Victoria Falls accommodation",
    title: "Where to stay in Victoria Falls."
  },
  categories: [
    { title: "Riverside lodges", body: "Thatch, teak decks and the Zambezi flowing past while you have your morning coffee." },
    { title: "Boutique hotels", body: "Classic buildings with modern comfort, a short walk from the rainforest entrance." },
    { title: "Safari suites", body: "Tented suites on a private concession. Watch game at the waterhole from your bed." },
    { title: "Family villas", body: "Self-catering space, a pool for the children and staff who love having them." },
    { title: "Honeymoon retreats", body: "Private plunge pools, dinner on your deck and nobody else in sight." }
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
    title: "Tell us your style and budget. We'll find the room and hold it.",
    cta: { label: "Find My Stay", href: TUNYA_URL }
  }
};
