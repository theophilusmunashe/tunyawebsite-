import { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import VictoriaFalls from "./pages/VictoriaFalls.jsx";
import Xperiences from "./pages/Xperiences.jsx";
import Stays from "./pages/Stays.jsx";
import BeyondTheFalls from "./pages/BeyondTheFalls.jsx";
import Visas from "./pages/Visas.jsx";
import About from "./pages/About.jsx";
import Socials from "./pages/Socials.jsx";
import MeetTunya from "./pages/MeetTunya.jsx";
import PlanMyTrip from "./pages/PlanMyTrip.jsx";

const PAGES = {
  home: Home,
  falls: VictoriaFalls,
  xp: Xperiences,
  stays: Stays,
  beyond: BeyondTheFalls,
  visas: Visas,
  about: About,
  social: Socials,
  ai: MeetTunya,
  plan: PlanMyTrip
};

export default function App() {
  const [page, setPage] = useState("home");

  const go = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const Current = PAGES[page] || Home;

  return (
    <div className="site-root" style={{ fontFamily: "'Poppins', sans-serif", color: "#0d2b1e", background: "#faf3e8", minHeight: "100vh" }}>
      <Header go={go} />
      <Current go={go} />
      <Footer go={go} />
    </div>
  );
}
