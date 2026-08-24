import { TUNYA_URL } from "./site.js";

export const home = {
  hero: {
    image: "/assets/br-falls-aerial.jpg",
    imageAlt: "Victoria Falls from the air",
    kicker: "Victoria Falls · Zimbabwe",
    titleLead: "Africa is not a trip. It is a ",
    titleAccent: "feeling.",
    body: "We begin where the earth roars — and we do not stop there. Tunyafrika crafts journeys that start at Victoria Falls and unfold across the continent.",
    primaryCta: { label: "Start Planning", href: TUNYA_URL },
    secondaryCta: { label: "See Victoria Falls", page: "falls" }
  },
  way: {
    kicker: "The Tunyafrika Way",
    titleLead: "Born here. ",
    titleAccent: "Very African.",
    paragraphs: [
      "Every Tunyafrika journey is built by people who grew up within earshot of the thunder. We know which guide tells the best stories, which lodge has the quiet deck, which morning the light on the gorge is worth waking for.",
      "You bring the dates. We handle borders, bookings, transfers, tables and the small courtesies that turn a holiday into a memory."
    ],
    stats: [
      { value: "100%", label: "Locally owned and locally guided." },
      { value: "24/7", label: "Tunya answers, day or night." },
      { value: "3", label: "Countries within an hour of your hotel." }
    ]
  },
  days: {
    kicker: "Where it begins",
    title: "Four days that rearrange you.",
    linkLabel: "All Xperiences →",
    linkPage: "xp",
    cards: [
      { kicker: "Day One", title: "Walk into the thunder", image: "/assets/br-explore-rainbow.jpg", imageAlt: "The rainforest trail", page: "falls" },
      { kicker: "Day Two", title: "See it from the sky", image: "/assets/br-explore-flight.jpg", imageAlt: "Flight of Angels", page: "xp" },
      { kicker: "Day Three", title: "Cross into Botswana", image: "/assets/ch-eleph-portrait.jpg", imageAlt: "Chobe elephants", page: "beyond" },
      { kicker: "Day Four", title: "Eat by firelight", image: "/assets/br-boma-drummer.jpg", imageAlt: "The Boma dinner", page: "xp" }
    ]
  },
  tunya: {
    image: "/assets/br-tunya-site.jpg",
    imageAlt: "Tunya, the conversational travel assistant",
    kicker: "Meet Tunya",
    title: "Africa's first conversational travel assistant.",
    body: "Ask a question, book a room, move a transfer, add a bungee at two in the morning. Tunya knows every lodge, every activity, every border rule — and never sleeps.",
    cta: { label: "Talk to Tunya", href: TUNYA_URL }
  },
  beyondTeaser: {
    kicker: "Beyond the Falls",
    title: "The Falls are the door. Africa is the house.",
    cards: [
      { title: "South Africa", image: "/assets/w-capetown.jpg", imageAlt: "South Africa", page: "beyond" },
      { title: "Botswana", image: "/assets/w-lions.jpg", imageAlt: "Botswana", page: "beyond" },
      { title: "Namibia", image: "/assets/w-island.jpg", imageAlt: "Namibia", page: "beyond" }
    ],
    cta: { label: "Explore the Continent", page: "beyond" }
  }
};
