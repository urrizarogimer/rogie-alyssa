import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import QRCode from "qrcode";
import {
  Check, Copy, Download, Film, Heart, ImagePlus, Loader2, Printer, RefreshCw, Trash2, X,
} from "lucide-react";
import {
  MAX_UPLOAD_BYTES, UPLOAD_LINK, deleteGuestUpload, downloadUrlFor, fetchGuestUploads,
  formatBytes, signedUrlsFor, uploadGuestFile, type GuestUpload,
} from "../lib/uploads";

const COUPLE = "Rogimer & Alyssa Camille";
const DATE_LINE = "November 28, 2026";
const NAME_STORAGE_KEY = "wedding_uploader_name";

const serif: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const sans: CSSProperties = { fontFamily: "'Montserrat', sans-serif" };
const script: CSSProperties = { fontFamily: "'Great Vibes', cursive" };

// ─── Guest Upload Page (opened from the guest QR code) ────────────────────────

type ItemStatus = "ready" | "too-big" | "uploading" | "done" | "error";
interface PickedFile { id: string; file: File; preview: string | null; status: ItemStatus; progress: number; error?: string }

export function GuestUploadPage() {
  const [name, setName] = useState(() => { try { return localStorage.getItem(NAME_STORAGE_KEY) || ""; } catch { return ""; } });
  const [items, setItems] = useState<PickedFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => () => itemsRef.current.forEach((i) => i.preview && URL.revokeObjectURL(i.preview)), []);

  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  const patch = (id: string, change: Partial<PickedFile>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...change } : i)));

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const picked = Array.from(files)
      .filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        status: (file.size > MAX_UPLOAD_BYTES ? "too-big" : "ready") as ItemStatus,
        progress: 0,
      }));
    setItems((list) => [...list, ...picked]);
    setFinished(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeItem = (id: string) => setItems((list) => {
    const gone = list.find((i) => i.id === id);
    if (gone?.preview) URL.revokeObjectURL(gone.preview);
    return list.filter((i) => i.id !== id);
  });

  const uploadAll = async () => {
    try { localStorage.setItem(NAME_STORAGE_KEY, name.trim()); } catch { /* private mode */ }
    setBusy(true);
    let failed = 0;
    for (const item of itemsRef.current) {
      if (item.status !== "ready" && item.status !== "error") continue;
      patch(item.id, { status: "uploading", progress: 0, error: undefined });
      try {
        await uploadGuestFile(item.file, name.trim(), (p) => patch(item.id, { progress: p }));
        patch(item.id, { status: "done", progress: 1 });
      } catch (e) {
        failed += 1;
        patch(item.id, { status: "error", error: e instanceof Error ? e.message : "Upload failed." });
      }
    }
    setBusy(false);
    if (failed === 0) setFinished(true);
  };

  const startOver = () => {
    items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview));
    setItems([]);
    setFinished(false);
  };

  const pending = items.filter((i) => i.status === "ready" || i.status === "error").length;
  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 py-10" style={{ background: "linear-gradient(135deg, #E8F2FF 0%, #D8E1EB 35%, #A8C7F1 70%, #4275C8 100%)" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-md rounded-3xl px-6 py-8 sm:px-8" style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "0 16px 64px rgba(66,117,200,0.3)" }}>
        <div className="text-center mb-6">
          <p className="text-4xl mb-1" style={{ ...script, color: "#4275C8" }}>Share Your Moments</p>
          <p className="text-lg" style={{ ...serif, color: "#1F2D4C" }}>{COUPLE}</p>
        </div>

        {finished && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #4275C8, #A8C7F1)" }}>
              <Check size={26} color="white" />
            </div>
            <p className="text-2xl mb-2" style={{ ...serif, color: "#1F2D4C" }}>Thank you!</p>
            <p className="text-sm mb-6" style={{ ...sans, color: "#5A6A8A" }}>{doneCount === 1 ? "Your moment is" : `Your ${doneCount} moments are`} safely with the couple.</p>
            <button type="button" onClick={startOver} className="px-8 py-3 rounded-full text-xs uppercase" style={{ ...sans, letterSpacing: "0.18em", background: "linear-gradient(135deg, #4275C8, #A8C7F1)", color: "white", boxShadow: "0 4px 16px rgba(66,117,200,0.35)" }}>
              Share more
            </button>
          </motion.div>
        )}

        {!finished && (
          <div className="space-y-5">
            <div>
              <label htmlFor="uploader-name" className="block mb-1.5 text-xs uppercase" style={{ ...sans, letterSpacing: "0.14em", color: "#5A6A8A" }}>Your name (optional)</label>
              <input id="uploader-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} disabled={busy} placeholder="So the couple knows who to thank" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ ...sans, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(66,117,200,0.25)", color: "#1F2D4C" }} />
            </div>

            <input ref={inputRef} id="guest-files" type="file" accept="image/*,video/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} disabled={busy} />
            <label htmlFor="guest-files" className={`flex flex-col items-center justify-center gap-2 rounded-2xl py-7 px-4 text-center transition-all ${busy ? "opacity-50" : "cursor-pointer hover:bg-white"}`} style={{ border: "2px dashed rgba(66,117,200,0.4)", background: "rgba(255,255,255,0.6)" }}>
              <ImagePlus size={28} style={{ color: "#4275C8" }} />
              <span className="text-sm font-medium" style={{ ...sans, color: "#1F2D4C" }}>{items.length ? "Add more photos & videos" : "Choose photos & videos"}</span>
              <span className="text-xs" style={{ ...sans, color: "#5A6A8A" }}>Up to {formatBytes(MAX_UPLOAD_BYTES)} each · short video clips work best</span>
            </label>

            {items.length > 0 && (
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(66,117,200,0.12)" }}>
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(66,117,200,0.1)" }}>
                      {item.preview ? <img src={item.preview} alt="" className="w-full h-full object-cover" /> : <Film size={18} style={{ color: "#4275C8" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate" style={{ ...sans, color: "#1F2D4C" }}>{item.file.name}</p>
                      {item.status === "uploading" ? (
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(66,117,200,0.15)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(item.progress * 100)}%`, background: "linear-gradient(90deg, #4275C8, #86A4E4)" }} />
                        </div>
                      ) : (
                        <p className="text-xs mt-0.5" style={{ ...sans, color: item.status === "too-big" || item.status === "error" ? "#B42318" : item.status === "done" ? "#16a34a" : "#5A6A8A" }}>
                          {item.status === "too-big" && `Too large (${formatBytes(item.file.size)}) — try a shorter clip`}
                          {item.status === "error" && (item.error || "Upload failed")}
                          {item.status === "done" && "Uploaded"}
                          {item.status === "ready" && formatBytes(item.file.size)}
                        </p>
                      )}
                    </div>
                    {item.status === "done" ? (
                      <Check size={16} className="flex-shrink-0 mr-1" style={{ color: "#16a34a" }} />
                    ) : item.status === "uploading" ? (
                      <Loader2 size={16} className="flex-shrink-0 mr-1 animate-spin" style={{ color: "#4275C8" }} />
                    ) : (
                      <button type="button" onClick={() => removeItem(item.id)} disabled={busy} aria-label={`Remove ${item.file.name}`} className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.08)" }}>
                        <X size={14} style={{ color: "#5A6A8A" }} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <button type="button" onClick={uploadAll} disabled={busy || pending === 0} className="w-full py-3.5 rounded-full text-xs uppercase transition-all disabled:opacity-50" style={{ ...sans, letterSpacing: "0.18em", background: "linear-gradient(135deg, #4275C8, #A8C7F1)", color: "white", boxShadow: "0 4px 16px rgba(66,117,200,0.35)" }}>
              {busy ? "Uploading… please keep this page open" : pending > 0 ? `Upload ${pending} ${pending === 1 ? "file" : "files"}` : "Choose files to upload"}
            </button>
          </div>
        )}

        <div className="mt-7 flex items-center justify-center gap-2" style={{ color: "#86A4E4" }}>
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #86A4E4)" }} />
          <Heart size={10} fill="#86A4E4" />
          <span className="h-px w-10" style={{ background: "linear-gradient(270deg, transparent, #86A4E4)" }} />
        </div>
        <p className="mt-2 text-center text-xs" style={{ ...sans, color: "#5A6A8A", letterSpacing: "0.12em" }}>{DATE_LINE}</p>
      </motion.div>
    </div>
  );
}

// ─── Admin: guest QR code + upload gallery ────────────────────────────────────

const PRINT_CSS = `
.qr-print-root{display:none}
@media print{
  @page{margin:16mm}
  body>*:not(.qr-print-root){display:none !important}
  .qr-print-root{display:flex;justify-content:center}
  .qr-print-card{width:150mm;border:1px solid #c9d6ec;border-radius:8mm;padding:14mm 10mm;text-align:center;color:#1F2D4C}
  .qr-print-card img{width:95mm;height:95mm;display:block;margin:7mm auto}
}
`;

export function AdminUploadsPanel() {
  const [qrImage, setQrImage] = useState("");
  const [uploads, setUploads] = useState<GuestUpload[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const loadUploads = async () => {
    setLoading(true);
    const list = await fetchGuestUploads();
    setUploads(list);
    setUrls(await signedUrlsFor(list.map((u) => u.file_path)));
    setLoading(false);
  };

  useEffect(() => {
    QRCode.toDataURL(UPLOAD_LINK, { width: 900, margin: 1, errorCorrectionLevel: "M", color: { dark: "#1F2D4C", light: "#FFFFFF" } }).then(setQrImage);
    loadUploads();
  }, []);

  const flash = (text: string, error = true) => { setMessage({ text, error }); setTimeout(() => setMessage(null), 4000); };

  const downloadQr = () => {
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = "rogie-alyssa-guest-upload-qr.png";
    a.click();
  };

  const copyLink = () => {
    if (!navigator.clipboard) { flash(`Copy this link: ${UPLOAD_LINK}`, false); return; }
    navigator.clipboard.writeText(UPLOAD_LINK).then(() => flash("Link copied", false), () => flash(`Copy this link: ${UPLOAD_LINK}`, false));
  };

  const download = async (u: GuestUpload) => {
    const link = await downloadUrlFor(u);
    if (link) window.location.assign(link);
    else flash("Couldn't prepare the download.");
  };

  const remove = async (u: GuestUpload) => {
    if (!window.confirm("Delete this upload permanently?")) return;
    if (await deleteGuestUpload(u)) setUploads((list) => list.filter((x) => x.id !== u.id));
    else flash("Couldn't delete the upload.");
  };

  const photos = uploads.filter((u) => u.file_type.startsWith("image/")).length;
  const totalSize = uploads.reduce((sum, u) => sum + u.file_size, 0);

  const card = "bg-white rounded-2xl";
  const cardStyle: CSSProperties = { boxShadow: "0 2px 12px rgba(66,117,200,0.1)", border: "1px solid rgba(66,117,200,0.1)" };
  const solid: CSSProperties = { background: "linear-gradient(135deg, #4275C8, #A8C7F1)", color: "white" };
  const ghost: CSSProperties = { background: "transparent", color: "#4275C8", border: "1px solid rgba(66,117,200,0.25)" };

  return (
    <div className="space-y-8">
      <style>{PRINT_CSS}</style>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[["Uploads", uploads.length], ["Photos", photos], ["Videos", uploads.length - photos], ["Storage used", `${formatBytes(totalSize)} of 1 GB`]].map(([label, value]) => (
          <div key={label} className={`${card} p-4`} style={cardStyle}>
            <p className="text-2xl font-light" style={{ ...serif, color: "#4275C8" }}>{value}</p>
            <p className="text-xs" style={{ color: "#6B7C9D" }}>{label}</p>
          </div>
        ))}
      </div>

      {message && <p className="text-sm" style={{ color: message.error ? "#B42318" : "#2E5AA3" }}>{message.text}</p>}

      {/* Guest QR code */}
      <section className={`${card} p-6 flex flex-col sm:flex-row items-center gap-6`} style={cardStyle}>
        <div className="w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(66,117,200,0.15)", background: "#FBFCFE" }}>
          {qrImage && <img src={qrImage} alt="Guest upload QR code" className="w-full h-full" />}
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h2 className="text-lg font-medium" style={{ ...serif, color: "#1F2D4C" }}>Guest Upload QR Code</h2>
          <p className="text-xs mt-1 mb-3" style={{ color: "#6B7C9D" }}>One code for every table. Guests scan it to share their photos and videos with you — no sign-in needed.</p>
          <p className="text-xs mb-4 break-all" style={{ color: "#1F2D4C" }}>{UPLOAD_LINK}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <button type="button" onClick={() => window.print()} disabled={!qrImage} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs disabled:opacity-50" style={solid}><Printer size={12} /> Print card</button>
            <button type="button" onClick={downloadQr} disabled={!qrImage} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs disabled:opacity-50" style={ghost}><Download size={12} /> Download QR</button>
            <button type="button" onClick={copyLink} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs" style={ghost}><Copy size={12} /> Copy link</button>
          </div>
        </div>
      </section>

      {/* Uploads gallery */}
      <section className={`${card} overflow-hidden`} style={cardStyle}>
        <div className="p-5 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(66,117,200,0.1)" }}>
          <h2 className="text-lg font-medium" style={{ ...serif, color: "#1F2D4C" }}>Guest Uploads <span className="text-sm font-normal" style={{ color: "#6B7C9D" }}>({uploads.length})</span></h2>
          <button type="button" onClick={loadUploads} title="Refresh" aria-label="Refresh uploads" className="p-2 rounded-lg" style={{ background: "rgba(66,117,200,0.1)", color: "#4275C8" }}><RefreshCw size={13} className={loading ? "animate-spin" : ""} /></button>
        </div>
        {!loading && uploads.length === 0 ? (
          <p className="py-12 text-center text-sm" style={{ color: "#9BB7E0" }}>No uploads yet. They'll appear here as guests share them.</p>
        ) : (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map((u) => {
              const src = urls[u.file_path];
              const isVideo = u.file_type.startsWith("video/");
              return (
                <figure key={u.id} className="m-0 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(66,117,200,0.12)", background: "#F5F8FD" }}>
                  <div className="aspect-square relative" style={{ background: "#E3EBF6" }}>
                    {src && (isVideo
                      ? <video src={`${src}#t=0.1`} controls preload="metadata" playsInline className="w-full h-full object-cover" />
                      : <a href={src} target="_blank" rel="noreferrer"><img src={src} alt={`Upload from ${u.uploader_name || "a guest"}`} loading="lazy" className="w-full h-full object-cover" /></a>)}
                    {isVideo && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] uppercase" style={{ background: "rgba(31,45,76,0.7)", color: "white", letterSpacing: "0.1em" }}>Video</span>}
                  </div>
                  <figcaption className="p-2.5 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "#1F2D4C" }}>{u.uploader_name || "Guest"}</p>
                      <p className="text-[11px] truncate" style={{ color: "#6B7C9D" }}>{new Date(u.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {formatBytes(u.file_size)}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button type="button" onClick={() => download(u)} title="Download" aria-label="Download" className="p-1.5 rounded-lg" style={{ background: "rgba(66,117,200,0.1)", color: "#4275C8" }}><Download size={12} /></button>
                      <button type="button" onClick={() => remove(u)} title="Delete" aria-label="Delete" className="p-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}><Trash2 size={12} /></button>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </section>

      {createPortal(
        <div className="qr-print-root">
          <div className="qr-print-card">
            <p style={{ ...script, fontSize: 40, margin: 0, color: "#4275C8" }}>Share Your Moments</p>
            <p style={{ ...serif, fontSize: 20, margin: "3mm 0 0" }}>{COUPLE}</p>
            {qrImage && <img src={qrImage} alt="" />}
            <p style={{ ...sans, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0, color: "#5A6A8A" }}>Scan to upload your photos &amp; videos</p>
            <p style={{ ...serif, fontSize: 14, fontStyle: "italic", margin: "3mm 0 0", color: "#5A6A8A" }}>{DATE_LINE}</p>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
