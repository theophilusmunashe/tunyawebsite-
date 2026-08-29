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

export default function SocialConnect({ go, page }) {
  const { site, social } = useContent();
  const [popup, setPopup] = useState(false);

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
  };

  useEffect(() => {
    if (page === "social") rememberSeen();
    if (alreadySeen() || page === "social") return undefined;
    const wait = window.setTimeout(() => setPopup(true), 9000);
    return () => window.clearTimeout(wait);
  }, [page]);

  useEffect(() => {
    if (!popup) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popup]);

  return (
    <>
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

      {popup && (
        <div className="site-social-pop" role="dialog" aria-labelledby="site-social-pop-title" aria-modal="true">
          <button type="button" className="site-social-pop-veil" aria-label="Close" onClick={closePopup} />
          <div className="site-social-pop-card">
            <p className="site-social-pop-kicker">Follow first</p>
            <h2 id="site-social-pop-title">See the Falls before you book.</h2>
            <p className="site-social-pop-copy">Daily spray, wildlife and guest moments — tap a channel and follow Tunyafrika.</p>
            <div className="site-social-pop-grid">
              {channels.map((c) => (
                <a
                  key={c.network}
                  className="site-social-pop-link"
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon network={c.network} size={22} />
                  <span>
                    <strong>{c.name}</strong>
                    <em>{c.handle}</em>
                  </span>
                </a>
              ))}
            </div>
            <div className="site-social-pop-actions">
              <button type="button" className="site-social-pop-more" onClick={() => { closePopup(); go("social"); }}>
                All socials
              </button>
              <button type="button" className="site-social-pop-later" onClick={closePopup}>
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
