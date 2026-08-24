import { TUNYA_URL } from "./site.js";

export const about = {
  hero: {
    image: "/assets/br-promise-crew.jpg",
    imageAlt: "The people behind Tunyafrika",
    kicker: "About Tunyafrika",
    title: "We are the people who live beside the thunder."
  },
  who: {
    kicker: "Who we are",
    title: "A Victoria Falls company, built by Victoria Falls people.",
    paragraphs: [
      "Tunyafrika Xperiences was founded on a simple frustration: the world's most extraordinary waterfall was being sold to visitors by people who had never stood in its spray. We thought the story deserved to be told by the people who grew up in it.",
      "Today we plan, book and personally look after journeys that begin at Mosi-oa-Tunya and reach across the continent — and we built Tunya, Africa's first conversational travel assistant, so that anyone, anywhere, can reach us in a sentence."
    ]
  },
  mandate: {
    kicker: "Our mandate",
    items: [
      { title: "Make it effortless", body: "One conversation should be enough to plan a whole journey — borders, bookings, transfers and tables handled before you land." },
      { title: "Keep it ours", body: "Local guides, local lodges, local suppliers. What our visitors spend should stay in the town that hosts them." },
      { title: "Tell it truthfully", body: "No inflated promises, no hidden extras. If the water is low, we say so — and show you what is spectacular instead." }
    ]
  },
  beliefs: {
    kicker: "What we believe",
    title: "Travel should leave two things better: you, and the place you visited.",
    items: [
      "That a guide's story is worth more than a brochure's adjective.",
      "That technology should remove friction, never remove people.",
      "That hospitality is a Zimbabwean inheritance, not a service standard.",
      "That the wild is a guest we are hosting, not a product we are selling."
    ]
  },
  team: {
    kicker: "The faces behind Tunya",
    title: "The team",
    note: "Portraits are placeholders — send us the real photographs and we'll drop them in.",
    members: [
      { initials: "TM", name: "Theophilus Munashe Maposa", role: "Operations" },
      { initials: "RV", name: "Rudolph Benjamin Volksgyn", role: "Operations" },
      { initials: "DM", name: "Dzikamai Ronald Muchemedzi", role: "Operations" },
      { initials: "TC", name: "Tatenda Blessing Chakwesha", role: "Operations" },
      { initials: "F", name: "Fungai", role: "Operations" }
    ]
  },
  closing: {
    title: "Come and meet us where the spray begins.",
    cta: { label: "Plan My Trip", href: TUNYA_URL }
  }
};
