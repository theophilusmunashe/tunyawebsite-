import { useMemo, useState } from "react";
import { FOLDERS } from "../data/catalog.js";
import { prettyWhen } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Modal, PageHead } from "../ui.jsx";

function sizeLabel(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Vault() {
  const { files, addFile, deleteFile, downloadFile, previewFile, you, toast } = useWorkspace();
  const [folder, setFolder] = useState("All");
  const [q, setQ] = useState("");
  const [over, setOver] = useState(false);
  const [preview, setPreview] = useState(null);

  const visible = useMemo(() => files.filter((f) => {
    const mapped = f.folder === "House" ? "General" : f.folder;
    const inFolder = folder === "All" || mapped === folder || f.folder === folder;
    const match = !q || f.name.toLowerCase().includes(q.toLowerCase());
    return inFolder && match;
  }), [files, folder, q]);

  const ingest = async (list) => {
    const chosen = folder === "All" ? "General" : folder;
    for (const file of list) {
      if (file.size > 20 * 1024 * 1024) {
        toast(`${file.name} is over 20 MB.`);
        continue;
      }
      await addFile(file, chosen, you?.name);
    }
    toast(list.length > 1 ? `${list.length} files uploaded` : "Uploaded");
  };

  const openPreview = async (id) => {
    const rec = await previewFile(id);
    if (!rec) return;
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(rec);
  };

  return (
    <div>
      <PageHead
        title="Files"
        action={
          <label className="ws-btn" style={{ display: "inline-flex" }}>
            Upload
            <input type="file" multiple hidden onChange={(e) => ingest([...e.target.files])} />
          </label>
        }
      />

      <div
        className={`ws-drop${over ? " is-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); ingest([...e.dataTransfer.files]); }}
      >
        Drop files here
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
        <div className="ws-folders">
          {["All", ...FOLDERS].map((name) => (
            <button key={name} type="button" className={folder === name ? "is-on" : ""} onClick={() => setFolder(name)}>{name}</button>
          ))}
        </div>
        <input className="ws-search" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {visible.length === 0 && <Empty>No files in this folder.</Empty>}

      <div className="ws-files">
        {visible.map((f) => (
          <div className="ws-file" key={f.id}>
            <div className="ws-kicker">{f.folder === "House" ? "General" : f.folder}</div>
            <div className="name">{f.name}</div>
            <p className="ws-lede" style={{ margin: 0, fontSize: 12 }}>{sizeLabel(f.size)} · {f.uploadedBy} · {prettyWhen(f.uploadedAt)}</p>
            <div className="ws-actions" style={{ marginTop: "auto" }}>
              <Button kind="ghost" className="slim" onClick={() => openPreview(f.id)}>Open</Button>
              <Button kind="ghost" className="slim" onClick={() => downloadFile(f.id)}>Download</Button>
              <Button kind="warn" className="slim" onClick={() => deleteFile(f.id)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <Modal title={preview.name} onClose={() => { URL.revokeObjectURL(preview.url); setPreview(null); }}>
          {preview.mime?.startsWith("image/") && <img src={preview.url} alt="" style={{ width: "100%", display: "block" }} />}
          {preview.mime === "application/pdf" && <iframe title={preview.name} src={preview.url} style={{ width: "100%", height: 480, border: 0 }} />}
          {preview.mime?.startsWith("text/") && <iframe title={preview.name} src={preview.url} style={{ width: "100%", height: 360, border: "1px solid rgba(13,43,30,0.15)", background: "#fff" }} />}
          {!preview.mime?.startsWith("image/") && preview.mime !== "application/pdf" && !preview.mime?.startsWith("text/") && (
            <p>Download this file to open it.</p>
          )}
          <div className="ws-actions">
            <Button onClick={() => downloadFile(preview.id)}>Download</Button>
            <Button kind="ghost" onClick={() => { URL.revokeObjectURL(preview.url); setPreview(null); }}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
