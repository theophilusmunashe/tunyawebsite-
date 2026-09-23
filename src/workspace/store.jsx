import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CLOUD_FILE_MAX, mergeWorkspacePacks, packHasRecords, pullWorkspace, pushWorkspace, slimPackForCloud } from "./lib/cloud.js";
import { exportBackup, fileDelete, fileGet, fileListMeta, filePut, importBackup, kvGet, kvSet } from "./lib/db.js";
import { uid } from "./lib/ids.js";
import { seedIfEmpty, DEFAULT_CREW, DEFAULT_SETTINGS } from "./data/seed.js";

const LISTS = ["crew", "tasks", "quotes", "invoices", "cashbook", "loans", "journeys", "movements", "visaCases", "briefs", "notices"];
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
  const [sync, setSync] = useState({ status: "idle", at: 0, error: "" });
  const cloudLock = useRef(Promise.resolve());
  const warnedOffline = useRef(false);
  const flushTimer = useRef(null);

  const toast = useCallback((message) => {
    const id = uid("toast");
    setToasts((list) => [...list, { id, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4200);
  }, []);

  const hydrate = useCallback(async () => {
    const next = {
      settings: (await kvGet("settings")) || { ...DEFAULT_SETTINGS },
      _tombstones: (await kvGet("_tombstones")) || {}
    };
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
    return next;
  }, []);

  const runCloud = useCallback((fn) => {
    const next = cloudLock.current.then(fn, fn);
    cloudLock.current = next.catch(() => {});
    return next;
  }, []);

  const applyCloudPack = useCallback(async (pack) => {
    await importBackup(pack, { keepLocalFilesOver: CLOUD_FILE_MAX });
  }, []);

  const flushCloud = useCallback(async ({ pullFirst = true } = {}) => {
    return runCloud(async () => {
      setSync((s) => ({ ...s, status: "syncing", error: "" }));
      try {
        const local = await exportBackup({ maxFileBytes: CLOUD_FILE_MAX });
        let pack = slimPackForCloud(local);
        if (pullFirst) {
          const remote = await pullWorkspace();
          if (packHasRecords(remote.pack) || packHasRecords(local)) {
            pack = slimPackForCloud(mergeWorkspacePacks(local, remote.pack));
            await applyCloudPack(pack);
          }
        }
        if (packHasRecords(pack)) {
          await pushWorkspace(pack);
        }
        warnedOffline.current = false;
        setSync({ status: "ok", at: Date.now(), error: "" });
        return pack;
      } catch (err) {
        const message = err?.message || "Could not sync the shared workspace.";
        setSync({ status: "offline", at: Date.now(), error: message });
        if (!warnedOffline.current) {
          warnedOffline.current = true;
          toast("Saved on this computer. Could not sync to the shared workspace yet.");
        }
        throw err;
      }
    });
  }, [applyCloudPack, runCloud, toast]);

  const load = useCallback(async () => {
    try {
      let usedCloud = false;
      try {
        const remote = await pullWorkspace();
        if (packHasRecords(remote.pack)) {
          const local = await exportBackup({ maxFileBytes: CLOUD_FILE_MAX });
          const merged = slimPackForCloud(mergeWorkspacePacks(local, remote.pack));
          await applyCloudPack(merged);
          usedCloud = true;
          if (packHasRecords(local)) {
            await runCloud(async () => {
              await pushWorkspace(merged);
            });
          }
          setSync({ status: "ok", at: Date.now(), error: "" });
        }
      } catch (err) {
        console.warn("Workspace cloud pull failed.", err);
        setSync({ status: "offline", at: Date.now(), error: err?.message || "Offline" });
      }
      if (!usedCloud) {
        await seedIfEmpty();
        try {
          const local = await exportBackup({ maxFileBytes: CLOUD_FILE_MAX });
          if (packHasRecords(local)) {
            await pushWorkspace(slimPackForCloud(local));
            setSync({ status: "ok", at: Date.now(), error: "" });
          }
        } catch (err) {
          console.warn("Workspace cloud push failed.", err);
        }
      }
      await hydrate();
    } catch (err) {
      console.warn("Workspace storage unavailable — session only.", err);
      setData({
        settings: { ...DEFAULT_SETTINGS },
        crew: DEFAULT_CREW,
        tasks: [],
        quotes: [],
        invoices: [],
        cashbook: [],
        loans: [],
        journeys: [],
        movements: [],
        visaCases: [],
        briefs: [],
        notices: [],
        files: [],
        _tombstones: {}
      });
    } finally {
      setReady(true);
    }
  }, [applyCloudPack, hydrate, runCloud]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = () => load();
    return () => ch.close();
  }, [load]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  const persist = useCallback(async (key, value) => {
    const next = key === "settings" ? { ...value, updatedAt: Date.now() } : value;
    await kvSet(key, next);
    setData((d) => ({ ...d, [key]: next }));
    ping();
    clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(() => {
      flushCloud().then(() => hydrate()).catch(() => {});
    }, 800);
  }, [flushCloud, hydrate]);

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
    const tombs = { ...(data._tombstones || {}) };
    if (tombs[key]?.[id]) {
      const nextTombs = { ...tombs, [key]: { ...tombs[key] } };
      delete nextTombs[key][id];
      await kvSet("_tombstones", nextTombs);
      setData((d) => ({ ...d, _tombstones: nextTombs }));
    }
    await persist(key, next);
    return saved;
  }, [data, persist]);

  const remove = useCallback(async (key, id) => {
    const tombs = {
      ...(data._tombstones || {}),
      [key]: { ...((data._tombstones || {})[key] || {}), [id]: Date.now() }
    };
    await kvSet("_tombstones", tombs);
    setData((d) => ({ ...d, _tombstones: tombs }));
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
    flushCloud().then(() => hydrate()).catch(() => {});
    return record.id;
  }, [flushCloud, hydrate]);

  const deleteFile = useCallback(async (id) => {
    const tombs = {
      ...(data._tombstones || {}),
      files: { ...((data._tombstones || {}).files || {}), [id]: Date.now() }
    };
    await kvSet("_tombstones", tombs);
    await fileDelete(id);
    setData((d) => ({ ...d, files: d.files.filter((f) => f.id !== id), _tombstones: tombs }));
    ping();
    flushCloud().then(() => hydrate()).catch(() => {});
  }, [data._tombstones, flushCloud, hydrate]);

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
    await flushCloud({ pullFirst: false }).catch(() => {});
    await hydrate();
    toast("Backup restored and shared.");
  }, [flushCloud, hydrate, toast]);

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
    sync,
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
