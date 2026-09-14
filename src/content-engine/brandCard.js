function wrapLines(ctx, text, maxWidth, maxLines = 4) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (words.length && lines.length === maxLines) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length > 3) last = last.slice(0, -1);
    lines[maxLines - 1] = /…$/.test(last) ? last : `${last}…`;
  }
  return lines;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load brand logo."));
    img.src = src;
  });
}

/** Build a branded 1080×1080 Tunyafrika Updates share card. */
export async function renderUpdateCard(item, { logoSrc = "/assets/logo-cream.png" } = {}) {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Atmosphere background
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, "#021a12");
  g.addColorStop(0.45, "#04301f");
  g.addColorStop(1, "#0a3d28");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // Soft gold glow
  const glow = ctx.createRadialGradient(820, 180, 40, 820, 180, 420);
  glow.addColorStop(0, "rgba(179,149,92,0.28)");
  glow.addColorStop(1, "rgba(179,149,92,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // Frame
  ctx.strokeStyle = "rgba(179,149,92,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, size - 96, size - 96);

  // Logo
  try {
    const logo = await loadImage(logoSrc);
    const logoW = 280;
    const logoH = logoW * (logo.height / logo.width);
    ctx.drawImage(logo, 90, 90, logoW, logoH);
  } catch {
    ctx.fillStyle = "#faf3e8";
    ctx.font = "700 42px Poppins, sans-serif";
    ctx.fillText("tunyafrika", 90, 150);
  }

  // Tagline
  ctx.fillStyle = "#b3955c";
  ctx.font = "600 28px Poppins, sans-serif";
  ctx.fillText("TUNYAFRIKA UPDATES", 90, 320);

  // Gold rule
  ctx.fillStyle = "rgba(179,149,92,0.7)";
  ctx.fillRect(90, 350, 220, 3);

  // Headline
  ctx.fillStyle = "#faf3e8";
  ctx.font = "500 58px 'Cormorant Garamond', Georgia, serif";
  const headline = String(item.headline || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/<[^>]*$/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const summary = String(item.summary || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/<[^>]*$/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const headlineLines = wrapLines(ctx, headline, size - 180, 4);
  let y = 430;
  for (const line of headlineLines) {
    ctx.fillText(line, 90, y);
    y += 70;
  }

  // Short description
  ctx.fillStyle = "rgba(250,243,232,0.82)";
  ctx.font = "300 30px Poppins, sans-serif";
  const summaryLines = wrapLines(ctx, summary, size - 180, 4);
  y += 24;
  for (const line of summaryLines) {
    ctx.fillText(line, 90, y);
    y += 42;
  }

  // Source attribution
  ctx.fillStyle = "rgba(179,149,92,0.95)";
  ctx.font = "500 22px Poppins, sans-serif";
  ctx.fillText("Source", 90, size - 150);
  ctx.fillStyle = "rgba(250,243,232,0.75)";
  ctx.font = "300 24px Poppins, sans-serif";
  const sourceLine = wrapLines(ctx, `${item.sourceName || "Publisher"}${item.sourceUrl ? ` · ${item.sourceUrl}` : ""}`, size - 180, 2);
  let sy = size - 110;
  for (const line of sourceLine) {
    ctx.fillText(line, 90, sy);
    sy += 34;
  }

  return canvas;
}

export async function downloadUpdateCard(item, filename) {
  const canvas = await renderUpdateCard(item);
  const name = filename || `tunyafrika-update-${(item.id || "card").slice(0, 12)}.png`;
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  return url;
}

export async function canvasPreviewUrl(item) {
  const canvas = await renderUpdateCard(item);
  return canvas.toDataURL("image/png");
}
