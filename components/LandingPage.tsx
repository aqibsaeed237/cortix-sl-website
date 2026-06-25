"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Mic,
  Search,
  BarChart2,
  Bell,
  FileText,
  Check,
  X,
  Star,
  Sparkles,
  Receipt,
  Menu,
  Mail,
  Phone,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { IPhoneMockup } from "./IPhoneMockup";
import { ScreenshotThumb } from "./ScreenshotThumb";
import { useLandingData } from "@/hooks/useLandingData";
import {
  formatPhoneDisplay,
  telHref,
  whatsappHref,
} from "@/lib/api";
import type { LandingData } from "@/lib/types";

const C = {
  navy: "#0F2240",
  navyLight: "#E8EEF5",
  navyDark: "#0A1829",
  navyDim: "#F1F5F9",
  cyan: "#38BDF8",
  cyanLight: "#E0F2FE",
  teal: "#1D9E75",
  tealLight: "#E8F7F2",
  green: "#22C55E",
  bg: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
  dark: "#0B1221",
  darkMid: "#142438",
};

const shadow = "0 1px 3px rgba(0,0,0,0.08)";
const shadowMd = "0 4px 12px rgba(0,0,0,0.08)";
const shadowLg = "0 8px 24px rgba(0,0,0,0.08)";

const F = "var(--font-inter), 'Inter', -apple-system, sans-serif";

const SCREENSHOTS = {
  home: "/screenshots/home.png",
  analytics: "/screenshots/analytics.png",
  budget: "/screenshots/budget.png",
  addExpense: "/screenshots/add-expense.png",
  splash: "/screenshots/splash.png",
  export: "/screenshots/export.png",
  help: "/screenshots/help.png",
  settings: "/screenshots/settings.png",
  aiSearch: "/screenshots/ai-search.png",
} as const;

function Section({
  children,
  bg = C.bg,
  style = {},
  id,
}: {
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  return (
    <section id={id} style={{ background: bg, padding: "80px 24px", ...style }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: C.navyLight,
        borderRadius: 99,
        padding: "4px 12px",
        marginBottom: 20,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.navy,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
  size = "md",
  full = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  full?: boolean;
}) {
  const pad =
    size === "lg" ? "14px 28px" : size === "sm" ? "8px 16px" : "11px 22px";
  const fs = size === "lg" ? 16 : size === "sm" ? 13 : 14;
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.navyDark : C.navy,
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: pad,
        fontSize: fs,
        fontWeight: 600,
        fontFamily: F,
        cursor: "pointer",
        transition: "background 0.15s, transform 0.1s",
        transform: hov ? "translateY(-1px)" : "none",
        width: full ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        boxShadow: hov ? `0 4px 12px ${C.navy}40` : "none",
      }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.navyDim : "transparent",
        color: C.navy,
        border: `1.5px solid ${C.navy}`,
        borderRadius: 8,
        padding: "10px 20px",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: F,
        cursor: "pointer",
        transition: "all 0.15s",
        width: "100%",
      }}
    >
      {children}
    </button>
  );
}

function EmailCapture({
  placeholder = "Enter your email address",
  btnLabel = "Claim your spot →",
  dark = false,
  onSubmit,
  disabled = false,
}: {
  placeholder?: string;
  btnLabel?: string;
  dark?: boolean;
  onSubmit?: (email: string) => Promise<{ message: string }>;
  disabled?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.includes("@") || submitting || disabled) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (onSubmit) {
        const result = await onSubmit(email);
        setMessage(result.message);
      } else {
        setMessage("You're in! We'll be in touch soon.");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: C.tealLight,
          borderRadius: 8,
          border: `1px solid ${C.teal}40`,
        }}
      >
        <Check size={18} color={C.teal} />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>
          {message || "You're in! We'll be in touch soon."}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          type="email"
          disabled={submitting || disabled}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "12px 16px",
            border: `1.5px solid ${dark ? "rgba(255,255,255,0.15)" : C.border}`,
            borderRadius: 8,
            fontSize: 14,
            fontFamily: F,
            background: dark ? "rgba(255,255,255,0.08)" : C.white,
            color: dark ? "white" : C.text,
            outline: "none",
            transition: "border 0.15s",
            opacity: submitting || disabled ? 0.7 : 1,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = C.cyan;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = dark
              ? "rgba(255,255,255,0.15)"
              : C.border;
          }}
        />
        <PrimaryBtn onClick={handleSubmit}>
          {submitting ? "Saving..." : btnLabel}
        </PrimaryBtn>
      </div>
      {submitError && (
        <div style={{ fontSize: 12, color: "#DC2626", marginTop: 8 }}>
          {submitError}
        </div>
      )}
    </div>
  );
}

function FoundingCard({
  data,
  onSubmit,
}: {
  data: LandingData;
  onSubmit: (email: string) => Promise<{ message: string }>;
}) {
  const spots = data.founding_remaining;
  const totalSpots = data.founding_limit;
  const filled = totalSpots > 0 ? ((totalSpots - spots) / totalSpots) * 100 : 0;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${C.navyLight} 0%, ${C.white} 100%)`,
        border: `1.5px solid ${C.navy}30`,
        borderRadius: 16,
        padding: "28px 24px",
        boxShadow: shadowLg,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: `${C.navy}15`,
          borderRadius: 99,
          padding: "4px 10px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.teal,
            boxShadow: `0 0 6px ${C.teal}`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.navy,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Founding Member — Limited
        </span>
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: C.navy,
          lineHeight: 1,
          fontFamily: F,
          letterSpacing: "-0.03em",
          marginBottom: 4,
        }}
      >
        {spots}
      </div>
      <div
        style={{
          fontSize: 15,
          color: C.muted,
          fontWeight: 500,
          marginBottom: 20,
        }}
      >
        founding spots remaining out of {totalSpots}
      </div>
      <div
        style={{
          background: `${C.navy}15`,
          borderRadius: 99,
          height: 6,
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${filled}%`,
            background: C.navy,
            borderRadius: 99,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <span style={{ fontSize: 12, color: C.muted }}>
          {totalSpots - spots} claimed
        </span>
        <span style={{ fontSize: 12, color: C.muted }}>{spots} remaining</span>
      </div>
      <EmailCapture
        placeholder="you@company.com"
        btnLabel={data.spots_available ? "Claim your spot →" : "Join waitlist →"}
        onSubmit={onSubmit}
        disabled={!data.spots_available && data.founding_remaining === 0}
      />
      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          `Pro free for ${data.founding_months} months`,
          "Lifetime 40% discount after year 1",
          "Direct access to the founding team",
          "Shape features with feedback",
        ].map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={14} color={C.teal} />
            <span style={{ fontSize: 13, color: C.muted }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  accent?: string;
}) {
  const [hov, setHov] = useState(false);
  const col = accent || C.navy;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white,
        border: `1px solid ${hov ? col + "40" : C.border}`,
        borderRadius: 12,
        padding: "24px",
        boxShadow: hov ? shadowMd : shadow,
        transition: "all 0.2s",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${col}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={20} color={col} />
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: C.text,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  period,
  desc,
  features,
  cta,
  featured,
  filled,
  badge,
}: {
  plan: string;
  price: string;
  period: string;
  desc: string;
  features: [string, boolean][];
  cta: string;
  featured?: boolean;
  filled?: boolean;
  badge?: string;
}) {
  return (
    <div
      style={{
        background: filled ? C.navy : C.white,
        border: `${featured || filled ? "2" : "1"}px solid ${filled ? "transparent" : featured ? C.navy : C.border}`,
        borderRadius: 16,
        padding: "28px 24px",
        flex: 1,
        minWidth: 240,
        position: "relative",
        boxShadow: featured ? `0 0 0 1px ${C.navy}, ${shadowLg}` : shadow,
      }}
    >
      {featured && !filled && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.navy,
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 99,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          MOST POPULAR
        </div>
      )}
      {filled && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.teal,
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 99,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          ONLY {badge ?? "100"} SPOTS
        </div>
      )}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: filled ? "rgba(255,255,255,0.6)" : C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 12,
        }}
      >
        {plan}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: filled ? "white" : C.text,
            letterSpacing: "-0.03em",
          }}
        >
          {price}
        </span>
        <span
          style={{
            fontSize: 14,
            color: filled ? "rgba(255,255,255,0.5)" : C.muted,
          }}
        >
          {period}
        </span>
      </div>
      <div
        style={{
          fontSize: 14,
          color: filled ? "rgba(255,255,255,0.65)" : C.muted,
          marginBottom: 24,
          lineHeight: 1.5,
        }}
      >
        {desc}
      </div>
      <div
        style={{
          height: 1,
          background: filled ? "rgba(255,255,255,0.12)" : C.border,
          marginBottom: 20,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 28,
        }}
      >
        {features.map(([label, included]) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            {included ? (
              <Check
                size={15}
                color={filled ? "rgba(255,255,255,0.9)" : C.teal}
              />
            ) : (
              <X
                size={15}
                color={filled ? "rgba(255,255,255,0.25)" : "#D1D5DB"}
              />
            )}
            <span
              style={{
                fontSize: 14,
                color: filled
                  ? included
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.35)"
                  : included
                    ? C.text
                    : "#9CA3AF",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      {filled ? (
        <PrimaryBtn full size="md">
          {cta}
        </PrimaryBtn>
      ) : featured ? (
        <PrimaryBtn full size="md">
          {cta}
        </PrimaryBtn>
      ) : (
        <OutlineBtn>{cta}</OutlineBtn>
      )}
    </div>
  );
}

function Testimonial({
  quote,
  name,
  role,
  rating = 5,
}: {
  quote: string;
  name: string;
  role: string;
  rating?: number;
}) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "24px",
        boxShadow: shadow,
      }}
    >
      <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
        ))}
      </div>
      <p
        style={{
          fontSize: 15,
          color: C.text,
          lineHeight: 1.65,
          margin: "0 0 20px",
          fontStyle: "italic",
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `${C.navy}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: C.navy,
          }}
        >
          {name[0]}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

function StoreBadges({
  appStoreUrl,
  playStoreUrl,
}: {
  appStoreUrl?: string;
  playStoreUrl?: string;
}) {
  const badges = [
    {
      label: "App Store",
      sub: "Download on the",
      icon: "🍎",
      href: appStoreUrl,
    },
    {
      label: "Google Play",
      sub: "Get it on",
      icon: "▶",
      href: playStoreUrl,
    },
  ];

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {badges.map(({ label, sub, icon, href }) => {
        const inner = (
          <>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 500,
                }}
              >
                {sub}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
                {label}
              </div>
            </div>
          </>
        );
        const style = {
          display: "flex",
          alignItems: "center" as const,
          gap: 10,
          background: C.text,
          borderRadius: 10,
          padding: "10px 18px",
          cursor: "pointer" as const,
          textDecoration: "none" as const,
        };
        return href ? (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={style}>
            {inner}
          </a>
        ) : (
          <div key={label} style={style}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(248,250,252,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${C.border}`
          : "1px solid transparent",
        transition: "all 0.25s",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.cyan}, #6366F1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              SL
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: C.text,
                fontFamily: F,
              }}
            >
              Cortix SL
            </span>
            <span
              style={{
                fontSize: 11,
                color: C.muted,
                marginLeft: 6,
                fontWeight: 400,
              }}
            >
              by Tech Cortix
            </span>
          </div>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 8 }}
          className="nav-desktop"
        >
          {[
            ["Features", "features"],
            ["App Preview", "preview"],
            ["Pricing", "pricing"],
          ].map(([label, id]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              style={{
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                color: C.muted,
                cursor: "pointer",
                fontFamily: F,
                padding: "6px 12px",
                borderRadius: 6,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.muted;
              }}
            >
              {label}
            </button>
          ))}
          <div
            style={{
              width: 1,
              height: 20,
              background: C.border,
              margin: "0 4px",
            }}
          />
          <PrimaryBtn size="sm" onClick={() => scrollTo("pricing")}>
            Claim Founding Spot
          </PrimaryBtn>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-mobile"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "none",
          }}
        >
          <Menu size={20} color={C.text} />
        </button>
      </div>
      {menuOpen && (
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            margin: "0 24px 12px",
            padding: 16,
            boxShadow: shadowLg,
          }}
          className="nav-mobile"
        >
          {[
            ["Features", "features"],
            ["App Preview", "preview"],
            ["Pricing", "pricing"],
          ].map(([label, id]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
                fontSize: 15,
                fontWeight: 500,
                color: C.text,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: F,
              }}
            >
              {label}
            </button>
          ))}
          <div style={{ marginTop: 12 }}>
            <PrimaryBtn size="md" full onClick={() => scrollTo("pricing")}>
              Claim Founding Spot
            </PrimaryBtn>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function LandingPage() {
  const { data, loading, error, joinWaitlist, signupLabel } = useLandingData();
  const contact = data.contact;

  const handleWaitlist = async (email: string) => {
    const result = await joinWaitlist(email);
    return { message: result.message };
  };

  const FEATURES = [
    {
      icon: Camera,
      title: "OCR Receipt Scan",
      desc: "Snap a receipt — AI extracts merchant, amount, tax, and date automatically.",
      accent: C.navy,
    },
    {
      icon: Mic,
      title: "Voice & AI Entry",
      desc: "Say 'Paid 2500 at KFC for lunch' and Cortix creates the expense instantly.",
      accent: "#7C3AED",
    },
    {
      icon: Search,
      title: "AI Search",
      desc: "Ask in plain language — 'How much on Food & Dining this month?' — get exact answers.",
      accent: C.teal,
    },
    {
      icon: BarChart2,
      title: "Smart Analytics",
      desc: "Daily, weekly, and monthly trends with interactive charts and category breakdowns.",
      accent: "#0891B2",
    },
    {
      icon: Bell,
      title: "Budget Alerts",
      desc: "Set monthly budgets, track category limits, and get alerts before you overspend.",
      accent: "#D97706",
    },
    {
      icon: FileText,
      title: "Export Reports",
      desc: "CSV, Excel, and PDF exports with Cortix SL branding — ready for your accountant.",
      accent: "#DC2626",
    },
  ];

  const FREE_FEATURES: [string, boolean][] = [
    ["Manual expense entry", true],
    ["OCR receipt scan (10/mo)", true],
    ["Basic categories", true],
    ["Monthly export", true],
    ["AI voice entry", false],
    ["AI search & insights", false],
    ["Unlimited OCR", false],
    ["Budget alerts", false],
    ["Priority support", false],
  ];
  const PRO_FEATURES: [string, boolean][] = [
    ["Everything in Free", true],
    ["Unlimited OCR scans", true],
    ["AI voice entry", true],
    ["AI search & insights", true],
    ["Budget alerts & forecasts", true],
    ["CSV, PDF & Excel export", true],
    ["Analytics dashboard", true],
    ["Priority support", true],
    ["Early access to features", true],
  ];
  const FOUNDING_FEATURES: [string, boolean][] = [
    ["Everything in Pro — free", true],
    [`${data.founding_months} months no charge`, true],
    ["Lifetime 40% discount", true],
    ["Founding badge in app", true],
    ["Direct founder access", true],
    ["Shape the roadmap", true],
    ["Private beta features", true],
    ["White-glove onboarding", true],
    ["Invoice on request", true],
  ];

  const APP_SCREENS = [
    { src: SCREENSHOTS.home, label: "Dashboard" },
    { src: SCREENSHOTS.analytics, label: "Analytics" },
    { src: SCREENSHOTS.budget, label: "Budget" },
    { src: SCREENSHOTS.addExpense, label: "Add Expense" },
    { src: SCREENSHOTS.aiSearch, label: "AI Search" },
    { src: SCREENSHOTS.export, label: "Export & Reports" },
    { src: SCREENSHOTS.settings, label: "Settings" },
    { src: SCREENSHOTS.help, label: "Help & FAQ" },
    { src: SCREENSHOTS.splash, label: "Splash" },
  ];

  return (
    <div
      style={{
        background: C.bg,
        fontFamily: F,
        color: C.text,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <Section style={{ padding: "72px 24px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 64,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <div style={{ maxWidth: 560 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: C.tealLight,
                border: `1px solid ${C.teal}30`,
                borderRadius: 99,
                padding: "5px 12px",
                marginBottom: 24,
              }}
            >
              <Sparkles size={12} color={C.teal} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>
                Spend · Ledger · Intelligence
              </span>
            </div>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.1,
                margin: "0 0 20px",
                letterSpacing: "-0.03em",
              }}
            >
              AI Expense Tracker — track every expense.
              <br />
              <span style={{ color: C.navy }}>Understand every spend.</span>
            </h1>
            <p
              style={{
                fontSize: 18,
                color: C.muted,
                lineHeight: 1.65,
                margin: "0 0 36px",
                fontWeight: 400,
                maxWidth: 480,
              }}
            >
              The best receipt scanner &amp; budget tracker app for Pakistan — OCR
              receipt scan, voice entry, smart analytics, and export reports. Built
              for individuals and small businesses.
            </p>
            <div style={{ marginBottom: 32 }}>
              <FoundingCard data={data} onSubmit={handleWaitlist} />
            </div>
            <StoreBadges
              appStoreUrl={contact.app_store_url || undefined}
              playStoreUrl={contact.play_store_url || undefined}
            />
            {error && (
              <div style={{ fontSize: 12, color: C.muted, marginTop: 12 }}>
                Live stats unavailable — showing cached defaults.
              </div>
            )}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {[
                [signupLabel, "beta signups"],
                ["4.8★", "early feedback"],
                ["<2s", "scan speed"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div
                    style={{ fontSize: 18, fontWeight: 700, color: C.text }}
                  >
                    {v}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              flexShrink: 0,
            }}
            className="hero-phones"
          >
            <div style={{ transform: "translateY(20px)" }}>
              <IPhoneMockup
                src={SCREENSHOTS.analytics}
                alt="Cortix SL Analytics screen"
                scale={0.9}
              />
            </div>
            <IPhoneMockup
              src={SCREENSHOTS.home}
              alt="Cortix SL Home dashboard"
              scale={0.98}
              priority
            />
          </div>
        </div>
      </Section>

      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          background: C.white,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            `${signupLabel} beta signups`,
            `${data.founding_remaining} founding spots left`,
            "Powered by Gemini AI",
            `Built by ${contact.company_name}`,
          ].map((item, i, arr) => (
            <div
              key={item}
              style={{ display: "flex", alignItems: "center", gap: 20 }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: C.muted,
                  fontWeight: 500,
                  padding: "0 24px",
                }}
              >
                {item}
              </span>
              {i < arr.length - 1 && (
                <div style={{ width: 1, height: 16, background: C.border }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Section id="features">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>Features</SectionLabel>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: C.text,
              margin: "0 auto",
              letterSpacing: "-0.025em",
              maxWidth: 600,
            }}
          >
            Everything you need,
            <br />
            nothing you don&apos;t.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.muted,
              marginTop: 16,
              lineHeight: 1.6,
            }}
          >
            Six core capabilities, designed to make expense tracking invisible.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
          }}
          className="feature-grid"
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section id="preview" bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>App Preview</SectionLabel>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: C.text,
              margin: "0 auto",
              letterSpacing: "-0.025em",
            }}
          >
            See Cortix SL in action.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.muted,
              marginTop: 16,
              lineHeight: 1.6,
            }}
          >
            Real screens from the app — dashboard, analytics, budgets, AI search,
            and more.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
          className="preview-grid"
        >
          {APP_SCREENS.map((s) => (
            <ScreenshotThumb key={s.label} src={s.src} label={s.label} />
          ))}
        </div>
      </Section>

      <Section>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>How it works</SectionLabel>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: C.text,
              margin: "0 auto",
              letterSpacing: "-0.025em",
            }}
          >
            Up and running in 3 steps.
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 32,
          }}
          className="steps-grid"
        >
          {[
            {
              n: "01",
              title: "Claim your founding spot",
              desc: "Sign up above. Your Founding plan is auto-assigned — no credit card, no catch.",
              src: SCREENSHOTS.splash,
              alt: "Cortix SL splash screen",
            },
            {
              n: "02",
              title: "Add your first expense",
              desc: "Manually, scan a receipt, or speak naturally. AI categorizes it instantly.",
              src: SCREENSHOTS.addExpense,
              alt: "Add expense screen",
            },
            {
              n: "03",
              title: "Ask AI anything",
              desc: "Type 'How much did I spend on food this month?' and get an exact answer.",
              src: SCREENSHOTS.aiSearch,
              alt: "AI Search screen",
            },
          ].map(({ n, title, desc, src, alt }) => (
            <div
              key={n}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: C.navyLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: C.navy,
                  marginBottom: 20,
                  border: `1px solid ${C.navy}25`,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: 10,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.65,
                  marginBottom: 28,
                }}
              >
                {desc}
              </div>
              <IPhoneMockup src={src} alt={alt} scale={0.72} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="pricing">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel>Pricing</SectionLabel>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: C.text,
              margin: "0 auto",
              letterSpacing: "-0.025em",
            }}
          >
            Simple, honest pricing.
          </h2>
          <p style={{ fontSize: 17, color: C.muted, marginTop: 16 }}>
            Start free. Upgrade when you&apos;re ready. Found early — get Pro for
            nothing.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <PricingCard
            plan="Free"
            price="PKR 0"
            period="/forever"
            desc="Core expense tracking for individuals getting started."
            features={FREE_FEATURES}
            cta="Get started free"
          />
          <PricingCard
            plan="Pro"
            price="PKR 499"
            period="/mo"
            desc="The full AI-powered experience for serious trackers."
            features={PRO_FEATURES}
            cta="Start Pro — 7 days free"
            featured
          />
          <PricingCard
            plan="Founding"
            price="Free"
            period={`/${data.founding_months} months`}
            desc="Founding members get Pro free for a year, plus lifetime discount."
            features={FOUNDING_FEATURES}
            cta={
              data.spots_available
                ? "Claim founding spot →"
                : "Join waitlist →"
            }
            filled
            badge={String(data.founding_limit)}
          />
        </div>
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 13,
            color: C.muted,
          }}
        >
          All plans include end-to-end encryption. No hidden fees. Cancel
          anytime.
        </div>
      </Section>

      <Section bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Beta Feedback</SectionLabel>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: C.text,
              letterSpacing: "-0.025em",
            }}
          >
            Early users love it.
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
          className="testimonial-grid"
        >
          <Testimonial
            quote="Finally an expense app that doesn't feel like work. Scanned 3 months of receipts in 10 minutes. The AI search alone is worth it."
            name="Sara K."
            role="Freelance Designer"
          />
          <Testimonial
            quote="I run a small agency. Cortix SL cut my monthly bookkeeping time from 4 hours to 20 minutes. The export feature is exactly what my accountant needed."
            name="James R."
            role="Agency Owner"
          />
          <Testimonial
            quote="The voice entry is mind-blowing. I just say what I spent and it's categorized and logged. My whole team uses it now."
            name="Aisha M."
            role="Operations Lead"
          />
        </div>
      </Section>

      <section
        style={{
          background: C.dark,
          padding: "88px 24px",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 99,
              padding: "5px 14px",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.teal,
                boxShadow: `0 0 6px ${C.teal}`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.1em",
              }}
            >
              {data.founding_remaining} FOUNDING SPOTS REMAINING
            </span>
          </div>
          <h2
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "white",
              margin: "0 0 16px",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Join the first {data.founding_limit}.
            <br />
            Get Pro free for {data.founding_months} months.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 36px",
              lineHeight: 1.6,
            }}
          >
            No credit card. No commitment. Just early access to the smartest
            expense tracker — available worldwide.
          </p>
          <EmailCapture
            placeholder="you@company.com"
            btnLabel={
              data.spots_available ? "Claim founding spot →" : "Join waitlist →"
            }
            dark
            onSubmit={handleWaitlist}
          />
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              "No credit card required",
              "Cancel anytime",
              "Founding discount locked forever",
            ].map((p) => (
              <div
                key={p}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Check size={13} color={C.teal} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        style={{
          background: C.darkMid,
          padding: "48px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 32,
              marginBottom: 40,
            }}
            className="footer-grid"
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: `linear-gradient(135deg, ${C.cyan}, #6366F1)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      color: "white",
                    }}
                  >
                    SL
                  </span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
                  Cortix SL
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.12em",
                }}
              >
                SPEND · LEDGER · INTELLIGENCE
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                CONTACT
              </div>
              <a
                href={`mailto:${contact.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  marginBottom: 8,
                }}
              >
                <Mail size={14} />
                {contact.email}
              </a>
              <a
                href={telHref(contact.phone)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  marginBottom: 8,
                }}
              >
                <Phone size={14} />
                {formatPhoneDisplay(contact.phone)}
              </a>
              <a
                href={whatsappHref(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={14} />
                WhatsApp us
              </a>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                LINKS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Privacy", "Terms", "Features", "Pricing"].map((l) => (
                  <span
                    key={l}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.25)",
              }}
            >
              A product by{" "}
              <span
                style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}
              >
                {contact.company_name}
              </span>{" "}
              · © 2026
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <Receipt size={12} />
              {loading ? "Syncing live data..." : "Live data from API"}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-phones {
            display: none !important;
          }
          .feature-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .preview-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonial-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile {
            display: flex !important;
          }
        }
        @media (max-width: 560px) {
          .feature-grid,
          .preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
