import { TUNYA_URL } from "./site.js";

export const ai = {
  hero: {
    kicker: "Ask Tunya",
    title: "Plan by chat. Our team does the rest.",
    paragraphs: [
      "Ask Tunya is the trip-planning assistant we built at Tunyafrika. Chat to it the way you'd message a friend who lives in Victoria Falls: what to do, where to stay, what it costs, how the border works, when your pickup is.",
      "Then a real person takes over. Theo, Rudolph or Dzika checks your plan, confirms availability and gets back to you. No forms, and no waiting for office hours to get started."
    ],
    badge: "asktunya.vercel.app",
    conversation: [
      { from: "guest", text: "\"Four days in Vic Falls for two — the falls, a safari, and something wild.\"", width: "78%" },
      { from: "tunya", text: "\"Here's a plan: rainforest tour Tuesday, Chobe day trip Wednesday, sunset cruise Thursday, and a 111 m bungee for the brave one. Shall I send it to the team to confirm?\"", width: "88%" },
      { from: "guest", text: "\"Do we need a visa for Botswana?\"", width: "60%" },
      { from: "tunya", text: "\"Not for your passports — just bring them. Our guide handles the border both ways.\"", width: "84%" }
    ]
  },
  features: [
    { title: "Plan in minutes", body: "Activities, lodges, transfers and dinner tables in one chat. Our team then confirms each booking." },
    { title: "Ask anything", body: "Weather, water levels, what to pack, whether the children can raft." },
    { title: "Live updates", body: "Pickup times, changes and delays, sent to you before you have to ask." },
    { title: "Humans behind it", body: "Every trip is checked by our team in Victoria Falls. Tunya is fast; we are accountable." }
  ],
  closing: {
    image: "/assets/br-tunya-site.jpg",
    imageAlt: "Ask Tunya on any device",
    title: "Say hello. Your trip starts with one message.",
    cta: { label: "Ask Tunya Now", href: TUNYA_URL }
  }
};
