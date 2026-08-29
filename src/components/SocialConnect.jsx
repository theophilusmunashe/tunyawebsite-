import { useEffect, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { FOLLOW_NETWORKS, SOCIAL_LABELS, SocialIcon } from "./SocialIcons.jsx";

const POPUP_KEY = "tunya-saw-social-popup";

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
  const [showDock, setShowDock] = useState(alreadySeen);

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
    const wait = window.setTimeout(() => setPopup(true), 30000);
    return () => window.clearTimeout(wait);
  }, []);

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
            <h2 id="site-social-pop-title">We value you being here.</h2>
            <p className="site-social-pop-copy">
              Thank you for checking out how Tunyafrika provides Xpectional Xperiences.
              Please follow all our social media accounts, then come back and keep exploring.
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
              Continue to the site
            </button>
          </div>
        </div>
      )}
    </>
  );
}
