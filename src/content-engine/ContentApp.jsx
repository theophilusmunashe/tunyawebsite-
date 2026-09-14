import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SocialConnect from "../components/SocialConnect.jsx";
import ContentUpdates from "../pages/ContentUpdates.jsx";

function siteGo(navigate) {
  return (next) => {
    if (next === "accomodations" || next === "/accomodations") {
      navigate("/accomodations");
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (next === "content" || next === "/content") {
      navigate("/content");
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    navigate("/");
    try {
      sessionStorage.setItem("tunya-go-page", next);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };
}

export default function ContentApp() {
  const navigate = useNavigate();
  const go = siteGo(navigate);

  return (
    <div className="site-root" style={{ fontFamily: "'Poppins', sans-serif", color: "#0d2b1e", background: "#faf3e8", minHeight: "100vh" }}>
      <Header go={go} page="content" />
      <Routes>
        <Route index element={<ContentUpdates />} />
      </Routes>
      <Footer go={go} />
      <SocialConnect />
    </div>
  );
}
