import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { exportBackup, fileDelete, fileGet, fileListMeta, filePut, importBackup, kvGet, kvSet } from "./lib/db.js";
import { uid } from "./lib/ids.js";
import { seedIfEmpty, DEFAULT_CREW, DEFAULT_SETTINGS } from "./data/seed.js";

const LISTS = ["crew", "tasks", "quotes", "invoices", "journeys", "movements", "visaCases", "briefs", "notices"];
const CHANNEL = "tunyafrika-workspace";

const WorkspaceContext = createContext(null);

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem("tunya-desk") || localStorage.getItem("tunya-desk") || "null");
  } catch {
    return null;
  }
}

function writeSession(session, persist) {
  const raw = JSON.stringify(session);
  sessionStorage.setItem("tunya-desk", raw);
  if (persist) localStorage.setItem("tunya-desk", raw);
  else localStorage.removeItem("tunya-desk");
}

function ping() {
  try { new BroadcastChannel(CHANNEL).postMessage("refresh"); } catch { /* ignore */ }
}

export function workspaceKey() {
  return import.meta.env.VITE_WORKSPACE_KEY || "123456";
}

export function WorkspaceProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState({ settings: {}, files: [] });
  const [session, setSession] = useState(readSession);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message) => {
    const id = uid("toast");
    setToasts((list) => [...list, { id, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4200);
  }, []);

  const load = useCallback(async () => {
    try {
      await seedIfEmpty();
      const next = { settings: (await kvGet("settings")) || { ...DEFAULT_SETTINGS } };
      for (const key of LISTS) next[key] = (await kvGet(key)) || [];
      if (!next.crew?.length) next.crew = DEFAULT_CREW;
      next.files = await fileListMeta();
      setData(next);
      setSession((current) => {
        if (!current?.crewId) return current;
        const stillThere = (next.crew || []).some((c) => c.id === current.crewId);
        if (stillThere) return current;
        sessionStorage.removeItem("tunya-desk");
        localStorage.removeItem("tunya-desk");
        return null;
      });
    } catch (err) {
      console.warn("Workspace storage unavailable — session only.", err);
      setData({
        settings: { ...DEFAULT_SETTINGS },
        crew: DEFAULT_CREW,
        tasks: [],
        quotes: [],
        invoices: [],
        journeys: [],
        movements: [],
        visaCases: [],
        briefs: [],
        notices: [],
        files: []
      });
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = () => load();
    return () => ch.close();
  }, [load]);

  const persist = useCallback(async (key, value) => {
    await kvSet(key, value);
    setData((d) => ({ ...d, [key]: value }));
    ping();
  }, []);

  const updateSettings = useCallback(async (patch) => {
    const next = { ...data.settings, ...patch };
    await persist("settings", next);
    return next;
  }, [data.settings, persist]);

  const upsert = useCallback(async (key, record) => {
    const list = data[key] || [];
    const id = record.id || uid(key.slice(0, 2));
    const now = Date.now();
    const saved = list.some((row) => row.id === record.id)
      ? { ...list.find((row) => row.id === record.id), ...record, id, updatedAt: now }
      : { ...record, id, createdAt: record.createdAt || now, updatedAt: now };
    const next = list.some((row) => row.id === record.id)
      ? list.map((row) => (row.id === record.id ? saved : row))
      : [saved, ...list];
    await persist(key, next);
    return saved;
  }, [data, persist]);

  const remove = useCallback(async (key, id) => {
    await persist(key, (data[key] || []).filter((row) => row.id !== id));
  }, [data, persist]);

  const addFile = useCallback(async (file, folder, uploadedBy) => {
    const record = {
      id: uid("file"),
      name: file.name,
      mime: file.type || "application/octet-stream",
      size: file.size,
      folder: folder || "General",
      uploadedBy: uploadedBy || "Admin",
      uploadedAt: Date.now(),
      blob: file
    };
    await filePut(record);
    setData((d) => ({ ...d, files: [{ ...record, blob: undefined }, ...d.files] }));
    ping();
    return record.id;
  }, []);

  const deleteFile = useCallback(async (id) => {
    await fileDelete(id);
    setData((d) => ({ ...d, files: d.files.filter((f) => f.id !== id) }));
    ping();
  }, []);

  const downloadFile = useCallback(async (id) => {
    const rec = await fileGet(id);
    if (!rec?.blob) return;
    const url = URL.createObjectURL(rec.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = rec.name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const previewFile = useCallback(async (id) => {
    const rec = await fileGet(id);
    if (!rec?.blob) return null;
    return { ...rec, url: URL.createObjectURL(rec.blob) };
  }, []);

  const signIn = useCallback((crewId, persistDesk) => {
    const crew = (data.crew || []).find((c) => c.id === crewId);
    if (!crew) return;
    const next = { crewId: crew.id, name: crew.name, initials: crew.initials, at: Date.now() };
    writeSession(next, persistDesk);
    setSession(next);
  }, [data.crew]);

  const signOut = useCallback(() => {
    sessionStorage.removeItem("tunya-desk");
    localStorage.removeItem("tunya-desk");
    setSession(null);
  }, []);

  const backup = useCallback(async () => {
    const pack = await exportBackup();
    const blob = new Blob([JSON.stringify(pack)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tunyafrika-admin-${new Date().toISOString().slice(0, 10)}.tunya.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const restore = useCallback(async (file) => {
    const pack = JSON.parse(await file.text());
    await importBackup(pack);
    await load();
    toast("Backup restored.");
  }, [load, toast]);

  const you = useMemo(
    () => (data.crew || []).find((c) => c.id === session?.crewId) || session,
    [data.crew, session]
  );

  const value = {
    ready,
    ...data,
    you,
    session,
    toasts,
    toast,
    signIn,
    signOut,
    upsert,
    remove,
    updateSettings,
    addFile,
    deleteFile,
    downloadFile,
    previewFile,
    backup,
    restore,
    reload: load
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside the workspace");
  return ctx;
}
