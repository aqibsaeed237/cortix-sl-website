"use client";

import { Check } from "lucide-react";
import { useId, useState } from "react";
import { fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { track } from "@/lib/analytics";
import {
  availableCurrencies,
  formatMoney,
  proMonthlyEquivalent,
  proYearlyTotal,
  PRICING_CURRENCIES,
  YEARLY_BILLING,
  type BillingPeriod,
  type PricingCurrency,
} from "@/lib/pricing";
import { FREE_LIMITS } from "@/lib/product";
import { openPlayStore } from "@/lib/storeLinks";

type Props = {
  t: Dictionary["pricing"];
  playStoreUrl: string;
  upgradeHref: string;
  founding: { limit: number; months: number; available: boolean };
};

export function PricingCards({ t, playStoreUrl, upgradeHref, founding }: Props) {
  const currencies = availableCurrencies();
  const [currency, setCurrency] = useState<PricingCurrency>(currencies[0] ?? "PKR");
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const currencyId = useId();

  const proMonthly = proMonthlyEquivalent(currency, period);
  const proYear = proYearlyTotal(currency);

  const playClick = (plan: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    track("store_click", { store: "play", location: `pricing_${plan}` });
    openPlayStore(playStoreUrl, `pricing_${plan}`);
  };

  return (
    <>
      {(YEARLY_BILLING.enabled || currencies.length > 1) && (
        <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {YEARLY_BILLING.enabled && (
            <div role="radiogroup" aria-label={`${t.monthly} / ${t.yearly}`} className="glass inline-flex rounded-full p-1">
              {(["monthly", "yearly"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={period === p}
                  onClick={() => {
                    setPeriod(p);
                    track("pricing_change", { period: p });
                  }}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${
                    period === p ? "bg-fg text-bg" : "text-muted hover:text-fg"
                  }`}
                >
                  {p === "monthly" ? t.monthly : t.yearly}
                  {p === "yearly" && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                      {fmt(t.save, { pct: YEARLY_BILLING.discountPct })}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {currencies.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor={currencyId} className="text-sm text-muted">
                {t.currencyLabel}
              </label>
              <select
                id={currencyId}
                value={currency}
                onChange={(e) => {
                  const c = e.target.value as PricingCurrency;
                  setCurrency(c);
                  track("pricing_change", { currency: c });
                }}
                className="min-h-11 rounded-full border border-line-strong bg-surface-strong px-4 text-sm font-medium text-fg"
              >
                {PRICING_CURRENCIES.filter((c) => currencies.includes(c)).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <ul className="grid items-stretch gap-4 lg:grid-cols-3">
        {/* Free */}
        <Card>
          <PlanName>{t.free.name}</PlanName>
          <Price amount={formatMoney(0, currency)} suffix={t.forever} />
          <p className="mt-3 text-[15px] text-muted">{t.free.desc}</p>
          <Bullets
            items={t.free.bullets.map((b) =>
              fmt(b, { entries: FREE_LIMITS.entriesPerMonth, groups: FREE_LIMITS.splitGroups }),
            )}
          />
          <a href={playStoreUrl} onClick={playClick("free")} className="btn btn-secondary mt-auto w-full">
            {t.free.cta}
          </a>
        </Card>

        {/* Pro — highlighted */}
        <Card highlight>
          <span className="absolute -top-3 start-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg">
            {t.pro.badge}
          </span>
          <PlanName>{t.pro.name}</PlanName>
          {proMonthly != null ? (
            <>
              <Price amount={formatMoney(proMonthly, currency)} suffix={t.perMonth} />
              {YEARLY_BILLING.enabled && period === "yearly" && proYear != null && (
                <p className="mt-1 text-sm text-subtle">
                  {fmt(t.billedYearly, { total: formatMoney(proYear, currency) })}
                </p>
              )}
            </>
          ) : (
            <>
              <Price amount={t.pro.priceTbd} />
              <p className="mt-1 text-sm text-subtle">{fmt(t.pro.priceTbdNote, { currency })}</p>
            </>
          )}
          <p className="mt-3 text-[15px] text-muted">{t.pro.desc}</p>
          <Bullets items={t.pro.bullets} />
          <a
            href={upgradeHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("cta_click", { location: "pricing_pro", target: "upgrade" })}
            className="btn btn-primary mt-auto w-full"
          >
            {t.pro.cta}
          </a>
          <p className="mt-3 text-center text-xs text-subtle">{t.pro.manualNote}</p>
        </Card>

        {/* Founding */}
        <Card>
          <span className="absolute -top-3 start-6 rounded-full border border-success/40 bg-bg px-3 py-1 text-xs font-semibold text-success">
            {t.founding.badge}
          </span>
          <PlanName>{t.founding.name}</PlanName>
          <Price amount={t.founding.priceLabel} suffix={fmt(t.founding.period, { months: founding.months })} />
          <p className="mt-3 text-[15px] text-muted">{fmt(t.founding.desc, { limit: founding.limit })}</p>
          <Bullets items={t.founding.bullets} />
          <a
            href={playStoreUrl}
            onClick={playClick("founding")}
            className="btn btn-secondary mt-auto w-full"
          >
            {founding.available ? t.founding.cta : t.free.cta}
          </a>
        </Card>
      </ul>
    </>
  );
}

function Card({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <li
      className={`relative flex flex-col rounded-xl p-7 ${
        highlight ? "border border-accent/50 bg-surface-strong shadow-glow lg:-my-3 lg:py-10" : "glass"
      }`}
    >
      {children}
    </li>
  );
}

function PlanName({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-fg">{children}</h3>;
}

function Price({ amount, suffix }: { amount: string; suffix?: string }) {
  return (
    <p className="mt-4 flex items-baseline gap-1.5">
      <span className="text-4xl font-semibold tracking-tight text-fg">{amount}</span>
      {suffix && <span className="text-sm text-subtle">{suffix}</span>}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="my-7 space-y-3">
      {items.map((b) => (
        <li key={b} className="flex gap-3 text-[15px] text-fg">
          <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          {b}
        </li>
      ))}
    </ul>
  );
}
