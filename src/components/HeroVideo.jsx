import { useEffect, useRef, useState } from "react";

const coverStyle = { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" };

/**
 * Full-bleed hero film. The poster paints immediately (it is the LCP image);
 * the video only loads after the page has finished loading, never on
 * data-saver connections, and never for people who prefer reduced motion.
 */
export default function HeroVideo({ video, fallbackImage, alt }) {
  const ref = useRef(null);
  const [src, setSrc] = useState("");
  const poster = video?.poster || fallbackImage;

  useEffect(() => {
    if (!video?.desktop) return undefined;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData;
    if (reduce || saveData) return undefined;
    const pick = () => setSrc(window.matchMedia("(max-width: 760px)").matches && video.mobile ? video.mobile : video.desktop);
    if (document.readyState === "complete") {
      const id = setTimeout(pick, 300);
      return () => clearTimeout(id);
    }
    window.addEventListener("load", pick, { once: true });
    return () => window.removeEventListener("load", pick);
  }, [video]);

  useEffect(() => {
    if (src && ref.current) ref.current.play?.().catch(() => {});
  }, [src]);

  return (
    <>
      <img src={poster} alt={alt} style={coverStyle} fetchpriority="high" decoding="async" />
      {src && (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          style={coverStyle}
        />
      )}
    </>
  );
}
