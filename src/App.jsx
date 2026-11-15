import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import SocialConnect from "./components/SocialConnect.jsx";
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
import NotFound from "./pages/NotFound.jsx";
import { makeGo, pageForPath } from "./routes.js";
import { useContent } from "./content/ContentProvider.jsx";
import { applyHead, headFor } from "./seo/meta.js";

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
  plan: PlanMyTrip,
  notFound: NotFound
};

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const content = useContent();
  const page = pageForPath(pathname);
  const go = makeGo(navigate);

  // Keep <head> in step with the page after client-side navigation.
  useEffect(() => {
    applyHead(headFor(page, { content }));
  }, [page, content]);

  const Current = PAGES[page] || NotFound;

  return (
    <div className="site-root" style={{ fontFamily: "'Poppins', sans-serif", color: "#0d2b1e", background: "#faf3e8", minHeight: "100vh" }}>
      <Header go={go} page={page} />
      <main id="main">
        <Current go={go} />
      </main>
      <Footer go={go} />
      <SocialConnect />
    </div>
  );
}
