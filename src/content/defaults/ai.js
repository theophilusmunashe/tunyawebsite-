import { TUNYA_URL } from "./site.js";

export const ai = {
  hero: {
    kicker: "Meet Tunya",
    title: "The first of its kind on the continent.",
    paragraphs: [
      "Tunya is our conversational travel assistant — built by Tunyafrika so you can plan, book and change an African journey the way you'd talk to a friend who lives there.",
      "Bookings, availability, prices, border rules, pickup times, restaurant tables, last-minute additions. No forms. No waiting for office hours."
    ],
    badge: "www.tunya.africa",
    conversation: [
      { from: "guest", text: "\"Four days in Vic Falls for two — the falls, a safari, and something wild.\"", width: "78%" },
      { from: "tunya", text: "\"Done. Rainforest tour Tuesday, Chobe day trip Wednesday, sunset cruise Thursday, and a 111 m bungee for the brave one. Shall I hold it all?\"", width: "88%" },
      { from: "guest", text: "\"Do we need a visa for Botswana?\"", width: "60%" },
      { from: "tunya", text: "\"Not for your passports — just bring them. Our guide handles the border both ways.\"", width: "84%" }
    ]
  },
  features: [
    { title: "Book instantly", body: "Activities, lodges, transfers and tables — confirmed while you're still chatting." },
    { title: "Ask anything", body: "Weather, water levels, what to pack, whether the children can raft." },
    { title: "Live updates", body: "Pickup times, changes, delays — pushed to you before you have to ask." },
    { title: "Humans behind it", body: "Every booking is checked by our team in Victoria Falls. Tunya is fast; we are accountable." }
  ],
  closing: {
    image: "/assets/br-tunya-site.jpg",
    imageAlt: "Tunya on any device",
    title: "Say hello. Your trip begins in a sentence.",
    cta: { label: "Start With Tunya", href: TUNYA_URL }
  }
};
