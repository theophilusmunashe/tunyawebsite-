import { makeGo } from "../routes.js";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SocialConnect from "../components/SocialConnect.jsx";
import AccomodationsGallery from "../pages/AccomodationsGallery.jsx";
import AccomodationDetail from "../pages/AccomodationDetail.jsx";

function siteGo(navigate) {
  return makeGo(navigate);
}

export default function AccomodationsApp() {
  const navigate = useNavigate();
  const go = siteGo(navigate);

  return (
    <div className="site-root" style={{ fontFamily: "'Poppins', sans-serif", color: "#0d2b1e", background: "#faf3e8", minHeight: "100vh" }}>
      <Header go={go} page="accomodations" />
      <Routes>
        <Route index element={<AccomodationsGallery />} />
        <Route path=":id" element={<AccomodationDetail />} />
      </Routes>
      <Footer go={go} />
      <SocialConnect />
    </div>
  );
}
