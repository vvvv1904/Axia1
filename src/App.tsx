/* ═══════════════════════════════════════════════════════════════════════
   AXIA WAITLIST — Single-File Frontend (Vite + Convex)
   Light + Dark mode with theme toggle
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  Shield,
  Clock,
  Zap,
  ChevronRight,
  FileCheck,
  Layers,
  Monitor,
  BarChart3,
  MessageSquare,
  CreditCard,
  Link2,
  Copy,
  Share2,
  Gift,
  Crown,
  Star,
  Scissors,
  X,
  Check,
  Minus,
  Sun,
  Moon,
  PenLine,
  Code2,
  Video,
  Users,
  Calculator,
  Palette,
  Target,
  Headphones,
  Camera,
  Layout,
  Building2,
  Megaphone,
  Globe,
  UserCheck,
  Brain,
} from "lucide-react";
import LogoLoop from './LogoLoop';

/* ─── Constants ──────────────────────────────────────────────────────── */
const REFERRAL_REWARDS = [
  { count: 1, label: "Priority early access", icon: Zap },
  { count: 3, label: "3 months free on Starter", icon: Star },
  { count: 5, label: "50% off any tier for one year", icon: Crown },
  { count: 10, label: "Expert tier free for 1 year", icon: Gift },
] as const;

const SHARE_PLATFORMS = [
  { name: "Twitter", color: "bg-[#1DA1F2]", icon: "X", label: "Tweet" },
  { name: "WhatsApp", color: "bg-[#25D366]", icon: "W", label: "Share" },
  { name: "Facebook", color: "bg-[#1877F2]", icon: "f", label: "Share" },
  { name: "LinkedIn", color: "bg-[#0A66C2]", icon: "in", label: "Share" },
] as const;

const TOTAL_FOUNDING_SPOTS = 200;
void TOTAL_FOUNDING_SPOTS;

/* ─── Pricing Tiers (matching screenshot) ──────────────────────────── */
const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    originalPrice: "",
    period: "",
    savings: "",
    desc: "Get started with basic protection",
    highlight: false,
    buttonLabel: "Get Started",
    features: [
      { text: "1 Report/Month", included: true },
      { text: "Basic Evidence", included: true },
      { text: "Manual Evidence Review", included: true },
      { text: "Automated Analysis", included: false },
      { text: "Cross-Platform Sync", included: false },
      { text: "Policy Analysis", included: false },
    ],
  },
  {
    name: "Starter",
    price: "$7",
    originalPrice: "$14",
    period: "/mo",
    savings: "Save $84/year",
    desc: "Perfect for part-time freelancers",
    highlight: false,
    buttonLabel: "Start Free Trial",
    features: [
      { text: "5 Reports/Month", included: true },
      { text: "Basic Evidence Collection", included: true },
      { text: "Platform Integration", included: true },
      { text: "Evidence Timeline View", included: true },
      { text: "Automated Analysis", included: false },
      { text: "Team Validation", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$15",
    originalPrice: "$30",
    period: "/mo",
    savings: "Save $180/year",
    desc: "For full-time freelancers",
    highlight: true,
    buttonLabel: "Start Free Trial",
    features: [
      { text: "Unlimited Reports", included: true },
      { text: "Advanced Evidence Collection", included: true },
      { text: "Automated Dispute Analysis", included: true },
      { text: "Cross-Platform Sync", included: true },
      { text: "Custom Policy Analysis", included: true },
      { text: "Team Validation", included: false },
      { text: "Premium Network", included: false },
    ],
  },
  {
    name: "Expert",
    price: "$49",
    originalPrice: "$98",
    period: "/mo",
    savings: "Save $588/year",
    desc: "For high-earning professionals",
    highlight: false,
    buttonLabel: "Start Free Trial",
    features: [
      { text: "All Pro Features", included: true },
      { text: "Team Validation", included: true },
      { text: "Policy Deep Analysis", included: true },
      { text: "Premium Network Access", included: true },
      { text: "Priority Processing", included: true },
      { text: "WCVM Access", included: true },
      { text: "White Label Option", included: true },
    ],
  },
] as const;

/* ─── Industry Cards for LogoLoop carousel ──────────────────────────── */
const INDUSTRY_CARDS: { icon: typeof FileCheck; title: string; desc: string; category: "freelancer" | "agency" }[] = [
  { icon: PenLine, title: "Writers", desc: "Track drafts and retainers. Bill by the word, by the hour, or by the project.", category: "freelancer" },
  { icon: Code2, title: "Developers", desc: "Sprints, milestones, retainers. Quote in hours, invoice in deliverables.", category: "freelancer" },
  { icon: Video, title: "Videographers", desc: "Shoots, edits, deliveries. One pipeline from booked date to final invoice.", category: "freelancer" },
  { icon: Users, title: "Coaches", desc: "Packages, sessions, retainers. Recurring billing without the spreadsheets.", category: "freelancer" },
  { icon: Calculator, title: "Bookkeepers", desc: "Manage your own books while you manage everyone else's. Tax-ready, every quarter.", category: "freelancer" },
  { icon: Palette, title: "Designers", desc: "Revisions tracked, proofs verified. Every version change logged automatically.", category: "freelancer" },
  { icon: Target, title: "Consultants", desc: "Campaign hours to invoices. Prove ROI with verified work logs.", category: "freelancer" },
  { icon: Headphones, title: "Assistants", desc: "Multi-client time tracking. Switch contexts without losing a minute.", category: "freelancer" },
  { icon: Camera, title: "Photographers", desc: "From booking to delivery. Galleries, proofs, and final invoices in one flow.", category: "freelancer" },
  { icon: Layout, title: "UX/UI Designers", desc: "Sprint-based billing. Design hours verified, delivered with proof.", category: "freelancer" },
  { icon: Megaphone, title: "Marketing Agencies", desc: "Multi-client campaigns, unified billing. Track every deliverable across all accounts.", category: "agency" },
  { icon: Palette, title: "Creative Agencies", desc: "From brief to invoice in one flow. Manage creatives, timelines, and client approvals.", category: "agency" },
  { icon: UserCheck, title: "Staffing Agencies", desc: "Track contractor hours across placements. Verified timesheets, automated invoicing.", category: "agency" },
  { icon: Building2, title: "PR Agencies", desc: "Media outreach, retainers, and deliverables. Every placement tracked and billed.", category: "agency" },
  { icon: Globe, title: "Digital Agencies", desc: "Websites, ads, and analytics. One dashboard for every client project and payment.", category: "agency" },
];

/* ─── IndustryCardSection — uses LogoLoop for scrolling cards ─────── */
function IndustryCardSection({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#0a1128]" : "bg-white";
  const cardBorder = isDark ? "border-[#1a2444]" : "border-[#c8ced8]";
  const cardHoverBorder = "hover:border-axia-gold/40";
  const titleColor = isDark ? "text-[#fcfcfc]" : "text-[#1a1a1c]";
  const descColor = isDark ? "text-[#fcfcfc]/60" : "text-[#1a1a1c]/70";
  const fadeColor = isDark ? "#030619" : "#eef0f4";

  const logos = INDUSTRY_CARDS.map((card) => ({
    node: (
      <div className={`w-[320px] flex-shrink-0 ${cardBg} border ${cardBorder} ${cardHoverBorder} transition-colors rounded-xl p-6 shadow-lg ${isDark ? "shadow-black/20" : "shadow-black/[0.08]"}`}>
        <div className="flex items-center gap-3.5 mb-3.5">
          <div className="w-11 h-11 bg-axia-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <card.icon className="w-5.5 h-5.5 text-axia-gold" />
          </div>
          <div className="min-w-0">
            <h4 className={`text-base font-semibold ${titleColor} leading-tight`}>{card.title}</h4>
            <span className={`text-[11px] uppercase tracking-wider font-semibold ${card.category === "agency" ? "text-axia-gold" : isDark ? "text-[#fcfcfc]/50" : "text-[#1a1a1c]/50"}`}>
              {card.category === "agency" ? "Agency" : "Freelancer"}
            </span>
          </div>
        </div>
        <p className={`text-sm ${descColor} leading-relaxed`}>{card.desc}</p>
      </div>
    )
  }));

  return (
    <div style={{ height: '250px', position: 'relative', overflow: 'hidden' }}>
      <LogoLoop
        logos={logos}
        speed={60}
        direction="left"
        logoHeight={230}
        gap={24}
        hoverSpeed={15}
        fadeOut
        fadeOutColor={fadeColor}
        scaleOnHover
        ariaLabel="Industries and professionals Axia serves"
      />
    </div>
  );
}

/* ─── DuctTapeStack Component ────────────────────────────────────────── */
function DuctTapeStack() {
  const tools = [
    { name: "Google Docs", icon: FileCheck, color: "text-blue-600" },
    { name: "Trello", icon: Layers, color: "text-sky-600" },
    { name: "Stripe", icon: CreditCard, color: "text-purple-600" },
    { name: "Loom", icon: Monitor, color: "text-rose-600" },
    { name: "Slack", icon: MessageSquare, color: "text-amber-600" },
  ];
  return (
    <div className="relative py-4 px-2">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "22%", left: "5%", right: "5%", h: 18, rot: -1.5, opacity: 0.6 },
          { top: "52%", left: "8%", right: "3%", h: 16, rot: 1, opacity: 0.5 },
          { top: "10%", left: "15%", right: "15%", h: 14, rot: 6, opacity: 0.4 },
        ].map((t, i) => (
          <div
            key={i}
            className="absolute rounded-[2px]"
            style={{
              top: t.top, left: t.left, right: t.right, height: t.h, opacity: t.opacity,
              background: "linear-gradient(180deg, #C4A44A 0%, #B89530 40%, #D4B85A 60%, #C4A44A 100%)",
              transform: `rotate(${t.rot}deg)`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.15) 8px, rgba(0,0,0,0.15) 9px)" }}
            />
          </div>
        ))}
        <div
          className="absolute bottom-[18%] right-[10%] w-[50px] h-[20px] rounded-[2px] opacity-45"
          style={{
            background: "linear-gradient(180deg, #C4A44A 0%, #B89530 50%, #D4B85A 100%)",
            transform: "rotate(-4deg)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        />
      </div>
      <div className="relative space-y-2.5">
        {tools.map((t, i) => (
          <div
            key={t.name}
            className="jitter-hover flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-dashed border-red-300 dark:border-red-800/40 bg-[#FFF5F5] dark:bg-[#1a0f0f]"
            style={{ transform: `rotate(${(i - 2) * 1.8}deg) translateX(${i % 2 === 0 ? 3 : -3}px)` }}
          >
            <t.icon className={`w-4 h-4 ${t.color}`} />
            <span className="text-[#1a1a1c]/80 dark:text-[#fcfcfc]/70 text-sm font-medium">{t.name}</span>
          </div>
        ))}
      </div>
      <div className="absolute -top-1 -right-1 text-amber-600/40">
        <Scissors className="w-5 h-5" />
      </div>
    </div>
  );
}

/* ─── DashboardMock Component — white card, works both modes ──────── */
function AxiaDashboardMock() {
  return (
    <div className="bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] rounded-xl overflow-hidden shadow-2xl shadow-black/[0.08] dark:shadow-black/20">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#dfe4eb] dark:border-[#1a2444] bg-[#f9fafb] dark:bg-[#0a1128]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-1 bg-white dark:bg-[#0a1128] rounded text-xs text-[#1a1a1c]/60 dark:text-slate-400 font-mono border border-[#dfe4eb] dark:border-[#1a2444]">
            app.axia.io/dashboard
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active Projects", value: "7", change: "+2" },
            { label: "Verified Hours", value: "142", change: "+18" },
            { label: "Revenue MTD", value: "$12,840", change: "+$2.1k" },
          ].map((s) => (
            <div key={s.label} className="bg-[#e8eaef] dark:bg-[#0a1128] rounded-lg p-2 sm:p-3 border border-[#dfe4eb] dark:border-[#1a2444]">
              <p className="text-[10px] sm:text-xs text-[#1a1a1c]/60 dark:text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-lg sm:text-xl font-semibold text-[#1a1a1c] dark:text-[#fcfcfc]">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-emerald-600">{s.change} this week</p>
            </div>
          ))}
        </div>
        <div className="bg-[#e8eaef] dark:bg-[#0a1128] rounded-lg p-3 border border-[#dfe4eb] dark:border-[#1a2444]">
          <p className="text-xs text-[#1a1a1c]/60 dark:text-slate-400 uppercase tracking-wider mb-2">Recent Verified Deliverables</p>
          {[
            { project: "Brand Redesign — Acme Co", time: "3h 42m", status: "Verified" },
            { project: "API Integration — FinFlow", time: "5h 10m", status: "Verified" },
            { project: "Landing Page — NovaTech", time: "2h 18m", status: "Pending" },
          ].map((a) => (
            <div key={a.project} className="flex items-center justify-between py-1.5 border-t border-[#dfe4eb] dark:border-[#1a2444] gap-2">
              <span className="text-xs sm:text-sm text-[#1a1a1c]/80 dark:text-[#fcfcfc]/80 truncate">{a.project}</span>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <span className="text-[10px] sm:text-xs text-[#1a1a1c]/60 dark:text-slate-400">{a.time}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${a.status === "Verified" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"}`}>
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-2 sm:p-3 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <FileCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 font-medium truncate">Invoice #1042 — includes verified work log</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
        </div>
      </div>
    </div>
  );
}

/* ─── ReferralPopup Component — white card popup, works both modes ─ */
function ReferralPopup({ isOpen, onClose, position, referralCode, referralCount }: {
  isOpen: boolean; onClose: () => void; position: number; referralCode: string; referralCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const referralLink = typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : "";

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }, [referralLink]);

  const shareOn = useCallback((platform: string) => {
    const text = "I just joined the Axia waitlist! One tab for your entire business — CRM, invoicing, and verified work logs. Get early access:";
    const urls: Record<string, string> = {
      Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      WhatsApp: `https://wa.me/?text=${encodeURIComponent(text + " " + referralLink)}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(text)}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  }, [referralLink]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-reveal-1">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-axia-gold via-axia-gold-light to-axia-gold" />
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-6px)]">
          <button onClick={onClose} className="absolute top-4 right-4 text-[#1a1a1c]/50 hover:text-[#1a1a1c]/70 dark:text-[#fcfcfc]/40 dark:hover:text-[#fcfcfc]/70 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-axia-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-axia-gold" />
          </div>
          <h2 className="text-xl font-bold text-[#1a1a1c] dark:text-[#fcfcfc] text-center mb-2">You&apos;re on the list!</h2>
          <p className="text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 text-center text-sm mb-6">
            Your spot is <span className="text-axia-gold font-bold text-lg">#{position}</span> — refer friends to move up!
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-[#1a1a1c] dark:text-[#fcfcfc] font-semibold text-sm mb-1">Want to move up the list?</p>
            <p className="text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 text-xs">Refer friends and unlock rewards at every milestone</p>
          </div>
          <div className="mb-4">
            <p className="text-[10px] text-[#1a1a1c]/60 dark:text-slate-400 uppercase tracking-wider font-medium mb-1.5">Your referral link</p>
            <div className="flex items-center gap-2">
              <input readOnly value={referralLink} onClick={(e) => (e.target as HTMLInputElement).select()}
                className="h-9 flex-1 min-w-0 bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] rounded-md px-2 sm:px-3 text-[#1a1a1c]/80 dark:text-[#fcfcfc]/70 text-[10px] sm:text-xs font-mono focus:outline-none" />
              <button onClick={copyLink}
                className="h-9 px-3 bg-axia-gold hover:bg-axia-gold-light text-[#070F1B] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2 mb-5">
            {SHARE_PLATFORMS.map((p) => (
              <button key={p.name} onClick={() => shareOn(p.name)}
                className={`flex-1 ${p.color} text-white rounded-lg py-2 flex items-center justify-center gap-1.5 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer`}>
                <span className="text-sm font-bold">{p.icon}</span>
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-[#dfe4eb] dark:border-[#1a2444] pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-[#1a1a1c]/60 dark:text-slate-400 uppercase tracking-wider font-medium">Your referral progress</p>
              <span className="text-xs text-axia-gold font-semibold">{referralCount} referred</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {REFERRAL_REWARDS.map((reward) => {
                const achieved = referralCount >= reward.count;
                return (
                  <div key={reward.count}
                    className={`text-center p-2 rounded-lg ${achieved ? "bg-axia-gold/10 border border-axia-gold/20" : "bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444]"}`}>
                    <reward.icon className={`w-3.5 h-3.5 mx-auto mb-1 ${achieved ? "text-axia-gold" : "text-[#1a1a1c]/50 dark:text-slate-300"}`} />
                    <p className={`text-[10px] font-semibold ${achieved ? "text-axia-gold" : "text-[#1a1a1c]/60 dark:text-slate-400"}`}>{reward.count}</p>
                    <p className="text-[8px] text-[#1a1a1c]/60 dark:text-slate-400 leading-tight">{reward.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────────────────── */
export default function App({ hasBackend = false }: { hasBackend?: boolean }) {
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const refCode = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [myReferralCode, setMyReferralCode] = useState("");
  const [myReferralCount] = useState(0);
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ─── Theme state + toggle ─── */
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    try {
      const saved = (localStorage.getItem("axia_theme") as "light" | "dark") || "dark";
      setTheme(saved);
      const root = document.documentElement;
      if (saved === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    } catch {}
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try { localStorage.setItem("axia_theme", newTheme); } catch {}
    const root = document.documentElement;
    if (newTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  };

  // Only call Convex when backend is connected — skip ("skip" = undefined) when in demo mode
  // This prevents 404 errors when VITE_CONVEX_URL is missing or invalid
  const countData = useQuery(hasBackend ? api.waitlist.getCount : "skip");
  const joinWaitlist = useMutation(api.waitlist.join);

  const signupCount = hasBackend ? (countData?.total ?? 100) : 107;
  const spotsRemaining = hasBackend ? (countData?.remaining ?? 100) : 93;

  useEffect(() => {
    if (!hasBackend || !myReferralCode) return;
    const interval = setInterval(async () => {}, 8000);
    return () => clearInterval(interval);
  }, [myReferralCode, hasBackend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) { toast.error("Please enter a valid email"); return; }
    setIsLoading(true);
    try {
      if (!hasBackend) {
        await new Promise((r) => setTimeout(r, 800));
        const fakeCode = "AX-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        setIsSuccess(true); setPosition(Math.floor(Math.random() * 20) + 80);
        setMyReferralCode(fakeCode); setShowReferralPopup(true);
        toast.success("Welcome! You're on the list (demo mode).");
      } else {
        const result = await joinWaitlist({ email, ref: refCode || undefined });
        if (result.success) {
          setIsSuccess(true); setPosition((result.entry as any)?.position || 100);
          setMyReferralCode((result.entry as any)?.referralCode || "");
          setShowReferralPopup(true); toast.success(result.message as string);
        } else { toast.error(result.error as string); }
      }
    } catch {
      if (!hasBackend) {
        const fakeCode = "AX-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        setIsSuccess(true); setPosition(Math.floor(Math.random() * 20) + 80);
        setMyReferralCode(fakeCode); setShowReferralPopup(true);
        toast.success("Welcome! You're on the list (demo mode).");
      } else { toast.error("Failed to join. Please try again."); }
    } finally { setIsLoading(false); }
  };

  const SectionHeader = ({ label, title, subtitle, maxWidth = "max-w-lg" }: {
    label: string; title: string; subtitle: string; maxWidth?: string;
  }) => (
    <div className="text-center mb-8 md:mb-16">
      <p className="text-xs sm:text-sm text-axia-gold uppercase tracking-[0.08em] font-medium mb-2 sm:mb-3">{label}</p>
      <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-bold text-[#1a1a1c] dark:text-[#fcfcfc] tracking-[-0.02em] mb-3 sm:mb-4">{title}</h2>
      <p className={`text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 text-sm sm:text-base md:text-lg ${maxWidth} mx-auto px-2`}>{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#eef0f4] dark:bg-[#030619] flex flex-col transition-colors duration-300">
      <ReferralPopup isOpen={showReferralPopup} onClose={() => setShowReferralPopup(false)}
        position={position} referralCode={myReferralCode} referralCount={myReferralCount} />

      {/* ─── Nav — theme-aware background ─── */}
      <nav className="w-full border-b border-[#dfe4eb] dark:border-[#1a2444]/80 bg-[#eef0f4]/90 dark:bg-[#060d20]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-axia-gold rounded-lg flex items-center justify-center">
              <span className="text-[#070F1B] font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-[#1a1a1c] dark:text-[#fcfcfc] text-lg tracking-tight">Axia</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop/tablet version */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-axia-gold animate-pulse" />
              <span className="text-sm text-[#1a1a1c]/80 dark:text-[#fcfcfc]/60 font-medium">
                {signupCount > 100 ? `${signupCount.toLocaleString()} people waiting` : "100+ people waiting"}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">· Only {spotsRemaining} spots left</span>
            </div>
            {/* Mobile compact version */}
            <div className="flex sm:hidden items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-axia-gold animate-pulse" />
              <span className="text-xs text-[#1a1a1c]/80 dark:text-[#fcfcfc]/60 font-medium">
                {signupCount > 100 ? `${signupCount.toLocaleString()} waiting` : "100+ waiting"}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">· {spotsRemaining} left</span>
            </div>
            {/* Theme toggle — Worklane-style pill */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn relative flex items-center w-[56px] sm:w-[64px] h-7 sm:h-8 rounded-full border border-[#dfe4eb] dark:border-[#1a2444] bg-gradient-to-r from-[#f9fafb] to-[#eef0f4] dark:from-[#0a1128] dark:to-[#0f1a35] shadow-sm cursor-pointer transition-all duration-300 px-1 hover:shadow-md"
              aria-label="Toggle theme"
            >
              <Sun className={`absolute left-1.5 sm:left-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-300 ${theme === "light" ? "text-axia-gold scale-100 opacity-100" : "text-slate-400 scale-75 opacity-40"}`} />
              <span className={`theme-toggle-knob absolute top-[3px] sm:top-[4px] w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-md ${theme === "dark" ? "translate-x-[26px] sm:translate-x-[32px] bg-[#fcfcfc]" : "translate-x-0 bg-axia-gold"}`} />
              <Moon className={`absolute right-1.5 sm:right-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-300 ${theme === "dark" ? "text-axia-gold scale-100 opacity-100" : "text-slate-400 scale-75 opacity-40"}`} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">
        {/* ═══════ SECTION 1 — HERO with mesh gradient ═══════ */}
        <section className={`w-full ${theme === "dark" ? "hero-gradient-dark" : "hero-gradient-light"} relative overflow-hidden`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-center">
            <div>
              <div className="animate-reveal-1 inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:gap-2.5 rounded-full bg-axia-gold/5 border border-axia-gold/20 mb-6 sm:mb-8 flex-wrap">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-axia-gold animate-pulse" />
                <span className="text-axia-gold text-[11px] sm:text-sm font-medium tracking-wide">
                  100+ already waiting — only {spotsRemaining} spots left
                </span>
              </div>
              <h1 className="animate-reveal-2 text-[30px] sm:text-[48px] md:text-[56px] font-bold text-[#1a1a1c] dark:text-[#fcfcfc] leading-[1.1] sm:leading-[1.08] tracking-[-0.03em] mb-5 sm:mb-6">
                Your business, one tab.<br />
                <span className="hero-text-gradient">Ten hours back, every week.</span>
              </h1>
              <p className="animate-reveal-3 text-sm sm:text-base md:text-lg text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 leading-relaxed mb-6 sm:mb-10 max-w-[520px]">
                Axia replaces the five tools you duct-taped together — CRM, invoicing, time tracking, and a
                verification engine that makes &ldquo;What did you work on?&rdquo; emails disappear. One tab. Zero chaos.
              </p>
              <form onSubmit={handleSubmit} className="animate-reveal-4 mb-4" id="signup-form">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    className="h-14 flex-1 bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] focus:border-axia-gold focus:ring-1 focus:ring-axia-gold/10 text-[#1a1a1c] dark:text-[#fcfcfc] placeholder:text-[#1a1a1c]/60 dark:placeholder:text-[#fcfcfc]/40 text-base rounded-lg px-4 focus:outline-none" />
                  <button type="submit" disabled={isLoading}
                    className="h-14 px-6 sm:px-8 bg-axia-gold hover:bg-axia-gold-light text-[#070F1B] font-semibold text-sm sm:text-base rounded-lg whitespace-nowrap cursor-pointer flex items-center justify-center disabled:opacity-60">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span className="sm:hidden">Get Access</span><span className="hidden sm:inline">Secure Founding Access</span></>}
                  </button>
                </div>
              </form>
              <div className="animate-reveal-5 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["bg-amber-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500"].map((c, i) => (
                    <div key={i} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${c} border-2 border-white dark:border-[#030619] flex items-center justify-center`}>
                      <span className="text-white text-[9px] sm:text-[10px] font-bold">{["J", "M", "S", "K"][i]}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] sm:text-sm text-[#1a1a1c]/80 dark:text-[#fcfcfc]/60 leading-snug">
                  {signupCount > 100 ? `${signupCount.toLocaleString()} professionals` : "100+ professionals"} waiting
                  <span className="text-slate-500 dark:text-slate-400"> · </span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Only {spotsRemaining} spots left</span>
                  <span className="hidden sm:inline text-slate-500 dark:text-slate-400"> · </span>
                  <span className="hidden sm:inline text-axia-gold">Referral rewards</span> <span className="hidden sm:inline text-[#1a1a1c]/80 dark:text-[#fcfcfc]/60">for founding members</span>
                </p>
              </div>
              {refCode && (
                <div className="animate-reveal-5 mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-axia-gold/5 border border-axia-gold/20">
                  <Share2 className="w-3 h-3 text-axia-gold" />
                  <span className="text-xs text-axia-gold">You were referred — skip the line!</span>
                </div>
              )}
            </div>
            <div className="animate-reveal-4 mt-8 md:mt-0">
              <AxiaDashboardMock />
            </div>
          </div>
          </div>
        </section>

        {/* ═══════ INDUSTRY CAROUSEL — Who Axia is for ═══════ */}
        <section className="w-full border-t border-[#c8ced8] dark:border-[#1a2444]/60 bg-[#eef0f4] dark:bg-[#030619]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-xs sm:text-sm text-axia-gold-dark dark:text-axia-gold uppercase tracking-[0.08em] font-medium mb-2 sm:mb-3">Built For You</p>
              <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-bold text-[#1a1a1c] dark:text-[#fcfcfc] tracking-[-0.02em] mb-3 sm:mb-4">One platform. Every profession. Every agency.</h2>
              <p className="text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 text-sm sm:text-base md:text-lg max-w-lg mx-auto px-2">
                Whether you freelance, run an agency, code, coach, create, or consult — Axia adapts to how you work, bill, and deliver.
              </p>
            </div>
            <IndustryCardSection theme={theme} />
          </div>
        </section>

        {/* ═══════ SECTION 2 — FEATURES ═══════ */}
        <section className="w-full border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-[#f4f5f8] dark:bg-[#060d20]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <SectionHeader label="What You Get" title="One workspace. Every tool you need."
              subtitle="From first lead to final payment — Axia handles the entire lifecycle. No duct tape. No gaps. No extra subscriptions." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
              {[
                { icon: FileCheck, title: "Smart Proposals", desc: "Draft proposals in your brand voice with smart follow-ups that trigger on Day 3, 7, and 14 — so you never chase manually. Close deals faster without the back-and-forth." },
                { icon: CreditCard, title: "Validated Billing", desc: "Invoices that prove their own worth. Every line item links back to verified work logs — no more disputes over hours. Get paid what you earned, every time." },
                { icon: BarChart3, title: "CRM & Pipeline", desc: "Visual pipeline board tracks every deal from first contact to close. Know exactly where your money is, who needs follow-up, and what to prioritize next." },
                { icon: Clock, title: "Verified Workstreams", desc: "Zero-friction time tracking that records automatically. Alerts when work not started. Your work logs build themselves — accurate down to the minute." },
                { icon: Shield, title: "Truth Layer Verification", desc: "A background engine that validates activity in real-time. Provides indisputable proof of what was done, when, and for how long — accelerating client trust instantly." },
                { icon: MessageSquare, title: "Automated Payment Reminders", desc: "Smart payment reminders that fire on schedule — Day 3, 7, and 14 after an invoice goes out. No more awkward follow-ups. Your clients get professional nudges automatically while you focus on the work that matters." },
                { icon: Monitor, title: "Scope Creep Protection", desc: "Catch scope creep as it happens with automatic detection and one-click change orders. Never do unpaid work again — every hour is accounted for and billable." },
                { icon: Brain, title: "Context Management & Communication", desc: "Keep every project detail, client message, and decision in one place. Never lose context switching between tools — Axia centralizes your communication so you always know what's happening, with whom, and what's next. Save hours every week." },
                { icon: Zap, title: "Instant Setup, Zero Config", desc: "No workflow builders. No automation rules to configure. Add your email, set your brand, and everything runs from day one. Working in under ten minutes." },
              ].map((f) => (
                <div key={f.title}
                  className="bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] hover:border-axia-gold/30 transition-colors group shadow-lg shadow-black/[0.08] dark:shadow-black/20 rounded-xl p-5 sm:p-6">
                  <div className="w-12 h-12 bg-axia-gold/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-axia-gold/20 transition-colors">
                    <f.icon className="w-6 h-6 text-axia-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1a1c] dark:text-[#fcfcfc] mb-3">{f.title}</h3>
                  <p className="text-sm sm:text-base text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            {/* Comparison table */}
            <div className="mt-10 sm:mt-12 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] rounded-xl overflow-hidden shadow-lg shadow-black/[0.08] dark:shadow-black/20 overflow-x-auto">
                <div className="grid grid-cols-3 text-center border-b border-[#dfe4eb] dark:border-[#1a2444] min-w-[280px]">
                  <div className="py-3 px-3 sm:px-4 bg-[#f4f5f8] dark:bg-[#0a1128]"><span className="text-xs sm:text-sm text-[#1a1a1c]/80 dark:text-[#fcfcfc]/50 font-medium">Capability</span></div>
                  <div className="py-3 px-3 sm:px-4 bg-red-50 dark:bg-red-900/20"><span className="text-xs sm:text-sm text-red-500 dark:text-red-400 font-medium">Others</span></div>
                  <div className="py-3 px-3 sm:px-4 bg-amber-50 dark:bg-amber-900/20"><span className="text-xs sm:text-sm text-axia-gold font-medium">Axia</span></div>
                </div>
                {[
                  { feature: "Proposal workflow", others: "Manual or partial", axia: "Auto-drafted + smart follow-ups" },
                  { feature: "Work verification", others: "Screenshots only", axia: "Truth Layer — full audit trail" },
                  { feature: "Invoice proof", others: "Static PDF", axia: "Validated Billing — linked to work" },
                  { feature: "Scope creep protection", others: "Manual tracking", axia: "Auto-detected + change orders" },
                  { feature: "Setup time", others: "3–7 days", axia: "10 minutes" },
                ].map((row) => (
                  <div key={row.feature} className="grid grid-cols-3 text-center border-b border-[#dfe4eb]/50 dark:border-[#1a2444]/50 last:border-b-0">
                    <div className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-[#1a1a1c]/80 dark:text-[#fcfcfc]/80 font-medium text-left">{row.feature}</div>
                    <div className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-[#1a1a1c]/60 dark:text-slate-400">{row.others}</div>
                    <div className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-axia-gold font-medium">{row.axia}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 3 — BEFORE & AFTER ═══════ */}
        <section className="w-full border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-[#f4f5f8] dark:bg-[#030619]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <SectionHeader label="The Before & After" title="You didn't start a business to manage a tech stack."
              subtitle="Stop duct-taping your workflow together. Axia unifies your deal flow into a single, verified narrative." maxWidth="max-w-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="rounded-xl border border-dashed border-red-300 dark:border-red-800/40 bg-[#FFF5F5] dark:bg-[#1a0f0f] p-4 sm:p-5 shadow-lg shadow-black/[0.08] dark:shadow-black/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">Before</span>
                  <span className="text-[10px] text-[#1a1a1c]/60 dark:text-slate-400">— the duct-tape stack</span>
                </div>
                <DuctTapeStack />
              </div>
              <div className="rounded-xl border border-axia-gold/20 bg-white dark:bg-[#0a1128] p-4 sm:p-5 shadow-lg shadow-black/[0.08] dark:shadow-black/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-axia-gold uppercase tracking-wider">After</span>
                  <span className="text-[10px] text-[#1a1a1c]/60 dark:text-slate-400">— Axia</span>
                </div>
                <div className="space-y-3 p-3">
                  {[
                    { icon: FileCheck, label: "Contracts & Proposals" },
                    { icon: Clock, label: "Verified Time Tracking" },
                    { icon: BarChart3, label: "CRM & Pipeline" },
                    { icon: CreditCard, label: "Invoicing & Payments" },
                    { icon: Shield, label: "Work Verification Engine" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f4f5f8] dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444]">
                      <t.icon className="w-4 h-4 text-axia-gold" />
                      <span className="text-sm text-[#1a1a1c]/80 dark:text-[#fcfcfc]/80 font-medium">{t.label}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 4 — TRUTH LAYER ═══════ */}
        <section className="w-full border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-[#f4f5f8] dark:bg-[#060d20]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <div className="max-w-4xl mx-auto">
              <SectionHeader label="The Difference" title="Other tools stop once the contract is signed." subtitle="Axia is just getting started." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 sm:mb-12">
                <div className="bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] rounded-xl p-5 sm:p-6 shadow-lg shadow-black/[0.08] dark:shadow-black/20">
                  <p className="text-xs text-[#1a1a1c]/60 dark:text-slate-400 uppercase tracking-wider font-medium mb-4">Other tools</p>
                  <ul className="space-y-3">
                    {["Proposals & contracts", "Basic invoicing", "Payment collection", "Template library"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1a1a1c]/60 dark:text-[#fcfcfc]/30 flex-shrink-0" />{item}
                      </li>
                    ))}
                    {["Verified work logs", "Automated context capture", "Dispute-proof billing"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-[#1a1a1c]/60 dark:text-[#fcfcfc]/30 line-through">
                        <span className="w-3.5 h-3.5 flex-shrink-0 text-center text-red-400/80">x</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-[#0a1128] border border-axia-gold/20 rounded-xl p-5 sm:p-6 relative shadow-lg shadow-black/[0.08] dark:shadow-black/20">
                  <div className="absolute -top-2.5 left-4">
                    <span className="bg-axia-gold text-[#070F1B] text-xs font-semibold px-2.5 py-0.5 rounded-md">Truth Layer</span>
                  </div>
                  <p className="text-xs text-axia-gold/80 uppercase tracking-wider font-medium mb-4 mt-1">Axia</p>
                  <ul className="space-y-3">
                    {["Proposals & contracts", "Validated Billing", "Payment collection", "Template library", "Verified Workstreams", "Automated context capture", "Dispute-proof invoicing"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-[#1a1a1c]/80 dark:text-[#fcfcfc]/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-axia-gold flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-center text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 text-sm sm:text-[15px] leading-relaxed max-w-xl mx-auto px-2">
                Generic tools manage your documents; Axia manages your <span className="text-[#1a1a1c] dark:text-[#fcfcfc] font-medium">work</span>.
                Our verification engine validates your activity in the background — providing transparency that accelerates
                client trust and ensures you&apos;re compensated for every second.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 5 — JUSTIFICATION IS CONSTANT ═══════ */}
        <section className="w-full border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-[#f4f5f8] dark:bg-[#030619]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <SectionHeader label="For the 99%" title="Disputes are rare. Justification is constant."
                subtitle={'You\'re probably losing 3–5 hours a week manually proving your value — updating clients, second-guessing invoices, documenting work "just in case." Axia automates your professional transparency. Lead with indisputable evidence — not over-explanation.'} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {[
                  { icon: Clock, stat: "3–5 hrs", label: "saved per week on justification" },
                  { icon: CreditCard, stat: "Validated", label: "invoices that prove their own worth" },
                  { icon: Link2, stat: "Zero-friction", label: "work streams, recorded automatically" },
                ].map((t) => (
                  <div key={t.label} className="bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] rounded-xl p-5 sm:p-6 shadow-lg shadow-black/[0.08] dark:shadow-black/20">
                    <t.icon className="w-6 h-6 text-axia-gold mb-4" />
                    <p className="text-2xl sm:text-2xl font-bold text-[#1a1a1c] dark:text-[#fcfcfc] mb-2">{t.stat}</p>
                    <p className="text-sm sm:text-base text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 6 — PRICING ═══════ */}
        <section className="w-full border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-[#f4f5f8] dark:bg-[#060d20]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <SectionHeader label="Pricing Preview" title="Start free. Scale when you're ready."
              subtitle="Every plan includes the Truth Layer. The difference is how much power you need." maxWidth="max-w-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.name}
                  className={`bg-white dark:bg-[#0a1128] border rounded-xl p-5 sm:p-6 relative flex flex-col shadow-lg shadow-black/[0.08] dark:shadow-black/20 ${
                    tier.highlight ? "border-axia-gold/40 ring-1 ring-axia-gold/20" : "border-[#dfe4eb] dark:border-[#1a2444]"
                  }`}>
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-axia-gold text-[#070F1B] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-[#1a1a1c] dark:text-[#fcfcfc] mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl sm:text-4xl font-bold text-[#1a1a1c] dark:text-[#fcfcfc]">{tier.price}</span>
                    {tier.period && <span className="text-sm sm:text-base text-[#1a1a1c]/60 dark:text-slate-400">{tier.period}</span>}
                  </div>
                  {tier.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-[#1a1a1c]/60 dark:text-slate-400 line-through">{tier.originalPrice}</span>
                      {tier.savings && <span className="text-xs font-semibold text-emerald-600">{tier.savings}</span>}
                    </div>
                  )}
                  <p className="text-sm text-[#1a1a1c]/80 dark:text-[#fcfcfc]/50 mb-5">{tier.desc}</p>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f.text} className={`flex items-center gap-2.5 text-sm ${f.included ? "text-[#1a1a1c]/80 dark:text-[#fcfcfc]/80" : "text-[#1a1a1c]/50 dark:text-slate-500"}`}>
                        {f.included ? <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <Minus className="w-4 h-4 text-[#1a1a1c]/50 dark:text-slate-500 flex-shrink-0" />}
                        <span className={f.included ? "" : "line-through"}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-colors ${
                    tier.highlight ? "bg-axia-gold hover:bg-axia-gold-light text-[#070F1B]" : "bg-[#e4e7ed] hover:bg-[#d9dce4] dark:bg-[#0a1128] dark:hover:bg-[#1f252f] text-[#1a1a1c] dark:text-[#fcfcfc]"
                  }`}>
                    {tier.buttonLabel}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10">
              <div className="flex items-center gap-2 text-sm text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> No credit card required
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Instant activation
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 7 — REFERRAL REWARDS ═══════ */}
        <section className="w-full border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-[#f4f5f8] dark:bg-[#030619]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <SectionHeader label="Referral Rewards" title="Share Axia. Get rewarded."
              subtitle="Every friend you refer moves you up the list and unlocks perks. The more you share, the more you earn." />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {REFERRAL_REWARDS.map((r) => (
                <div key={r.count} className="bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] hover:border-axia-gold/30 transition-colors rounded-xl p-4 sm:p-6 text-center shadow-lg shadow-black/[0.08] dark:shadow-black/20">
                  <div className="w-12 h-12 bg-axia-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <r.icon className="w-6 h-6 text-axia-gold" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#1a1a1c] dark:text-[#fcfcfc] mb-1">{r.count}</p>
                  <p className="text-[10px] sm:text-xs text-[#1a1a1c]/60 dark:text-slate-400 uppercase tracking-wider mb-2">referrals</p>
                  <p className="text-xs sm:text-sm text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 8 — BOTTOM CTA ═══════ */}
        <section className="w-full border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-axia-gold/[0.15] dark:bg-[#030619]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold text-[#1a1a1c] dark:text-[#fcfcfc] tracking-[-0.02em] mb-4">
                Stop duct-taping. Start building.
              </h2>
              <p className="text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                Join {signupCount > 100 ? `${signupCount.toLocaleString()}` : "100+"} professionals already on the
                waitlist. Only {spotsRemaining} founding spots remaining.
              </p>
              {!isSuccess && (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto">
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    className="h-14 flex-1 bg-white dark:bg-[#0a1128] border border-[#dfe4eb] dark:border-[#1a2444] focus:border-axia-gold focus:ring-1 focus:ring-axia-gold/10 text-[#1a1a1c] dark:text-[#fcfcfc] placeholder:text-[#1a1a1c]/60 dark:placeholder:text-[#fcfcfc]/40 text-base rounded-lg px-4 focus:outline-none" />
                  <button type="submit" disabled={isLoading}
                    className="h-14 px-6 sm:px-8 bg-axia-gold hover:bg-axia-gold-light text-[#070F1B] font-semibold text-sm sm:text-base rounded-lg whitespace-nowrap cursor-pointer flex items-center justify-center disabled:opacity-60">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Early Access"}
                  </button>
                </form>
              )}
              {isSuccess && (
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-emerald-500 dark:text-emerald-400 font-medium">You&apos;re on the list! Check your referral link above.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer — theme-aware ─── */}
      <footer className="border-t border-[#dfe4eb] dark:border-[#1a2444]/60 bg-[#f4f5f8] dark:bg-[#060d20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-axia-gold rounded-md flex items-center justify-center">
              <span className="text-[#070F1B] font-bold text-xs">A</span>
            </div>
            <span className="text-sm text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50">&copy; {new Date().getFullYear()} Axia. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 hover:text-[#1a1a1c]/90 dark:hover:text-[#fcfcfc]/70 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 hover:text-[#1a1a1c]/90 dark:hover:text-[#fcfcfc]/70 transition-colors">Terms</a>
            <a href="#" className="text-sm text-[#1a1a1c]/70 dark:text-[#fcfcfc]/50 hover:text-[#1a1a1c]/90 dark:hover:text-[#fcfcfc]/70 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
