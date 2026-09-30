import { fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { whatsappHref } from "@/lib/api";
import type { Landing } from "@/lib/landing";
import { PLAN_COMPARISON } from "@/lib/product";
import { CheckCell } from "../ui/CheckCell";
import { SectionHeader } from "../ui/SectionHeader";
import { PricingCards } from "./PricingCards";

export function Pricing({ t, landing }: { t: Dictionary; landing: Landing }) {
  const p = t.pricing;
  const upgradeHref = `${whatsappHref(landing.contact.whatsapp)}?text=${encodeURIComponent(
    "Hi! I'd like to upgrade my Cortix SL account to Pro.",
  )}`;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y cv-auto">
      <div className="container-page">
        <SectionHeader id="pricing-title" eyebrow={p.eyebrow} title={p.title} lead={p.lead} />

        <FoundingBanner t={t} landing={landing} />

        <PricingCards
          t={p}
          playStoreUrl={landing.contact.play_store_url}
          upgradeHref={upgradeHref}
          founding={{
            limit: landing.founding_limit,
            months: landing.founding_months,
            available: landing.spots_available,
          }}
        />

        <div className="mt-20">
          <h3 className="mb-6 text-center text-xl font-semibold text-fg">{p.tableTitle}</h3>
          <div className="glass overflow-x-auto rounded-xl">
            <table className="w-full min-w-[600px] border-collapse">
              <caption className="sr-only">{p.tableTitle}</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 text-start text-sm font-medium text-subtle">{p.tableFeature}</th>
                  <th scope="col" className="p-4 text-center text-sm font-semibold text-fg">{p.free.name}</th>
                  <th scope="col" className="bg-accent-soft p-4 text-center text-sm font-semibold text-accent">{p.pro.name}</th>
                  <th scope="col" className="p-4 text-center text-sm font-semibold text-fg">{p.founding.name}</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-line last:border-0">
                    <th scope="row" className="p-4 text-start text-[15px] font-normal text-fg">{row.feature}</th>
                    <td className="p-4 text-center"><CheckCell value={row.free} yes={p.included} no={p.notIncluded} /></td>
                    <td className="bg-accent-soft p-4 text-center"><CheckCell value={row.pro} yes={p.included} no={p.notIncluded} /></td>
                    <td className="p-4 text-center"><CheckCell value={row.founding} yes={p.included} no={p.notIncluded} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Founding-member banner with the live counter from GET /public/landing.
 * Shows "X of Y left" (never a bare "0 claimed"); hides the number entirely
 * if the API is down rather than showing a made-up value.
 */
function FoundingBanner({ t, landing }: { t: Dictionary; landing: Landing }) {
  const f = t.founding;
  const vars = {
    limit: landing.founding_limit,
    months: landing.founding_months,
    remaining: landing.founding_remaining,
  };
  const claimedPct =
    landing.founding_limit > 0
      ? Math.round(((landing.founding_limit - landing.founding_remaining) / landing.founding_limit) * 100)
      : 0;

  return (
    <div className="relative mb-14 overflow-hidden rounded-xl border border-success/30 bg-success/[0.06] p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
      <div className="max-w-xl">
        <p className="text-lg font-semibold text-fg md:text-xl">{fmt(f.title, vars)}</p>
        <p className="mt-2 text-[15px] text-muted">{fmt(f.body, vars)}</p>
      </div>
      <div className="mt-6 w-full shrink-0 md:mt-0 md:w-72">
        {!landing.live ? (
          <p className="text-sm font-medium text-muted">{fmt(f.noLive, vars)}</p>
        ) : landing.spots_available ? (
          <>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
              <span className="anim-pulse-dot size-2 rounded-full bg-success" aria-hidden />
              {fmt(f.remaining, vars)}
            </p>
            <div
              role="progressbar"
              aria-label={f.progressLabel}
              aria-valuemin={0}
              aria-valuemax={landing.founding_limit}
              aria-valuenow={landing.founding_limit - landing.founding_remaining}
              className="h-2 overflow-hidden rounded-full bg-surface-hover"
            >
              <div className="h-full rounded-full bg-success" style={{ width: `${Math.max(claimedPct, 2)}%` }} />
            </div>
          </>
        ) : (
          <p className="text-sm font-medium text-muted">{f.full}</p>
        )}
      </div>
    </div>
  );
}
