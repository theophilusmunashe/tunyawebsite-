import { TUNYA_URL } from "./site.js";

export const falls = {
  hero: {
    image: "/assets/br-falls-aerial2.jpg",
    imageAlt: "Mosi-oa-Tunya",
    kicker: "Mosi-oa-Tunya · The Smoke That Thunders",
    title: "Victoria Falls: a mile of water you hear first."
  },
  intro: {
    paragraphs: [
      "Victoria Falls is one of the Seven Natural Wonders of the World: 1,708 metres wide and 108 metres tall. You hear it before you see it. The spray rises half a kilometre into the sky and can be seen from fifty kilometres away.",
      "There are four ways to see it. Walk the rainforest trail in a raincoat. Fly over it at dawn. Stand on the bridge between Zimbabwe and Zambia. Or, in the low-water months, swim right at its edge."
    ],
    seasons: [
      { period: "February – May", note: "Peak flow. The loudest water and the most spray." },
      { period: "June – August", note: "Cool and clear. Best for safari and the bridge." },
      { period: "September – December", note: "Low water. Devil's Pool opens for swimming." }
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
      { title: "Your passport", body: "It must be valid for six months beyond your trip, with two blank pages for your entry stamps." },
      { title: "The KAZA UniVisa", body: "One visa covers Zimbabwe and Zambia, so you can see the Falls from both sides. Tell us your passport and we'll check if you qualify." },
      { title: "You'll get wet", body: "In high water the spray soaks the rainforest trail. Bring a raincoat and a dry bag for your phone." },
      { title: "No fences", body: "Elephants cross the roads and warthogs graze the lawns in town. Your safari starts at the airport." }
    ],
    primaryCta: { label: "Plan My Falls Trip", href: TUNYA_URL },
    secondaryCta: { label: "Things To Do Here", page: "xp" }
  }
};
