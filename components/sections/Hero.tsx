import { ArrowRight, Check, Mic, PieChart, ScanLine, Sparkles } from "lucide-react";
import home from "@/public/screenshots/home.png";
import { fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Landing } from "@/lib/landing";
import { PhoneMockup } from "../PhoneMockup";
import { StoreBadges } from "../StoreBadges";
import { TrackedLink } from "../ui/TrackedLink";

export function Hero({ t, landing }: { t: Dictionary; landing: Landing }) {
  const h = t.hero;
  const showFounding = landing.live && landing.spots_available;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:var(--gradient-hero)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />

      <div className="container-page relative grid items-center gap-14 pt-12 pb-20 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pt-24 lg:pb-28">
        <div className="max-w-xl">
          {showFounding ? (
            <a
              href="#pricing"
              className="glass mb-7 inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-fg"
            >
              <span className="anim-pulse-dot size-2 rounded-full bg-success" aria-hidden />
              {fmt(h.foundingPill, {
                remaining: landing.founding_remaining,
                limit: landing.founding_limit,
                months: landing.founding_months,
              })}
              <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
            </a>
          ) : (
            <p className="glass mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-muted">
              <Sparkles className="size-3.5 text-accent" aria-hidden />
              {h.eyebrow}
            </p>
          )}

          <h1 id="hero-title" className="text-display font-semibold text-balance">
            <span className="block text-fg">{h.titleA}</span>
            <span className="text-gradient block">{h.titleB}</span>
          </h1>

          <p className="mt-6 max-w-lg text-lead text-muted text-pretty">{h.lead}</p>

          <div id="hero-cta" className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <TrackedLink
              href={landing.contact.play_store_url}
              behavior="play"
              event="store_click"
              eventProps={{ store: "play", location: "hero" }}
              className="btn btn-primary btn-lg"
            >
              {h.primaryCta}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </TrackedLink>
            <TrackedLink
              href="#demo"
              event="cta_click"
              eventProps={{ location: "hero", target: "demo" }}
              className="btn btn-secondary btn-lg"
            >
              {h.secondaryCta}
            </TrackedLink>
          </div>

          <div className="mt-8">
            <StoreBadges
              location="hero"
              height={44}
              playStoreUrl={landing.contact.play_store_url}
              appStoreUrl={landing.contact.app_store_url || undefined}
              labels={t.store}
            />
            <p className="mt-4 flex items-center gap-2 text-sm text-subtle">
              <Check className="size-4 text-success" aria-hidden />
              {h.microcopy}
            </p>
          </div>
        </div>

        {/* Phone + floating glass cards. Cards are decorative illustrations. */}
        <div className="relative mx-auto w-full max-w-[420px] [perspective:1600px]">
          <div className="absolute inset-0 [background:radial-gradient(closest-side,var(--accent-soft),transparent)]" aria-hidden />
          <div className="relative mx-auto w-fit [transform:rotateY(-14deg)_rotateX(6deg)_rotateZ(1deg)] [transform-style:preserve-3d] rtl:[transform:rotateY(14deg)_rotateX(6deg)_rotateZ(-1deg)]">
            <div className="anim-float-md">
              <PhoneMockup src={home} alt={h.phoneAlt} width={280} preload />
            </div>
          </div>

          <FloatCard
            className="anim-float-md-delayed -start-2 top-24 sm:-start-16"
            icon={<ScanLine className="size-4" aria-hidden />}
            title={h.floatScanTitle}
            body={h.floatScanBody}
          />
          <FloatCard
            className="anim-float-md -end-2 top-[52%] sm:-end-14"
            icon={<PieChart className="size-4" aria-hidden />}
            title={h.floatBudgetTitle}
            body={h.floatBudgetBody}
            progress={72}
          />
          <FloatCard
            className="anim-float-md-delayed -start-2 bottom-6 sm:-start-12"
            icon={<Mic className="size-4" aria-hidden />}
            title={h.floatAskTitle}
            body={h.floatAskBody}
          />
        </div>
      </div>
    </section>
  );
}

function FloatCard({
  className,
  icon,
  title,
  body,
  progress,
}: {
  className: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  progress?: number;
}) {
  return (
    <div
      aria-hidden
      className={`absolute z-10 w-[200px] rounded-lg border border-line-strong bg-surface-strong p-3 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-fg">{title}</p>
          <p className="truncate text-[12px] text-muted">{body}</p>
        </div>
      </div>
      {progress != null && (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-hover">
          <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
