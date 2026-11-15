import { TUNYA_URL } from "./site.js";

export const about = {
  hero: {
    image: "/assets/br-promise-crew.jpg",
    imageAlt: "The people behind Tunyafrika",
    kicker: "About Tunyafrika",
    title: "We live in Victoria Falls. We run every trip."
  },
  who: {
    kicker: "Who we are",
    title: "A Victoria Falls company, run by Victoria Falls people.",
    paragraphs: [
      "We started Tunyafrika Xperiences out of frustration. The world's most famous waterfall was being sold to visitors by people who had never stood in its spray. We grew up here, and we thought you should hear about it from us.",
      "Today Theo, Rudolph and Dzika plan, book and personally look after your Victoria Falls tours, activities and stays, plus trips on into Botswana, Zambia, Namibia and South Africa. We also built Ask Tunya, a trip-planning assistant, so you can reach us any time. Whatever you ask it, one of us follows up."
    ],
    photos: [
      { image: "/assets/about-dzika-arrivals.jpg", imageAlt: "Meeting guests at Victoria Falls International Airport", position: "center 35%" },
      { image: "/assets/about-crew-walk.jpg", imageAlt: "Tunyafrika on the ground in Victoria Falls", position: "center 78%" },
      { image: "/assets/about-dzika-walk.jpg", imageAlt: "Dzika in Victoria Falls", position: "center 40%" }
    ]
  },
  mandate: {
    kicker: "What you can expect",
    items: [
      { title: "Easy planning", body: "One conversation should be enough. We sort out borders, bookings, transfers and dinner tables before you land." },
      { title: "Local, all the way", body: "Local guides, local lodges, local suppliers. The money you spend stays in the town that hosts you." },
      { title: "Straight answers", body: "No inflated promises and no hidden extras. If the water is low, we tell you, and we show you what's worth seeing instead." }
    ]
  },
  beliefs: {
    kicker: "What we believe",
    title: "Good travel leaves two things better: you, and the place you visit.",
    items: [
      "A guide's story is worth more than a brochure's adjectives.",
      "Technology should make travel easier, never replace the people.",
      "Hospitality is something Zimbabweans grow up with, not a service standard.",
      "The wild is a guest we host, not a product we sell."
    ]
  },
  team: {
    kicker: "The people you'll deal with",
    title: "Meet the team",
    note: "Say hello any time on WhatsApp: +263 78 266 9251. One of us will answer.",
    members: [
      { initials: "TM", name: "Theophilus Munashe Maposa", role: "Operations" },
      { initials: "RV", name: "Rudolph Benjamin Volkwyn", role: "Operations" },
      { initials: "DM", name: "Dzikamai Ronald Muchemedzi", role: "Operations" }
    ]
  },
  closing: {
    title: "Come and meet us where the spray begins.",
    cta: { label: "Plan My Trip", href: TUNYA_URL }
  }
};
