import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminBootstrap,
  captionFor,
  cleanCopy,
  deleteItem,
  fetchUpdates,
  importUrl,
  saveItem,
  socialOpeners
} from "../../content-engine/api.js";
import { canvasPreviewUrl, downloadUpdateCard } from "../../content-engine/brandCard.js";
import { ITEM_STATUSES, formatWhen } from "../../content-engine/model.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Field, Modal, PageHead } from "../ui.jsx";

export default function ContentAdmin() {
  const { toast } = useWorkspace();
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [items, setItems] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(0);
  const [open, setOpen] = useState(null);
  const [preview, setPreview] = useState("");
  const [importLink, setImportLink] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const data = await adminBootstrap();
    setItems(data.items || []);
    setFetchedAt(data.fetchedAt || 0);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await refresh();
      } catch (err) {
        if (alive) toast(err.message || "Could not load content engine.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [refresh, toast]);

  useEffect(() => {
    let alive = true;
    if (!open) {
      setPreview("");
      return undefined;
    }
    (async () => {
      try {
        const url = await canvasPreviewUrl(open);
        if (alive) setPreview(url);
      } catch {
        if (alive) setPreview("");
      }
    })();
    return () => { alive = false; };
  }, [open]);

  const counts = useMemo(() => ({
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    posted: items.filter((i) => i.status === "posted").length,
    rejected: items.filter((i) => i.status === "rejected").length
  }), [items]);

  const visible = useMemo(
    () => items.filter((i) => (tab === "all" ? true : i.status === tab)),
    [items, tab]
  );

  const runFetch = async () => {
    setFetching(true);
    try {
      const data = await fetchUpdates();
      setItems(data.items || []);
      setFetchedAt(data.fetchedAt || Date.now());
      const errNote = (data.errors || []).length ? ` ${data.errors.length} feed warning(s).` : "";
      toast(`Pulled ${data.added || 0} new update(s) from ${data.scanned || 0} headlines.${errNote}`);
      setTab("pending");
    } catch (err) {
      toast(err.message || "Could not fetch updates.");
    } finally {
      setFetching(false);
    }
  };

  const runImport = async () => {
    if (!importLink.trim()) {
      toast("Paste an article URL first.");
      return;
    }
    setBusy(true);
    try {
      const item = await importUrl(importLink.trim());
      setItems((list) => [item, ...list.filter((i) => i.id !== item.id)]);
      setImportLink("");
      setOpen(item);
      toast("Article imported for review.");
    } catch (err) {
      toast(err.message || "Could not import URL.");
    } finally {
      setBusy(false);
    }
  };

  const persist = async (patch = {}) => {
    if (!open) return null;
    setBusy(true);
    try {
      const payload = {
        ...open,
        ...patch,
        headline: cleanCopy(patch.headline ?? open.headline),
        summary: cleanCopy(patch.summary ?? open.summary)
      };
      const saved = await saveItem(payload);
      setItems((list) => list.map((i) => (i.id === saved.id ? saved : i)));
      setOpen(saved);
      toast(saved.status === "approved" ? "Approved for Tunyafrika Updates." : "Saved.");
      return saved;
    } catch (err) {
      toast(err.message || "Could not save update.");
      return null;
    } finally {
      setBusy(false);
    }
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(captionFor(open));
      toast("Caption copied.");
    } catch {
      toast("Could not copy. Select the caption text manually.");
    }
  };

  const openSocial = async (network) => {
    if (!open) return;
    // Ensure approved before share workflow
    let item = open;
    if (item.status === "pending") {
      item = await persist({ status: "approved" });
      if (!item) return;
    }
    try {
      await downloadUpdateCard(item);
    } catch {
      toast("Download the branded image if the browser blocked it.");
    }
    try {
      await navigator.clipboard.writeText(captionFor(item));
    } catch {
      /* ignore */
    }
    const links = socialOpeners(item);
    window.open(links[network], "_blank", "noopener");
    toast(
      network === "instagram"
        ? "Image downloaded + caption copied. Instagram opened — paste and post manually."
        : "Image downloaded + caption copied. Finish the post in the tab that opened."
    );
  };

  if (loading) {
    return <div><PageHead title="Content" /><Empty>Loading content engine…</Empty></div>;
  }

  return (
    <div>
      <PageHead
        title="Content"
        action={(
          <div className="ws-actions" style={{ marginTop: 0 }}>
            <a className="ws-btn slim ghost" href="/content" target="_blank" rel="noopener">Open /content</a>
            <Button className="slim" disabled={fetching} onClick={runFetch}>
              {fetching ? "Fetching…" : "Fetch Africa tourism updates"}
            </Button>
          </div>
        )}
      />

      <div className="ws-stats">
        <div className="ws-stat"><div className="ws-kicker">Pending</div><b>{counts.pending}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Approved</div><b>{counts.approved}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Posted</div><b>{counts.posted}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Rejected</div><b>{counts.rejected}</b></div>
      </div>

      <div className="ws-panel paper" style={{ marginBottom: 18 }}>
        <div className="ws-kicker">Import one article</div>
        <p className="ws-lede">Paste a tourism news URL. We only pull the headline + short description + source link.</p>
        <div className="ws-split" style={{ marginTop: 10 }}>
          <Field label="Article URL">
            <input value={importLink} onChange={(e) => setImportLink(e.target.value)} placeholder="https://…" />
          </Field>
        </div>
        <div className="ws-actions">
          <Button className="slim" disabled={busy} onClick={runImport}>Import for review</Button>
          <span className="ws-lede">Last fetch: {fetchedAt ? formatWhen(fetchedAt) : "not yet"}</span>
        </div>
      </div>

      <div className="ws-actions" style={{ marginTop: 0, marginBottom: 18 }}>
        {[
          { id: "pending", label: `Pending (${counts.pending})` },
          { id: "approved", label: `Approved (${counts.approved})` },
          { id: "posted", label: `Posted (${counts.posted})` },
          { id: "rejected", label: "Rejected" },
          { id: "all", label: "All" }
        ].map((item) => (
          <Button key={item.id} kind={tab === item.id ? "gold" : "ghost"} className="slim" onClick={() => setTab(item.id)}>
            {item.label}
          </Button>
        ))}
      </div>

      <div className="ws-panel">
        <div className="ws-kicker">Review queue</div>
        {visible.length === 0 && <p className="ws-lede">Nothing here yet. Fetch updates or import a URL.</p>}
        {visible.map((item) => (
          <div className="ws-row" key={item.id} style={{ cursor: "pointer" }} onClick={() => setOpen({ ...item })}>
            <div>
              <div className="ws-kicker">{item.status} · {item.sourceName || "Source"}</div>
              <strong>{cleanCopy(item.headline)}</strong>
              <p>{cleanCopy(item.summary)}</p>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Modal title="Tunyafrika Updates" onClose={() => setOpen(null)} dark>
          <p className="ws-lede">Edit the short card, approve it, download the branded image, then open a social tab and click Post yourself — nothing auto-publishes.</p>

          <div className="ws-split">
            <Field label="Headline">
              <input value={open.headline} onChange={(e) => setOpen({ ...open, headline: e.target.value })} />
            </Field>
            <Field label="Status">
              <select value={open.status} onChange={(e) => setOpen({ ...open, status: e.target.value })}>
                {ITEM_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Source name">
              <input value={open.sourceName || ""} onChange={(e) => setOpen({ ...open, sourceName: e.target.value })} />
            </Field>
            <Field label="Source URL">
              <input value={open.sourceUrl || ""} onChange={(e) => setOpen({ ...open, sourceUrl: e.target.value })} />
            </Field>
          </div>
          <Field label="Short description">
            <textarea value={open.summary} onChange={(e) => setOpen({ ...open, summary: e.target.value })} rows={4} />
          </Field>

          <div className="ws-kicker" style={{ marginTop: 8 }}>Branded share card</div>
          <div style={{ marginTop: 10, background: "#041910", padding: 12, maxWidth: 360 }}>
            {preview ? (
              <img src={preview} alt="Tunyafrika Updates preview" style={{ width: "100%", display: "block" }} />
            ) : (
              <div className="ws-lede">Rendering card…</div>
            )}
          </div>

          <Field label="Caption (copied when you open socials)">
            <textarea readOnly value={captionFor(open)} rows={7} />
          </Field>

          <div className="ws-actions">
            <Button disabled={busy} onClick={() => persist()}>Save</Button>
            <Button disabled={busy} onClick={() => persist({ status: "approved" })}>Approve</Button>
            <Button kind="ghost" disabled={busy} onClick={() => persist({ status: "rejected" })}>Reject</Button>
            <Button kind="ghost" onClick={copyCaption}>Copy caption</Button>
            <Button kind="ghost" onClick={async () => {
              try {
                await downloadUpdateCard(open);
                toast("Branded image downloaded.");
              } catch (err) {
                toast(err.message || "Could not download image.");
              }
            }}>Download image</Button>
          </div>

          <div className="ws-kicker" style={{ marginTop: 18 }}>Post manually</div>
          <p className="ws-lede">We open the network with your caption ready (or Instagram for paste). You still click Post.</p>
          <div className="ws-actions">
            <Button className="slim" onClick={() => openSocial("x")}>Open X</Button>
            <Button className="slim" kind="ghost" onClick={() => openSocial("facebook")}>Open Facebook</Button>
            <Button className="slim" kind="ghost" onClick={() => openSocial("linkedin")}>Open LinkedIn</Button>
            <Button className="slim" kind="ghost" onClick={() => openSocial("whatsapp")}>Open WhatsApp</Button>
            <Button className="slim" kind="ghost" onClick={() => openSocial("instagram")}>Open Instagram</Button>
            <Button className="slim" kind="ink" disabled={busy} onClick={() => persist({ status: "posted" })}>Mark posted</Button>
          </div>

          <div className="ws-actions">
            {open.sourceUrl && <a className="ws-btn slim ghost" href={open.sourceUrl} target="_blank" rel="noopener">Original source</a>}
            <Button kind="warn" className="slim" onClick={async () => {
              await deleteItem(open.id);
              setItems((list) => list.filter((i) => i.id !== open.id));
              setOpen(null);
              toast("Update removed.");
            }}>Remove</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
