import { TUNYA_URL } from "./site.js";

export const falls = {
  hero: {
    image: "/assets/br-falls-aerial2.jpg",
    imageAlt: "Mosi-oa-Tunya",
    kicker: "Mosi-oa-Tunya · The Smoke That Thunders",
    title: "A mile of falling water, and a sound you feel first."
  },
  intro: {
    paragraphs: [
      "One of the Seven Natural Wonders of the World. 1,708 metres wide, 108 metres tall, and loud enough to hear before you see it. The spray climbs half a kilometre into the sky and can be seen from fifty kilometres away.",
      "You can walk its rainforest in a raincoat, fly over it at dawn, stand on the bridge between two countries, or — in the low-water months — swim on its very lip."
    ],
    seasons: [
      { period: "February – May", note: "Peak flow. Full thunder, full spray." },
      { period: "June – August", note: "Cool, clear. Best for safari and the bridge." },
      { period: "September – December", note: "Low water. Devil's Pool opens." }
    ]
  },
  mosaic: [
    { image: "/assets/br-explore-admire.jpg", imageAlt: "At the edge" },
    { image: "/assets/br-explore-bridge.jpg", imageAlt: "The 1905 bridge" },
    { image: "/assets/br-joy.jpg", imageAlt: "Joy at the falls" }
  ],
  know: {
    kicker: "Know before you go",
    items: [
      { title: "Your passport", body: "Valid six months beyond travel, with two blank pages for the stamps you're about to collect." },
      { title: "The KAZA UniVisa", body: "One visa, two countries — see the Falls from Zimbabwe and Zambia. We confirm eligibility for your passport." },
      { title: "You'll get wet", body: "In high water the rainforest rains upward. Bring a raincoat and a dry bag for your phone." },
      { title: "No fences", body: "Elephants cross the road, warthogs graze the lawns. Your safari begins at the airport." }
    ],
    primaryCta: { label: "Plan My Falls Trip", href: TUNYA_URL },
    secondaryCta: { label: "What To Do Here", page: "xp" }
  }
};
