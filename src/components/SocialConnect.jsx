import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { FOLLOW_NETWORKS, SOCIAL_LABELS, SocialIcon } from "./SocialIcons.jsx";

const POPUP_KEY = "tunya-saw-social-popup-v2";

function alreadySeen() {
  try {
    return window.localStorage.getItem(POPUP_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberSeen() {
  try {
    window.localStorage.setItem(POPUP_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function SocialConnect() {
  const { site, social } = useContent();
  const [popup, setPopup] = useState(false);
  // Start hidden on both server and client (pre-rendered HTML must match); the effect below reveals it.
  const [showDock, setShowDock] = useState(false);
  const { pathname } = useLocation();
  // Never interrupt someone who is filling in a trip request.
  const quietPage = pathname.startsWith("/plan-my-trip");

  const channels = FOLLOW_NETWORKS.map((network) => {
    const fromFooter = (site.footer.socials || []).find((s) => s.network === network);
    const fromPage = (social.channels || []).find((s) => s.network === network);
    return {
      network,
      name: fromPage?.name || SOCIAL_LABELS[network],
      platform: SOCIAL_LABELS[network],
      handle: fromPage?.handle || "@tunyafrika",
      href: fromFooter?.href || fromPage?.href || "#"
    };
  }).filter((c) => c.href && c.href !== "#");

  const closePopup = () => {
    setPopup(false);
    rememberSeen();
    setShowDock(true);
  };

  useEffect(() => {
    if (alreadySeen()) {
      setShowDock(true);
      return undefined;
    }
    if (quietPage) return undefined;
    const wait = window.setTimeout(() => setPopup(true), 10000);
    return () => window.clearTimeout(wait);
  }, [quietPage]);

  useEffect(() => {
    if (!popup) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [popup]);

  return (
    <>
      {showDock && !popup && (
        <aside className="site-social-dock" aria-label="Follow Tunyafrika">
          <p className="site-social-dock-label">Follow</p>
          {channels.map((c) => (
            <a
              key={c.network}
              className="site-social-dock-link"
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow ${c.name} on ${c.platform}`}
            >
              <SocialIcon network={c.network} size={18} />
              <span>{c.platform}</span>
            </a>
          ))}
        </aside>
      )}

      {popup && (
        <div className="site-social-pop" role="dialog" aria-labelledby="site-social-pop-title" aria-modal="true">
          <div className="site-social-pop-card">
            <p className="site-social-pop-kicker">Follow us on social media</p>
            <h2 id="site-social-pop-title">Thanks for stopping by.</h2>
            <p className="site-social-pop-copy">
              We're Theo, Rudolph and Dzika, the local team behind Tunyafrika in Victoria Falls.
              Follow us for daily views of the Falls, then carry on exploring.
            </p>
            <div className="site-social-pop-grid">
              {channels.map((c) => (
                <a
                  key={c.network}
                  className="site-social-pop-link"
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon network={c.network} size={24} />
                  <span>
                    <strong>{c.platform}</strong>
                    <em>{c.name} · {c.handle}</em>
                  </span>
                  <b>Open</b>
                </a>
              ))}
            </div>
            <button type="button" className="site-social-pop-continue" onClick={closePopup}>
              Keep exploring
            </button>
          </div>
        </div>
      )}
    </>
  );
}
