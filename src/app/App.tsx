import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { motion } from "motion/react";
import {
  Play, Pause, Volume2, VolumeX, Music2, ChevronDown,
  MapPin, Clock, Heart, X, Check, ChevronRight, ChevronLeft,
  Calendar, Users, Star, Search, Filter, Download, Trash2,
  CheckCircle, XCircle, Clock3, LayoutDashboard, LogOut, Eye,
  Mail, UserCheck, UserX, RefreshCw, User,
} from "lucide-react";
import { fetchRsvps, createRsvp, updateRsvpStatus, deleteRsvp as deleteRsvpDb, markAsInvited } from "../lib/database";
// ─── Constants ────────────────────────────────────────────────────────────────

const WEDDING_DATE = new Date("2026-11-28T16:00:00");
const BRIDE = "Alyssa Camille";
const GROOM = "Rogimer";
const DATE_DISPLAY = "Saturday, November 28, 2026";
const GUEST_NAME = "Dearest Guest";
const ADMIN_PASSWORD = "GieroAC22";

const MUSIC_URL = "/music/Worththewait.mp3";
const HERO_IMG = "/images/bg_image.JPG";

interface GalleryItem {
  url: string;
  alt: string;
  span: string;
}

const GALLERY: GalleryItem[] = [
  { url: "/images/1a.jpg", alt: "Couple portrait", span: "lg:col-span-2 lg:row-span-2" },
  { url: "/images/4a.JPG", alt: "Smiling guests", span: "lg:col-span-1 lg:row-span-1" },
  { url: "/images/5a.JPG", alt: "Ceremony moment", span: "lg:col-span-1 lg:row-span-1" },
  { url: "/images/5b.JPG", alt: "Ceremony moment", span: "lg:col-span-1 lg:row-span-1" },
  { url: "/images/2a.JPG", alt: "Reception scene", span: "lg:col-span-1 lg:row-span-1" },
  { url: "/images/3b.jpg", alt: "Wedding invitation", span: "lg:col-span-1 lg:row-span-1" },
  { url: "/images/6a.JPG", alt: "Couple close-up", span: "lg:col-span-2 lg:row-span-2" },
  { url: "/images/7a.JPG", alt: "Wedding venue", span: "lg:col-span-1 lg:row-span-1" },
  { url: "/images/8a.JPG", alt: "Wedding details", span: "lg:col-span-1 lg:row-span-1" },
];

const PRINCIPAL_SPONSORS = [
  { mr: "Mr. Gerry D. Paule", mrs: "Mrs. Aline D. Paule", role: "Principal Sponsors" },
  { mr: "Mr. John David S. Supsupin", mrs: "Mrs. Joyce J. Supsupin", role: "Principal Sponsors" },
  { mr: "Mr. Ireneo D. Centeno III", mrs: "Mrs. Susan Centeno", role: "Principal Sponsors" },
  { mr: "Mr. Ireneo R. Baldovino", mrs: "Mrs. Shirley A. Corsiga", role: "Principal Sponsors" },
  { mr: "Mr. Rommel T. Gadaza", mrs: "Mrs. Melinda R. Gadaza", role: "Principal Sponsors" },
  { mr: "Mr. Ariel D. Añonuevo", mrs: "Mrs. Amor A. Ceblano", role: "Principal Sponsors" },
  { mr: "Mr. Camilo B. Acerdano", mrs: "Mrs. Maria Sirikit D. Wallace", role: "Principal Sponsors" },
];
const WEDDING_PARTY = [
  { name: "Kevin Clester B. Arjona", role: "Best Man" },
  { name: "Sarah P. Amatorio", role: "Maid of Honor" },
  { name: "Edchelle F. Navarra", role: "Matron of Honor" },
  { name: "Megan Yumi C. Tacaca", role: "Junior Bridesmaid" },
  { name: "Dianne Louise R. Argamino", role: "Bridesmaid" },
  { name: "Heinz Rainer A. Placente", role: "Groomsmen" },
  { name: "Jedmac L. Santos", role: "Groomsmen" },
];

const SECONDARY_SPONSORS = [
  { label: "Candle Sponsors", names: ["Mark Laurence A. Lat", "Marinelle R. Silvania"] },
  { label: "Cord Sponsors", names: ["Roberto O. Ubatay Jr.", "Abigael D. Subiela"] },
  { label: "Veil Sponsors", names: ["Mark Leynard D. Villaran", "Kendall Jeane J. Puno"] },
  { label: "Ring Bearer", names: ["Lucas Tyler C. Delos Santos"] },
  { label: "Coin Bearer", names: ["Aiden Ray U. Aguinaldo"] },
  { label: "Bible Bearer", names: ["Alonzo Rosh U. Aguinaldo"] },
  { label: "Veil Bearer", names: ["John Kenjie D. Ella"] },
  { label: "Flower Maidens", names: ["Cassielle Joy T. Cabardo", "Bea Yzabel C. Delos Santos", "Angelica Diane R. Gadaza", "Alyssa Rommela R. Gadaza", "Michelle Angela C. Urriza"] },
];


// ─── Mock RSVP Data ───────────────────────────────────────────────────────────

type RsvpStatus = "confirmed" | "pending" | "declined";
interface RsvpEntry {
  id: number; name: string; email: string; attending: string;
  guests: string; meal: string; message: string;
  status: RsvpStatus; submittedAt: string;
  invited?: boolean;
}

// ─── Shared Helpers ───────────────────────────────────────────────────────────

function GlassCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 32px rgba(66,117,200,0.15)", ...style }}>
      {children}
    </div>
  );
}

function BowTieIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 7.5L8.5 12L3 16.5V7.5Z" />
      <path d="M21 7.5L15.5 12L21 16.5V7.5Z" />
      <path d="M8.5 12L12 9L15.5 12" />
      <path d="M8.5 12L12 15L15.5 12" />
      <path d="M12 9.5L12 14.5" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 17L7 8.5L10 13L13 7.5L17 14L21 7.5V17H3Z" />
      <path d="M3 17H21" />
      <path d="M7 17V19H17V17" />
    </svg>
  );
}

function RingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="14" r="5" />
      <path d="M9 10L10.5 7.5L12 6L13.5 7.5L15 10" />
      <path d="M8 6.5L9.5 8" />
    </svg>
  );
}

function ChampagneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M8 2H16L18 8.5H6L8 2Z" />
      <path d="M9 8.5V19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19V8.5" />
      <path d="M9 12H15" />
      <path d="M10.5 4.5L11.5 6" />
      <path d="M13.5 4.5L12.5 6" />
    </svg>
  );
}

function FlowerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 3.5C10.5 3.5 9.2 4.4 8.7 5.7C7.4 5.8 6.2 6.6 5.6 7.8C4.8 9.4 5.3 11.3 6.6 12.3C6.4 12.8 6.3 13.3 6.3 13.9C6.3 15.8 7.7 17.4 9.5 17.6V21H14.5V17.6C16.3 17.4 17.7 15.8 17.7 13.9C17.7 13.3 17.6 12.8 17.4 12.3C18.7 11.3 19.2 9.4 18.4 7.8C17.8 6.6 16.6 5.8 15.3 5.7C14.8 4.4 13.5 3.5 12 3.5Z" />
      <path d="M12 7.5V11.5" />
      <path d="M10 9.5L14 9.5" />
      <path d="M9 15.5L11 11.5" />
      <path d="M15 15.5L13 11.5" />
      <path d="M11 21V14" />
    </svg>
  );
}

function CandleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10 2L10 4" />
      <path d="M14 2L14 4" />
      <path d="M10 4H14V8C14 12 12 15 12 18H10C10 15 8 12 8 8V4H10Z" />
      <path d="M11 2.5C11 1.67157 11.6716 1 12.5 1C13.3284 1 14 1.67157 14 2.5" />
      <path d="M11 2.5L13 2.5" />
    </svg>
  );
}

function CordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 8L12 3L21 8" />
      <path d="M3 16L12 21L21 16" />
      <path d="M12 3V21" />
      <path d="M3 8V16" />
      <path d="M21 8V16" />
    </svg>
  );
}

function VeilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2C12 2 6 4 6 8C6 12 12 18 12 18C12 18 18 12 18 8C18 4 12 2 12 2" />
      <path d="M12 2L18 8" />
      <path d="M12 2L6 8" />
      <path d="M8 10L16 10" />
      <path d="M8 14L16 14" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12L16 12" />
      <path d="M12 8L12 16" />
      <path d="M9 10L15 14" />
    </svg>
  );
}

function BibleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 4H20V20H4Z" />
      <path d="M6 4V20" />
      <path d="M18 4V20" />
      <path d="M8 8H16" />
      <path d="M8 12H14" />
      <path d="M8 16H12" />
      <path d="M12 2V4" />
    </svg>
  );
}

function SectionHeader({ script, title, subtitle }: { script?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      {script && (
        <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-4xl mb-2" style={{ fontFamily: "'Great Vibes', cursive", color: "#4275C8" }}>
          {script}
        </motion.p>
      )}
      <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl font-light tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>
        {title}
      </motion.h2>
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #86A4E4)" }} />
        <Heart size={10} fill="#86A4E4" style={{ color: "#86A4E4" }} />
        <div className="h-px w-12" style={{ background: "linear-gradient(270deg, transparent, #86A4E4)" }} />
      </div>
      {subtitle && (
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#6B7C9D", fontStyle: "italic" }}>
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────

function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: `${(i * 5.5 + 3) % 100}%`,
    size: i % 3 === 0 ? 6 : i % 3 === 1 ? 4 : 3,
    delay: (i * 0.7) % 6, duration: 8 + (i % 5) * 2,
    opacity: 0.12 + (i % 4) * 0.06,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`@keyframes fallPetal{0%{transform:translateY(-10vh) rotate(0deg);opacity:0}10%{opacity:1}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}`}</style>
      {particles.map((p) => (
        <div key={p.id} style={{ position: "absolute", left: p.left, top: `-${p.delay * 8 + 10}vh`, width: `${p.size * 4 + 8}px`, height: `${p.size * 6 + 14}px`, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: p.id % 2 === 0 ? "linear-gradient(135deg, rgba(158, 181, 206, 0.95), rgba(118, 142, 175, 0.9))" : "linear-gradient(135deg, rgba(193, 204, 221, 0.95), rgba(145, 165, 191, 0.85))", opacity: p.opacity, transform: `rotate(${p.id * 20}deg)`, animation: `fallPetal ${p.duration}s ${p.delay}s infinite linear` }} />
      ))}
    </div>
  );
}

// ─── Music Player ─────────────────────────────────────────────────────────────

function MusicPlayer({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    setPlaying(!el.paused);
    setMuted(el.muted);
    return () => { el.removeEventListener("timeupdate", onTime); el.removeEventListener("play", onPlay); el.removeEventListener("pause", onPause); };
  }, [audioRef]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play().catch(() => setPlaying(false));
    }
  };

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    const nextMuted = !muted;
    el.muted = nextMuted;
    setMuted(nextMuted);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="fixed bottom-6 right-6 z-50">
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 8px 32px rgba(66,117,200,0.25)" }}>
        {!minimized ? (
          <div className="p-4 w-64">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                  <Music2 size={14} style={{ color: "#4275C8" }} />
                </motion.div>
                <div>
                  <p className="text-xs font-semibold" style={{ fontFamily: "'Montserrat', sans-serif", color: "#1F2D4C", lineHeight: 1.2 }}>Worth the Wait</p>
                </div>
              </div>
              <button onClick={() => setMinimized(true)} style={{ color: "#6B7C9D", fontSize: 16, lineHeight: 1 }}>—</button>
            </div>
            <div className="h-1 rounded-full mb-3 overflow-hidden" style={{ background: "rgba(66,117,200,0.18)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #4275C8, #86A4E4)" }} />
            </div>
            <div className="flex items-center justify-between">
              <button onClick={toggleMute} className="p-1 rounded-full transition-colors" style={{ background: "rgba(255,255,255,0.3)" }}>
                {muted ? <VolumeX size={14} style={{ color: "#6B7C9D" }} /> : <Volume2 size={14} style={{ color: "#4275C8" }} />}
              </button>
              <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4275C8, #A8C7F1)" }}>
                {playing ? <Pause size={12} color="white" /> : <Play size={12} color="white" />}
              </button>
              <div className="w-6" />
            </div>
          </div>
        ) : (
          <button onClick={() => setMinimized(false)} className="p-3 flex items-center gap-2">
            <motion.div animate={playing ? { rotate: 360 } : {}} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Music2 size={16} style={{ color: "#4275C8" }} />
            </motion.div>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown() {
  const calc = () => {
    const diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => { const id = setInterval(() => setTime(calc()), 1000); return () => clearInterval(id); }, []);
  return time;
}

function CountdownCard({ value, label }: { value: number; label: string }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} className="flex flex-col items-center px-6 py-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 24px rgba(66,117,200,0.18)", minWidth: 90 }}>
      <span className="text-5xl font-light tabular-nums" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4275C8", lineHeight: 1 }}>{String(value).padStart(2, "0")}</span>
      <span className="mt-2 text-xs tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>{label}</span>
    </motion.div>
  );
}

// ─── Opening Screen ───────────────────────────────────────────────────────────

function OpeningScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E8F2FF 0%, #D8E1EB 35%, #A8C7F1 70%, #4275C8 100%)" }}>
      <Particles />
      {["top-4 left-4", "top-4 right-4 rotate-90", "bottom-4 right-4 rotate-180", "bottom-4 left-4 -rotate-90"].map((pos, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} className={`absolute ${pos} w-20 h-20 pointer-events-none`}>
          <svg viewBox="0 0 80 80" fill="none">
            <path d="M4 4 Q4 40 40 40 Q4 40 4 76" stroke="rgba(66,117,200,0.5)" strokeWidth="1" fill="none" />
            <path d="M4 4 Q40 4 40 40 Q40 4 76 4" stroke="rgba(66,117,200,0.4)" strokeWidth="1" fill="none" />
            <circle cx="4" cy="4" r="3" fill="rgba(66,117,200,0.55)" />
          </svg>
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} className="relative z-10 w-full max-w-md mx-6 text-center px-10 py-14 rounded-3xl" style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.75)", boxShadow: "0 16px 64px rgba(66,117,200,0.3)" }}>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="h-px w-16 mx-auto mb-6" style={{ background: "linear-gradient(90deg, transparent, #86A4E4, transparent)" }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }} className="text-sm tracking-widest uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>{GUEST_NAME}</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.8 }} className="text-base mb-6 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", fontStyle: "italic" }}>
          Together with our families,<br />we invite you to celebrate<br />our wedding day.
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.9 }} className="text-5xl mb-6" style={{ fontFamily: "'Great Vibes', cursive", color: "#1F2D4C" }}>{GROOM}</motion.h1>
    
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }} className="text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4275C8", letterSpacing: "0.2em" }}>&amp;</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.9 }} className="text-5xl mb-2" style={{ fontFamily: "'Great Vibes', cursive", color: "#1F2D4C" }}>{BRIDE}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.6 }} className="text-sm mb-8 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>{DATE_DISPLAY}</motion.p>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.35, duration: 0.8 }} className="h-px w-16 mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #86A4E4, transparent)" }} />
        <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.7 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onOpen} className="px-10 py-3 rounded-full text-sm uppercase transition-all" style={{ fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(135deg, #4275C8, #A8C7F1)", color: "white", boxShadow: "0 4px 20px rgba(66,117,200,0.4)", letterSpacing: "0.15em" }}>
          Open Invitation
        </motion.button>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="mt-6">
          <Heart size={14} fill="#86A4E4" style={{ color: "#86A4E4", margin: "0 auto" }} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Gallery", "Ceremony", "Sponsors", "Attire", "RSVP"];
function NavBar({ onAdminClick }: { onAdminClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-8 py-4 transition-all" style={{ background: scrolled ? "rgba(250,249,247,0.85)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid rgba(66,117,200,0.2)" : "none" }}>
      <p className="text-2xl" style={{ fontFamily: "'Great Vibes', cursive", color: "#1F2D4C" }}>R &amp; A</p>
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} className="text-xs tracking-widest uppercase transition-colors hover:opacity-70" style={{ fontFamily: "'Montserrat', sans-serif", color: "#1F2D4C" }}>{link}</a>
        ))}
        <button onClick={onAdminClick} className="flex items-center gap-1.5 text-xs tracking-widest uppercase transition-all hover:opacity-70 px-3 py-1.5 rounded-full" style={{ fontFamily: "'Montserrat', sans-serif", color: "#4275C8", border: "1px solid rgba(66,117,200,0.35)" }}>
          <LayoutDashboard size={11} /> Admin
        </button>
      </div>
    </motion.nav>
  );
}

// ─── RSVP Form ────────────────────────────────────────────────────────────────

function RSVPForm({ onSubmit, registeredEmails }: { onSubmit: (entry: Omit<RsvpEntry, "id" | "status" | "submittedAt">) => void; registeredEmails: string[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: "", attending: "" });
  const [error, setError] = useState("");
  const update = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); if (error) setError(""); };

  const inputStyle: CSSProperties = { width: "100%", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(66,117,200,0.3)", borderRadius: 12, padding: "12px 16px", fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "#1F2D4C", outline: "none" };
  const labelStyle: CSSProperties = { display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7C9D", marginBottom: 6 };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = () => {
    const email = form.email.trim().toLowerCase();
    if (!validateEmail(email)) {
      setError("Please enter a valid registered email address.");
      return;
    }
    if (!form.attending) {
      setError("Please choose whether you are attending.");
      return;
    }
    if (registeredEmails.length > 0 && !registeredEmails.includes(email)) {
      setError("Please enter the email address registered for your invitation.");
      return;
    }

    onSubmit({ name: "", email, attending: form.attending, guests: "1", meal: "", message: "" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #4275C8, #A8C7F1)" }}>
          <Check size={28} color="white" />
        </motion.div>
        <h3 className="text-3xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>Thank You!</h3>
        <p className="text-sm" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>Your RSVP has been recorded. A confirmation will be sent to {form.email}.</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-sm" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
          Please enter the email address registered for your invitation, then choose whether you are attending.
        </p>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div>
          <label style={labelStyle}>Registered Email Address</label>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="maria@example.com" />
        </div>
        <div>
          <label style={labelStyle}>Will you be attending?</label>
          <div className="flex gap-3 flex-col sm:flex-row">
            {["Joyfully accepts", "Regretfully declines"].map((opt) => (
              <button key={opt} onClick={() => update("attending", opt)} className="flex-1 py-3 rounded-xl text-xs transition-all" style={{ fontFamily: "'Montserrat', sans-serif", background: form.attending === opt ? "linear-gradient(135deg, #4275C8, #A8C7F1)" : "rgba(255,255,255,0.5)", border: form.attending === opt ? "none" : "1px solid rgba(66,117,200,0.3)", color: form.attending === opt ? "white" : "#6B7C9D" }}>{opt}</button>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-red-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>{error}</p>}
      </motion.div>
      <div className="flex justify-end mt-8">
        <button onClick={handleSubmit} className="px-8 py-3 rounded-full text-xs transition-all hover:scale-105" style={{ fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(135deg, #4275C8, #A8C7F1)", color: "white", boxShadow: "0 4px 16px rgba(66,117,200,0.35)" }}>
          Submit RSVP
        </button>
      </div>
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────

function AdminLogin({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const submit = () => { if (pw === ADMIN_PASSWORD) { onLogin(); } else { setError(true); setTimeout(() => setError(false), 2000); } };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(47,54,64,0.7)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-sm mx-6 p-8 rounded-3xl relative" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 24px 64px rgba(47,54,64,0.2)" }}>
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.1)" }}>
          <X size={14} style={{ color: "#6B7C9D" }} />
        </button>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "linear-gradient(135deg, #4275C8, #A8C7F1)" }}>
            <LayoutDashboard size={20} color="white" />
          </div>
          <h2 className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>Wedding Admin</h2>
          <p className="text-xs mt-1" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>{GROOM} & {BRIDE}</p>
          <p className="text-xs mt-2" style={{ fontFamily: "'Montserrat', sans-serif", color: "#9BB7E0" }}>Enter password to manage RSVPs</p>
        </div>
        <input
          type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl mb-3 text-sm outline-none transition-all"
          style={{ fontFamily: "'Montserrat', sans-serif", background: error ? "rgba(212,24,61,0.06)" : "rgba(66,117,200,0.08)", border: error ? "1px solid rgba(212,24,61,0.4)" : "1px solid rgba(66,117,200,0.2)", color: "#1F2D4C" }}
        />
        {error && <p className="text-xs text-center mb-3" style={{ color: "#d4183d", fontFamily: "'Montserrat', sans-serif" }}>Incorrect password. Try again.</p>}
        <button onClick={submit} className="w-full py-3 rounded-xl text-sm transition-all hover:scale-[1.02]" style={{ fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(135deg, #4275C8, #A8C7F1)", color: "white", boxShadow: "0 4px 16px rgba(66,117,200,0.3)" }}>
          Sign In
        </button>
      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ rsvps, onUpdate, onDelete, onInvite, onClose }: {
  rsvps: RsvpEntry[];
  onUpdate: (id: number, status: RsvpStatus) => void;
  onDelete: (id: number) => void;
  onInvite: (payload: { email: string; name: string }) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | RsvpStatus>("all");
  const [selected, setSelected] = useState<RsvpEntry | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status" | "guests" | "invited">("status");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const attending = rsvps.filter((r) => r.attending === "Joyfully accepts");
  const totalGuests = attending.reduce((sum, r) => sum + parseInt(r.guests || "0"), 0);
  const confirmed = rsvps.filter((r) => r.status === "confirmed").length;
  const pending = rsvps.filter((r) => r.status === "pending").length;
  const declined = rsvps.filter((r) => r.status === "declined").length;
  const invitedCount = rsvps.filter((r) => r.invited).length;

  const filtered = rsvps
    .filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || r.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortBy === "name") return a.name.localeCompare(b.name) * direction;
      if (sortBy === "status") return a.status.localeCompare(b.status) * direction;
      if (sortBy === "guests") return (parseInt(a.guests || "0") - parseInt(b.guests || "0")) * direction;
      if (sortBy === "invited") return (Number(a.invited) - Number(b.invited)) * direction;
      return 0;
    });

  const handleInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    const name = inviteName.trim();
    if (!email) {
      setInviteMessage("Enter an email address to invite.");
      return;
    }
    onInvite({ email, name });
    setInviteEmail("");
    setInviteName("");
    setInviteMessage(`Invitation sent to ${name || email}`);
    setTimeout(() => setInviteMessage(""), 5000);
  };

  const statusBadge = (status: RsvpStatus) => {
    const map: Record<RsvpStatus, { bg: string; color: string; label: string }> = {
      confirmed: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", label: "Confirmed" },
      pending:   { bg: "rgba(245,158,11,0.12)", color: "#d97706", label: "Pending" },
      declined:  { bg: "rgba(239,68,68,0.12)",  color: "#dc2626", label: "Declined" },
    };
    const s = map[status];
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ fontFamily: "'Montserrat', sans-serif", background: s.bg, color: s.color }}>{s.label}</span>;
  };

  const statCards = [
    { label: "Total RSVPs", value: rsvps.length, icon: <Users size={18} style={{ color: "#4275C8" }} />, color: "#4275C8" },
    { label: "Total Guests", value: totalGuests, icon: <UserCheck size={18} style={{ color: "#86A4E4" }} />, color: "#86A4E4" },
    { label: "Invited", value: invitedCount, icon: <Mail size={18} style={{ color: "#4275C8" }} />, color: "#4275C8" },
    { label: "Confirmed", value: confirmed, icon: <CheckCircle size={18} style={{ color: "#16a34a" }} />, color: "#16a34a" },
    { label: "Pending", value: pending, icon: <Clock3 size={18} style={{ color: "#d97706" }} />, color: "#d97706" },
    { label: "Declined", value: declined, icon: <UserX size={18} style={{ color: "#dc2626" }} />, color: "#dc2626" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "#EBF4FF", fontFamily: "'Montserrat', sans-serif" }}>
      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-60 flex items-center justify-center" style={{ background: "rgba(47,54,64,0.6)", backdropFilter: "blur(6px)", zIndex: 60 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-6 p-7 rounded-3xl relative" style={{ background: "white", boxShadow: "0 24px 64px rgba(47,54,64,0.18)" }}>
            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.1)" }}>
              <X size={14} style={{ color: "#6B7C9D" }} />
            </button>
            <h3 className="text-2xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>{selected.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <Mail size={12} style={{ color: "#6B7C9D" }} />
              <span className="text-xs" style={{ color: "#6B7C9D" }}>{selected.email}</span>
              <span className="ml-2">{statusBadge(selected.status)}</span>
            </div>
            <div className="space-y-2 mb-5 text-sm" style={{ color: "#1F2D4C" }}>
              {[
                ["Attending", selected.attending],
                ["Guests", selected.guests],
                ["Meal", selected.meal || "—"],
                ["Submitted", selected.submittedAt],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(66,117,200,0.12)" }}>
                  <span style={{ color: "#6B7C9D", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              {selected.message && (
                <div className="pt-2">
                  <p className="text-xs uppercase mb-1" style={{ color: "#6B7C9D", letterSpacing: "0.08em" }}>Message</p>
                  <p className="text-sm italic p-3 rounded-xl" style={{ background: "rgba(66,117,200,0.06)", color: "#1F2D4C" }}>"{selected.message}"</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {(["confirmed", "pending", "declined"] as RsvpStatus[]).map((s) => (
                <button key={s} onClick={() => { onUpdate(selected.id, s); setSelected({ ...selected, status: s }); }} className="flex-1 py-2 rounded-xl text-xs capitalize transition-all" style={{ background: selected.status === s ? "linear-gradient(135deg, #4275C8, #A8C7F1)" : "rgba(66,117,200,0.08)", color: selected.status === s ? "white" : "#6B7C9D", border: selected.status === s ? "none" : "1px solid rgba(66,117,200,0.2)" }}>{s}</button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between" style={{ background: "rgba(245,247,250,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(66,117,200,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4275C8, #A8C7F1)" }}>
            <LayoutDashboard size={16} color="white" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#1F2D4C" }}>Admin Dashboard</p>
            <p className="text-xs" style={{ color: "#6B7C9D" }}>Rogimer &amp; Alyssa Camille — November 28, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80" style={{ background: "rgba(66,117,200,0.12)", color: "#86A4E4", border: "1px solid rgba(66,117,200,0.25)" }}>
            <Download size={12} /> Export CSV
          </button>
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80" style={{ background: "rgba(66,117,200,0.1)", color: "#4275C8", border: "1px solid rgba(66,117,200,0.2)" }}>
            <LogOut size={12} /> Exit
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stat cards */}
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-4 flex flex-col gap-2" style={{ boxShadow: "0 2px 12px rgba(66,117,200,0.1)", border: "1px solid rgba(66,117,200,0.1)" }}>
              <div className="flex items-center justify-between">
                {s.icon}
                <span className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: s.color }}>{s.value}</span>
              </div>
              <p className="text-xs" style={{ color: "#6B7C9D" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* RSVP Table */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(66,117,200,0.1)", border: "1px solid rgba(66,117,200,0.1)" }}>
          {/* Table toolbar */}
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(66,117,200,0.1)" }}>
            <h2 className="text-lg font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>RSVP Responses <span className="text-sm font-normal" style={{ color: "#6B7C9D" }}>({filtered.length})</span></h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7C9D" }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email…" className="pl-8 pr-4 py-2 rounded-lg text-xs outline-none w-full" style={{ background: "rgba(66,117,200,0.06)", border: "1px solid rgba(66,117,200,0.18)", color: "#1F2D4C", fontFamily: "'Montserrat', sans-serif" }} />
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <Filter size={12} style={{ color: "#6B7C9D" }} />
                {(["all", "confirmed", "pending", "declined"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs capitalize transition-all" style={{ background: filter === f ? "linear-gradient(135deg, #4275C8, #A8C7F1)" : "transparent", color: filter === f ? "white" : "#6B7C9D", border: filter === f ? "none" : "1px solid rgba(66,117,200,0.2)" }}>{f}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5 border-b border-[rgba(66,117,200,0.08)] bg-slate-50">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex flex-col gap-3 flex-1 min-w-[220px]">
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7C9D" }} />
                  <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Guest name (optional)" className="pl-10 pr-4 py-3 rounded-2xl w-full text-xs outline-none" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(66,117,200,0.16)", color: "#1F2D4C", fontFamily: "'Montserrat', sans-serif" }} />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7C9D" }} />
                  <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Enter email address to invite" className="pl-10 pr-4 py-3 rounded-2xl w-full text-xs outline-none" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(66,117,200,0.16)", color: "#1F2D4C", fontFamily: "'Montserrat', sans-serif" }} />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={handleInvite} className="px-4 py-3 rounded-2xl text-xs uppercase tracking-[0.18em] transition-all" style={{ background: "linear-gradient(135deg, #4275C8, #A8C7F1)", color: "white", border: "none" }}>Send Invite</button>
                <span className="text-xs text-[#6B7C9D]">Invited: <strong>{invitedCount}</strong></span>
              </div>
            </div>
            {inviteMessage && <p className="mt-3 text-sm" style={{ color: "#4275C8", fontFamily: "'Montserrat', sans-serif" }}>{inviteMessage}</p>}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(66,117,200,0.1)" }}>
                  {["Guest", "Email", "Attending", "Guests", "Meal", "Submitted", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider" style={{ color: "#6B7C9D", fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12" style={{ color: "#9BB7E0", fontFamily: "'Montserrat', sans-serif", fontSize: 13 }}>No responses found.</td></tr>
                )}
                {filtered.map((r, i) => (
                  <tr key={r.id} className="transition-colors hover:bg-[rgba(66,117,200,0.04)]" style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(66,117,200,0.07)" : "none" }}>
                    <td className="px-5 py-3.5 font-medium" style={{ color: "#1F2D4C" }}>{r.name}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#6B7C9D" }}>{r.email}</td>
                    <td className="px-5 py-3.5">
                      {r.attending === "Joyfully accepts" ? (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#16a34a" }}><CheckCircle size={12} /> Accepts</span>
                      ) : r.attending === "Regretfully declines" ? (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#dc2626" }}><XCircle size={12} /> Declines</span>
                      ) : (
                        <span className="text-xs" style={{ color: "#6B7C9D" }}>{r.attending || "Pending"}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center" style={{ color: "#1F2D4C" }}>{r.guests}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#6B7C9D" }}>{r.meal || "—"}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#6B7C9D" }}>{r.submittedAt}</td>
                    <td className="px-5 py-3.5">{statusBadge(r.status)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setSelected(r)} className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ background: "rgba(66,117,200,0.1)", color: "#4275C8" }} title="View details">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => onUpdate(r.id, r.status === "confirmed" ? "pending" : "confirmed")} className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }} title="Toggle confirm">
                          <RefreshCw size={13} />
                        </button>
                        <button onClick={() => onDelete(r.id)} className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                        <button onClick={() => onInvite({ email: r.email, name: r.name })} className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ background: "rgba(66,117,200,0.1)", color: "#4275C8" }} title="Send invite">
                          <Mail size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

       
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [opened, setOpened] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown();

  // Load RSVPs from Supabase on mount
  useEffect(() => {
    const loadRsvps = async () => {
      try {
        setLoading(true);
        const data = await fetchRsvps();
        // Convert database format to app format
        const formatted = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          attending: r.attending || "",
          guests: r.guests || "1",
          meal: r.meal || "",
          message: r.message || "",
          status: r.status || "pending",
          submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          invited: r.invited || false,
        }));
        setRsvps(formatted);
        setError(null);
      } catch (err) {
        console.error("Failed to load RSVPs from Supabase:", err);
        setError("Could not load RSVPs. Using local storage fallback.");
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem("wedding_rsvps");
          setRsvps(saved ? JSON.parse(saved) : []);
        } catch (fallbackErr) {
          console.error("Fallback loading failed:", fallbackErr);
          setRsvps([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRsvps();
  }, []);

  // Save RSVPs to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem("wedding_rsvps", JSON.stringify(rsvps));
    } catch (err) {
      console.error("Failed to save RSVPs to local storage:", err);
    }
  }, [rsvps]);

  // Play immediately on user gesture (Open Invitation click)
  const handleOpen = () => {
    setOpened(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Fade in volume
            let vol = 0;
            const fade = setInterval(() => {
              vol = Math.min(vol + 0.05, 0.7);
              if (audioRef.current) audioRef.current.volume = vol;
              if (vol >= 0.7) clearInterval(fade);
            }, 150);
          })
          .catch((err) => {
            console.error("Audio play failed:", err);
          });
      }
    }
  };

  const addRsvp = async (entry: Omit<RsvpEntry, "id" | "status" | "submittedAt">) => {
    const normalizedEmail = entry.email.trim().toLowerCase();
    try {
      const existing = rsvps.find((r) => r.email.trim().toLowerCase() === normalizedEmail);
      
      const dbEntry = {
        name: entry.name || normalizedEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        email: normalizedEmail,
        attending: entry.attending,
        guests: entry.guests || "1",
        meal: entry.meal || "",
        message: entry.message || "",
        status: "pending" as RsvpStatus,
        submitted_at: new Date().toISOString(),
        invited: entry.invited || false,
      };

      if (existing) {
        // Update existing
        await updateRsvpStatus(existing.id, "pending");
        setRsvps((prev) =>
          prev.map((r) =>
            r.email.trim().toLowerCase() === normalizedEmail
              ? { ...r, ...entry, status: "pending", submittedAt: new Date().toISOString().slice(0, 10) }
              : r
          )
        );
      } else {
        // Create new
        const result = await createRsvp(dbEntry);
        if (result) {
          const newEntry: RsvpEntry = {
            id: result.id,
            name: result.name,
            email: result.email,
            attending: result.attending,
            guests: result.guests,
            meal: result.meal,
            message: result.message,
            status: result.status as RsvpStatus,
            submittedAt: new Date(result.submitted_at).toISOString().slice(0, 10),
            invited: result.invited,
          };
          setRsvps((prev) => [newEntry, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to add RSVP:", err);
      // Fallback to local update
      setRsvps((prev) => {
        const existing = prev.find((r) => r.email.trim().toLowerCase() === normalizedEmail);
        const baseEntry: RsvpEntry = {
          ...entry,
          name: entry.name || normalizedEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
          email: normalizedEmail,
          guests: entry.guests || "1",
          meal: entry.meal || "",
          message: entry.message || "",
          id: existing ? existing.id : Date.now(),
          status: "pending",
          submittedAt: new Date().toISOString().slice(0, 10),
        };
        if (existing) {
          return prev.map((r) => r.email.trim().toLowerCase() === normalizedEmail ? { ...r, ...baseEntry, status: "pending" } : r);
        }
        return [baseEntry, ...prev];
      });
    }
  };

  const inviteGuest = async (email: string, name?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const guestName = (name || "").trim() || normalizedEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    if (!normalizedEmail) return;

    try {
      const existing = rsvps.find((r) => r.email.trim().toLowerCase() === normalizedEmail);
      
      if (existing) {
        // Send email invitation
        const inviteResult = await markAsInvited(existing.id, normalizedEmail, guestName);
        if (inviteResult.success) {
          setRsvps((prev) =>
            prev.map((r) =>
              r.email.trim().toLowerCase() === normalizedEmail
                ? { ...r, name: guestName, invited: true, message: "Invitation resent by admin", status: "pending" }
                : r
            )
          );
        } else {
          console.error("Email failed to send", inviteResult.error);
          setError(
            inviteResult.error
              ? `Email invitation failed to send: ${inviteResult.error}`
              : "Email invitation failed to send. Please check the email address and email service configuration."
          );
        }
      } else {
        // Create new guest and send invitation
        const result = await createRsvp({
          name: guestName,
          email: normalizedEmail,
          attending: "",
          guests: "1",
          meal: "",
          message: "Invitation sent by admin",
          status: "pending",
          submitted_at: new Date().toISOString(),
          invited: true,
        });

        if (result) {
          // Send email after creating entry
          const inviteResult = await markAsInvited(result.id, normalizedEmail, guestName);
          const newEntry: RsvpEntry = {
            id: result.id,
            name: result.name,
            email: result.email,
            attending: result.attending,
            guests: result.guests,
            meal: result.meal,
            message: result.message,
            status: result.status as RsvpStatus,
            submittedAt: new Date(result.submitted_at).toISOString().slice(0, 10),
            invited: inviteResult.success,
          };
          setRsvps((prev) => [newEntry, ...prev]);

          if (!inviteResult.success) {
            console.error("Email failed to send", inviteResult.error);
            setError(
              inviteResult.error
                ? `Email invitation failed to send: ${inviteResult.error}`
                : "Email invitation failed to send. Please check the email address and email service configuration."
            );
          }
        }
      }
    } catch (err) {
      console.error("Failed to invite guest:", err);
      // Fallback
      setRsvps((prev) => {
        const existing = prev.find((r) => r.email.trim().toLowerCase() === normalizedEmail);
        if (existing) {
          return prev.map((r) =>
            r.email.trim().toLowerCase() === normalizedEmail
              ? { ...r, name: guestName, invited: true, message: "Invitation resent by admin", status: "pending" }
              : r
          );
        }
        return [
          {
            id: Date.now(),
            name: guestName,
            email: normalizedEmail,
            attending: "",
            guests: "1",
            meal: "",
            message: "Invitation sent by admin",
            status: "pending",
            submittedAt: new Date().toISOString().slice(0, 10),
            invited: true,
          },
          ...prev,
        ];
      });
    }
  };

  const updateRsvp = async (id: number, status: RsvpStatus) => {
    try {
      const success = await updateRsvpStatus(id, status);
      if (success) {
        setRsvps((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      }
    } catch (err) {
      console.error("Failed to update RSVP:", err);
      // Fallback
      setRsvps((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    }
  };

  const deleteRsvp = async (id: number) => {
    try {
      const success = await deleteRsvpDb(id);
      if (success) {
        setRsvps((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete RSVP:", err);
      // Fallback
      setRsvps((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(160deg, #eef5ff 0%, #dfe8fa 40%, #c8d9f5 100%)", fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`html{scroll-behavior:smooth}::-webkit-scrollbar{width:0}*{scrollbar-width:none}@keyframes shimmer{0%,100%{opacity:.4}50%{opacity:1}}`}</style>

      {/* Audio always in DOM so play() can be called synchronously on user gesture */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        onError={(e) => console.error("Audio load error:", e)}
        onLoadedMetadata={() => console.log("Audio metadata loaded")}
      >
        <source
            src={MUSIC_URL}
            type="audio/mpeg"
        />
      </audio>

      {!opened && <OpeningScreen onOpen={handleOpen} />}

      {showAdminLogin && !adminAuthed && (
        <AdminLogin onLogin={() => { setAdminAuthed(true); setShowAdminLogin(false); }} onClose={() => setShowAdminLogin(false)} />
      )}

      {adminAuthed && (
        <AdminDashboard rsvps={rsvps} onUpdate={updateRsvp} onDelete={deleteRsvp} onInvite={({ email, name }) => inviteGuest(email, name)} onClose={() => setAdminAuthed(false)} />
      )}

      {opened && (
        <>
          {error && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-800 text-sm flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="text-amber-600 hover:text-amber-900">×</button>
            </div>
          )}

          {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/20 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading RSVPs...</p>
              </div>
            </div>
          )}
          <Particles />
          <MusicPlayer audioRef={audioRef} />
          <NavBar onAdminClick={() => setShowAdminLogin(true)} />

          {/* ── Hero ──────────────────────────────────────────────── */}
          <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img src={HERO_IMG} alt="Rogimer and Alyssa Camille" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(66,117,200,0.55) 0%, rgba(18,38,63,0.72) 100%)" }} />
            </div>
            <div className="relative z-10 text-center px-6">
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="text-base tracking-widest uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(255,255,255,0.75)" }}>The Wedding of</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }} className="text-8xl md:text-9xl mb-8" style={{ fontFamily: "'Great Vibes', cursive", color: "white", textShadow: "0 2px 24px rgba(0,0,0,0.3)" }}>{GROOM}</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.65 }} className="text-3xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#86A4E4" }}>&amp;</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-8xl md:text-9xl mb-4" style={{ fontFamily: "'Great Vibes', cursive", color: "white", textShadow: "0 2px 24px rgba(0,0,0,0.3)" }}>{BRIDE}</motion.h1>
              <br/>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1 }} className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
                <div className="flex items-center gap-2"><Calendar size={14} style={{ color: "#86A4E4" }} /><span className="text-sm text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>{DATE_DISPLAY}</span></div>
                <div className="w-px h-4 bg-white/30" />
                <div className="flex items-center gap-2"><MapPin size={14} style={{ color: "#86A4E4" }} /><span className="text-sm text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Spacio Caliraya, Lumban, Laguna</span></div>
              </motion.div>
            </div>
            <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown size={24} color="rgba(255,255,255,0.6)" />
            </motion.div>
          </section>

          {/* ── Countdown ─────────────────────────────────────────── */}
          <section className="py-24 px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <SectionHeader script="Counting the Days" title="Until Our Forever Begins" subtitle='Only a few precious moments until we say "I do."' />
              <div className="flex flex-wrap justify-center gap-4">
                {[{ value: countdown.days, label: "Days" }, { value: countdown.hours, label: "Hours" }, { value: countdown.minutes, label: "Minutes" }, { value: countdown.seconds, label: "Seconds" }].map(({ value, label }) => (
                  <CountdownCard key={label} value={value} label={label} />
                ))}
              </div>
            </div>
          </section>

          {/* ── Gallery ───────────────────────────────────────────── */}
          <section id="gallery" className="py-24 px-6 relative" style={{ background: "linear-gradient(180deg, #F4F8FF 0%, #E8F2FF 100%)" }}>
            <div className="max-w-6xl mx-auto">
              <SectionHeader script="Our Story" title="Captured Moments" subtitle="Glimpses of our journey together" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: "minmax(12rem, auto)" }}>
                {GALLERY.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.07 }} className={`cursor-pointer group ${img.span}`} onClick={() => setLightbox(img.url)} style={{ boxShadow: "0 28px 90px rgba(198,124,78,0.15), 0 0 60px rgba(218,165,105,0.1)", borderRadius: "1.75rem", background: "linear-gradient(180deg, rgba(255,250,245,0.95), rgba(250,245,240,0.98))", border: "1px solid rgba(218,165,105,0.2)" }}>
                    <div className="relative overflow-hidden rounded-[1.5rem]" style={{ background: "#F5EFEA", minHeight: 260 }}>
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ background: "#F5EFEA", filter: "sepia(0.08) contrast(1.12) saturate(1.18) brightness(1.06) hue-rotate(3deg)", transform: "translateZ(0)", boxShadow: "inset 0 0 70px rgba(218,165,105,0.08)" }} />
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 15% 15%, rgba(255,255,255,0.32), transparent 20%), radial-gradient(circle at 85% 20%, rgba(255,218,185,0.22), transparent 25%), radial-gradient(circle at 50% 80%, rgba(255,182,193,0.15), transparent 55%)" }} />
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
                        <div className="absolute rounded-full opacity-35 blur-3xl" style={{ width: 130, height: 130, background: "rgba(255,218,185,0.45)", top: "5%", left: "5%" }} />
                        <div className="absolute rounded-full opacity-25 blur-3xl" style={{ width: 100, height: 100, background: "rgba(255,182,193,0.4)", top: "60%", right: "8%" }} />
                        <div className="absolute rounded-full opacity-20 blur-3xl" style={{ width: 80, height: 80, background: "rgba(255,228,196,0.35)", bottom: "10%", left: "15%" }} />
                        <div className="absolute rounded-full opacity-70" style={{ width: 7, height: 7, background: "rgba(255,255,255,0.8)", top: "22%", left: "70%" }} />
                        <div className="absolute rounded-full opacity-60" style={{ width: 6, height: 6, background: "rgba(255,240,245,0.7)", top: "48%", left: "60%" }} />
                        <div className="absolute rounded-full opacity-50" style={{ width: 5, height: 5, background: "rgba(255,218,185,0.6)", top: "65%", right: "28%" }} />
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 0 50px rgba(218,165,105,0.08), inset 0 0 100px rgba(255,182,193,0.04)" }} />
                      <div className="absolute left-6 right-6 top-6 h-0.5 rounded-full opacity-60" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,218,185,0.25))" }} />
                      <div className="absolute inset-0 transition-all duration-500 flex items-center justify-center" style={{ background: "rgba(218,165,105,0)" }}>
                        <Heart size={20} fill="white" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: "white", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {lightbox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(47,54,64,0.92)", backdropFilter: "blur(8px)" }} onClick={() => setLightbox(null)}>
              <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={lightbox.replace("w=600", "w=1200")} alt="Gallery" className="max-w-3xl max-h-[85vh] w-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
              <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <X size={16} color="white" />
              </button>
            </div>
          )}

          

       {/* ── Sponsors ──────────────────────────────────────────── */}
<section id="sponsors" className="py-24 px-6" style={{ background: "linear-gradient(180deg, #F6F9FF 0%, #E8F2FF 100%)" }}>
  <div className="max-w-6xl mx-auto">
    <SectionHeader
      script="With Gratitude"
      title="Our Beloved Sponsors"
      subtitle="Those who walk beside us as we begin this journey"
    />

 {/* Parents of the Couple */}
<div className="mb-16">
  <div className="max-w-4xl mx-auto mb-10 text-center">
    <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
      Parents of the Groom
    </p>
    <p className="text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.3 }}>
      Mr. Justo C. Urriza
    </p>
    <p className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.3 }}>
      Mrs. Rosita D. Urriza
    </p>
  </div>
  <div className="max-w-4xl mx-auto mb-10 text-center">
    <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
      Parents of the Bride
    </p>
    <p className="text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.3 }}>
      Mr. Amiel A. Lope
    </p>
    <p className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.3 }}>
      Mrs. Charmaine C. Jimenez
    </p>
  </div>
  <div className="max-w-4xl mx-auto text-center">
    <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
      Grandparents of the Bride
    </p>
    <p className="text-xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.3 }}>
      Mr. Jose J. Cabardo
    </p>
    <p className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.3 }}>
      Mrs. Melita F. Cabardo
    </p>
  </div>
</div>

 {/* Principal Sponsors */}
<div className="mb-20">
  <div className="max-w-4xl mx-auto mb-10 text-center">
    <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
      Principal Sponsors
    </p>
    <p className="text-sm mx-auto" style={{ maxWidth: 560, fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D", lineHeight: 1.8 }}>
      Honoring the families who support us with grace, love, and unwavering presence.
    </p>
  </div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="max-w-4xl mx-auto"
  >
    <GlassCard
      className="p-12"
      style={{
        border: "2px solid rgba(218,165,105,0.25)",
        background: "linear-gradient(135deg, rgba(255,250,245,0.98), rgba(250,245,240,0.96))",
        boxShadow: "0 28px 80px rgba(198,124,78,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {PRINCIPAL_SPONSORS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4 h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(218,165,105,0.15), rgba(255,182,193,0.1))" }}>
              <Heart size={18} style={{ color: "#D8A56A" }} />
            </div>
            <p className="text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.4 }}>
              {s.mr}
            </p>
            <p className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.4 }}>
              {s.mrs}
            </p>
            {i < PRINCIPAL_SPONSORS.length - 1 && i % 2 === 0 && (
              <div className="hidden sm:block absolute left-1/2 h-8 w-px -translate-x-1/2" style={{ background: "linear-gradient(180deg, rgba(218,165,105,0.1), transparent)" }} />
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t" style={{ borderColor: "rgba(218,165,105,0.15)" }}>
        <p className="text-center text-sm" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8B7C9D", lineHeight: 1.6 }}>
          With heartfelt gratitude for the unwavering support and blessings that made this celebration possible.
        </p>
      </div>
    </GlassCard>
  </motion.div>
</div>

    {/* Secondary Sponsors */}
    <div className="space-y-14">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mx-auto" style={{ background: "rgba(66,117,200,0.12)" }}>
          <Heart size={18} style={{ color: "#4275C8" }} />
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 justify-items-center">
          <div className="w-full max-w-sm">
            <GlassCard
              className="w-full p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                border: "1px solid rgba(66,117,200,0.18)",
                background: "linear-gradient(135deg, rgba(233,243,255,0.97), rgba(245,250,255,0.96))",
              }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.16)" }}>
                <BowTieIcon />
              </div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
                Best Man
              </p>
              <p className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.25 }}>
                {WEDDING_PARTY.find((p) => p.role === "Best Man")?.name}
              </p>
            </GlassCard>
          </div>

          <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2 justify-items-center">
            <div className="w-full max-w-sm">
              <GlassCard
                className="w-full p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  border: "1px solid rgba(66,117,200,0.18)",
                  background: "linear-gradient(135deg, rgba(233,243,255,0.97), rgba(245,250,255,0.96))",
                }}
              >
                <div className="absolute -top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.12)" }}>
                  <CrownIcon />
                </div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
                  Maid of Honor
                </p>
                <p className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.25 }}>
                  {WEDDING_PARTY.find((p) => p.role === "Maid of Honor")?.name}
                </p>
              </GlassCard>
            </div>

            <div className="w-full max-w-sm">
              <GlassCard
                className="w-full p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  border: "1px solid rgba(66,117,200,0.18)",
                  background: "linear-gradient(135deg, rgba(233,243,255,0.97), rgba(245,250,255,0.96))",
                }}
              >
                <div className="absolute -top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.12)" }}>
                  <RingIcon />
                </div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
                  Matron of Honor
                </p>
                <p className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.25 }}>
                  {WEDDING_PARTY.find((p) => p.role === "Matron of Honor")?.name}
                </p>
              </GlassCard>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <GlassCard
              className="w-full p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                border: "1px solid rgba(66,117,200,0.18)",
                background: "linear-gradient(135deg, rgba(233,243,255,0.97), rgba(245,250,255,0.96))",
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.12)" }}>
                <FlowerIcon />
              </div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
                Junior Bridesmaid
              </p>
              <p className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.25 }}>
                {WEDDING_PARTY.find((p) => p.role === "Junior Bridesmaid")?.name}
              </p>
            </GlassCard>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <GlassCard
              className="w-full p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                border: "1px solid rgba(66,117,200,0.18)",
                background: "linear-gradient(135deg, rgba(233,243,255,0.97), rgba(245,250,255,0.96))",
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.12)" }}>
                <Heart size={16} style={{ color: "#86A4E4" }} />
              </div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
                Bridesmaid
              </p>
              <p className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.25 }}>
                {WEDDING_PARTY.find((p) => p.role === "Bridesmaid")?.name}
              </p>
            </GlassCard>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <GlassCard
              className="w-full p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                border: "1px solid rgba(66,117,200,0.18)",
                background: "linear-gradient(135deg, rgba(233,243,255,0.97), rgba(245,250,255,0.96))",
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(66,117,200,0.12)" }}>
                <ChampagneIcon />
              </div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
                Groomsmen
              </p>
              <div className="space-y-2">
                {WEDDING_PARTY.filter((p) => p.role === "Groomsmen").map((person) => (
                  <p key={person.name} className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C", lineHeight: 1.25 }}>
                    {person.name}
                  </p>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <div className="text-center pt-6">
        <p className="text-xs tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: "#6B7C9D" }}>
          Secondary Sponsors
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SECONDARY_SPONSORS.filter((s) => ["Candle Sponsors", "Cord Sponsors", "Veil Sponsors"].includes(s.label)).map((s) => {
            let IconComponent;
            if (s.label === "Candle Sponsors") IconComponent = CandleIcon;
            else if (s.label === "Cord Sponsors") IconComponent = CordIcon;
            else if (s.label === "Veil Sponsors") IconComponent = VeilIcon;

            return (
              <GlassCard
                key={s.label}
                className="p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(255,250,245,0.95), rgba(250,245,240,0.93))",
                  border: "1px solid rgba(218,165,105,0.2)",
                  boxShadow: "0 14px 30px rgba(198,124,78,0.08)",
                }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(218,165,105,0.15)" }}>
                  {IconComponent && <IconComponent />}
                </div>
                <p className="text-xs tracking-widest uppercase mb-3 mt-2" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8B7C9D" }}>
                  {s.label}
                </p>
                <div className="mx-auto mb-4 h-1 w-14 rounded-full" style={{ background: "linear-gradient(90deg, #D8A56A, #F0C5A0)" }} />
                <div className="space-y-2">
                  {s.names.map((name, idx) => (
                    <p key={idx} className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>
                      {name}
                    </p>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECONDARY_SPONSORS.filter((s) => ["Ring Bearer", "Coin Bearer", "Bible Bearer", "Veil Bearer"].includes(s.label)).map((s) => {
            let IconComponent;
            if (s.label === "Ring Bearer") IconComponent = RingIcon;
            else if (s.label === "Coin Bearer") IconComponent = CoinIcon;
            else if (s.label === "Bible Bearer") IconComponent = BibleIcon;
            else if (s.label === "Veil Bearer") IconComponent = VeilIcon;

            return (
              <GlassCard
                key={s.label}
                className="p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(255,250,245,0.95), rgba(250,245,240,0.93))",
                  border: "1px solid rgba(218,165,105,0.2)",
                  boxShadow: "0 14px 30px rgba(198,124,78,0.08)",
                }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(218,165,105,0.15)" }}>
                  {IconComponent && <IconComponent />}
                </div>
                <p className="text-xs tracking-widest uppercase mb-3 mt-2" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8B7C9D" }}>
                  {s.label}
                </p>
                <div className="mx-auto mb-4 h-1 w-14 rounded-full" style={{ background: "linear-gradient(90deg, #D8A56A, #F0C5A0)" }} />
                <div className="space-y-2">
                  {s.names.map((name, idx) => (
                    <p key={idx} className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>
                      {name}
                    </p>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <GlassCard
            className="p-6 text-center relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, rgba(255,250,245,0.95), rgba(250,245,240,0.93))",
              border: "1px solid rgba(218,165,105,0.2)",
              boxShadow: "0 14px 30px rgba(198,124,78,0.08)",
            }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(218,165,105,0.15)" }}>
              <FlowerIcon />
            </div>
            <p className="text-xs tracking-widest uppercase mb-3 mt-2" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8B7C9D" }}>
              Flower Maidens
            </p>
            <div className="mx-auto mb-4 h-1 w-14 rounded-full" style={{ background: "linear-gradient(90deg, #D8A56A, #F0C5A0)" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 justify-items-center">
              {SECONDARY_SPONSORS.find((s) => s.label === "Flower Maidens")?.names.map((name, idx) => (
                <p key={idx} className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>
                  {name}
                </p>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
</section>

          {/* ── Attire ────────────────────────────────────────────── */}
          <section id="attire" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <SectionHeader script="Dress to Celebrate" title= "Entourage" subtitle="Please dress in these colours to complement our celebration" />
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-12 rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(66,117,200,0.2)" }}>
                <img src="/images/wedding-entourage.JPEG" alt="Wedding Entourage" className="w-full h-auto object-cover" />
              </motion.div>
              <SectionHeader script="" title="Our Dear Guests" subtitle="Smart casual to semi-formal styling suggestions" />
           
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-12 rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(66,117,200,0.2)" }}>
                <img src="/images/guest-attire.JPEG" alt="Guest Attire Guide" className="w-full h-auto object-cover" />
              </motion.div>
            </div>
          </section>

          {/* ── Ceremony & Reception ──────────────────────────────── */}
          <section id="ceremony" className="py-12 px-6">
            <div className="max-w-3xl mx-auto">
              <SectionHeader script="Join Us" title="Ceremony & Reception" />
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <GlassCard className="overflow-hidden border border-white/60 shadow-lg" style={{ background: "linear-gradient(135deg, rgba(255,250,245,0.92), rgba(250,245,240,0.9))", border: "1px solid rgba(218,165,105,0.2)", boxShadow: "0 12px 40px rgba(198,124,78,0.1)" }}>
                  <div className="grid gap-0 lg:grid-cols-2">
                    <div className="relative overflow-hidden min-h-[200px] lg:min-h-[280px]">
                      <img src="/images/Spacio.jpg" alt="Spacio Caliraya" className="w-full h-full object-cover" style={{ background: "#F5EFEA" }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(139,120,93,0.4)] via-transparent to-transparent" />
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-xs tracking-[0.28em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8B7C9D" }}>Ceremony</p>
                          <p className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>3:30 PM</p>
                          <p className="text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#6B7C9D" }}>Spacio Caliraya Garden</p>
                        </div>
                        <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(218,165,105,0.2), transparent)" }} />
                        <div className="space-y-2">
                          <p className="text-xs tracking-[0.28em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8B7C9D" }}>Reception</p>
                          <p className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1F2D4C" }}>5:00 PM</p>
                          <p className="text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#6B7C9D" }}>Spacio Caliraya Reception Hall</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t" style={{ borderColor: "rgba(218,165,105,0.15)" }}>
                    <div className="px-6 lg:px-8 py-6">
                      <p className="text-xs tracking-[0.28em] uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8B7C9D" }}>Location</p>
                      <p className="text-sm mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#6B7C9D", lineHeight: 1.6 }}>National Rd. Brgy. Lewin, Lake Caliraya Lumban Laguna</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(218,165,105,0.2)", minHeight: 140 }}>
                          <iframe
                            title="Spacio Caliraya map"
                            className="w-full h-full"
                            src="https://www.google.com/maps?q=Spacio+Caliraya+Garden+Lake+Caliraya+Lumban+Laguna&output=embed"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                        <a href="https://www.google.com/maps?q=Spacio+Caliraya+Garden+Lake+Caliraya+Lumban+Laguna" target="_blank" rel="noreferrer" className="flex items-center justify-center px-5 py-3 rounded-2xl text-xs uppercase tracking-[0.18em] transition-all hover:scale-105 whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(135deg, rgba(218,165,105,0.2), rgba(255,182,193,0.1))", color: "#D8A56A", textDecoration: "none", border: "1px solid rgba(218,165,105,0.3)" }}>
                          <MapPin size={14} className="mr-2" /> View on Map
                        </a>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </section>

          {/* ── RSVP ──────────────────────────────────────────────── */}
          <section id="rsvp" className="py-24 px-6 pb-32">
            <div className="max-w-lg mx-auto">
              <SectionHeader script="Will You Join Us?" title="RSVP" subtitle="Kindly respond by October 1, 2026" />
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <GlassCard className="p-8"><RSVPForm onSubmit={addRsvp} registeredEmails={rsvps.map((r) => r.email.toLowerCase())} /></GlassCard>
              </motion.div>
            </div>
          </section>

          {/* ── Footer ────────────────────────────────────────────── */}
          <footer className="text-center py-12 px-6" style={{ borderTop: "1px solid rgba(66,117,200,0.2)" }}>
            <p className="text-4xl mb-3" style={{ fontFamily: "'Great Vibes', cursive", color: "#4275C8" }}>{GROOM} &amp; {BRIDE}</p>
            <p className="text-xs tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif", color: "#9BB7E0", letterSpacing: "0.2em" }}>{DATE_DISPLAY.toUpperCase()}</p>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="mt-4">
              <Heart size={14} fill="#86A4E4" style={{ color: "#86A4E4", margin: "0 auto" }} />
            </motion.div>
          </footer>
        </>
      )}
    </div>
  );
}
