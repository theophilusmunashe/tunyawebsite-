const PATHS = {
  facebook: <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5H16.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" />
    </>
  ),
  x: <path d="M17.53 3H20.5l-6.49 7.42L21.75 21h-5.98l-4.68-6.12L5.7 21H2.73l6.94-7.93L2.25 3h6.13l4.23 5.6L17.53 3zm-1.04 16.2h1.64L7.6 4.71H5.84L16.49 19.2z" />,
  tiktok: <path d="M16.6 5.8a5 5 0 0 1-1.4-3.3h-3v12a2.6 2.6 0 1 1-1.9-2.5V8.9a5.7 5.7 0 1 0 4.9 5.6V9.2a8.2 8.2 0 0 0 4.5 1.4V7.5a4.9 4.9 0 0 1-3.1-1.7z" />,
  whatsapp: <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.4 12.1c-.2.6-1.1 1.1-1.6 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.4-4.8c-.6-1-.9-1.9-.6-2.6.2-.4.6-1 .9-1.1h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3-.1.5.5.9 1.9 2.3 3.2 2.9.2.1.4.1.5-.1l.7-.8c.2-.2.3-.3.6-.2l1.8.9c.3.1.4.2.4.4 0 .1 0 .5-.2.7z" />
};

export const SOCIAL_LABELS = {
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X",
  whatsapp: "WhatsApp"
};

export const FOLLOW_NETWORKS = ["tiktok", "instagram", "facebook", "x"];

export function SocialIcon({ network, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {PATHS[network] || null}
    </svg>
  );
}
