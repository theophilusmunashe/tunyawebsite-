import { TUNYA_URL } from "./site.js";

export const xp = {
  hero: {
    kicker: "Xperiences",
    title: "Choose how you want to remember it.",
    body: "Everything below is booked, guided and looked after by us. Mix them freely — most guests build a week from four or five."
  },
  headline: [
    {
      image: "/assets/br-rafting.jpg",
      imageAlt: "White-water rafting",
      kicker: "Adrenaline",
      title: "White-water rafting",
      body: "Nineteen named rapids in the Batoka Gorge — the wildest commercially run water on earth."
    },
    {
      image: "/assets/br-explore-flight.jpg",
      imageAlt: "Flight of Angels",
      kicker: "From the air",
      title: "The Flight of Angels",
      body: "Helicopter or microlight over the full mile — the only way to see the whole of it at once."
    }
  ],
  secondary: [
    { image: "/assets/br-explore-swing.jpg", imageAlt: "The gorge swing", title: "Bungee & gorge swing", body: "111 metres off the 1905 bridge." },
    { image: "/assets/br-explore-cruise.jpg", imageAlt: "Sunset cruise", title: "Zambezi sunset cruise", body: "Hippos, gin and a sun the size of a drum." },
    { image: "/assets/ch-jeep1.jpg", imageAlt: "Game drive", title: "Game drives", body: "Zambezi National Park, or a full day in Chobe." }
  ],
  boma: {
    image: "/assets/br-boma-drummer.jpg",
    imageAlt: "The Boma Dinner",
    imagePosition: "50% 32%",
    kicker: "The one everyone talks about",
    title: "The Boma Dinner",
    body: "Firelight, drums in your chest, a feast under the stars and a face-painting ceremony you'll be talking about for years. Bookings for the year fill early — reserve before you fly.",
    gallery: [
      { image: "/assets/br-boma-dance.jpg", imageAlt: "Boma dancers" },
      { image: "/assets/br-boma-fire.jpg", imageAlt: "Boma firelight" }
    ]
  },
  flagship: {
    kicker: "Flagship Xperiences",
    title: "Six journeys we are known for.",
    body: "Fully arranged, start to finish — transfers, guides, entries and tables included. Tell us which one and we shape it around your dates.",
    items: [
      { image: "/assets/br-rafting.jpg", imageAlt: "The Adrenaline Run", kicker: "Flagship I", title: "The Adrenaline Run", body: "Bungee, gorge swing and Grade-5 rafting in one unforgettable day." },
      { image: "/assets/br-falls-aerial2.jpg", imageAlt: "The Angels' View", kicker: "Flagship II", title: "The Angels' View", body: "Helicopter over the full mile, then the rainforest on foot." },
      { image: "/assets/br-river-dusk.jpg", imageAlt: "The Weekend Escape", kicker: "Flagship III", title: "The Weekend Escape", body: "Two nights, the Falls, a sunset cruise and a very slow Sunday." },
      { image: "/assets/br-elephant-portrait.jpg", imageAlt: "The Grand Signature", kicker: "Flagship IV", title: "The Grand Signature", body: "Our most complete week — Falls, Chobe, Boma and a suite above the river." },
      { image: "/assets/ch-impala.jpg", imageAlt: "The Classic Safari", kicker: "Flagship V", title: "The Classic Safari", body: "Zambezi National Park and a full day across the border in Chobe." },
      { image: "/assets/br-elephant-calf.jpg", imageAlt: "The Family Basecamp", kicker: "Flagship VI", title: "The Family Basecamp", body: "Gentle days, big animals, a pool for the afternoons and staff who adore children." }
    ]
  },
  closing: {
    title: "Tell us the mood. We'll build the days.",
    cta: { label: "Build My Itinerary", href: TUNYA_URL }
  }
};
