/**
 * Pro plan pricing.
 *
 * IMPORTANT — no price exists in the backend or app billing today: Pro is
 * activated manually by the team, and there is no yearly plan. Only fill in
 * numbers the business has actually decided.
 *
 * - The currency switcher shows only currencies that have a `monthly` price.
 *   (With a single currency, no switcher is rendered.)
 * - The monthly/yearly toggle appears only when YEARLY_BILLING is enabled.
 */

export const PRICING_CURRENCIES = ["PKR", "USD", "AED", "GBP"] as const;
export type PricingCurrency = (typeof PRICING_CURRENCIES)[number];

type Price = { monthly: number | null; yearly: number | null };

export const PRO_PRICES: Record<PricingCurrency, Price> = {
  // TODO(pricing): confirm. The live site showed PKR 499/mo; the app's unused
  // l10n string `pricePerMonth` says "PKR 1,499 / month" (app_en.arb:416).
  PKR: { monthly: 499, yearly: null },
  USD: { monthly: null, yearly: null }, // TODO(pricing): set USD price
  AED: { monthly: null, yearly: null }, // TODO(pricing): set AED price
  GBP: { monthly: null, yearly: null }, // TODO(pricing): set GBP price
};

export const YEARLY_BILLING = {
  // TODO(pricing): turn on once yearly plans exist.
  enabled: false,
  /** Used to derive a yearly price when PRO_PRICES[cur].yearly is null. */
  discountPct: 20,
};

export type BillingPeriod = "monthly" | "yearly";

export function availableCurrencies(): PricingCurrency[] {
  return PRICING_CURRENCIES.filter((c) => PRO_PRICES[c].monthly != null);
}

/** Price per month for the chosen period, or null if not configured. */
export function proMonthlyEquivalent(
  currency: PricingCurrency,
  period: BillingPeriod,
): number | null {
  const p = PRO_PRICES[currency];
  if (p.monthly == null) return null;
  if (period === "monthly" || !YEARLY_BILLING.enabled) return p.monthly;
  const yearly = p.yearly ?? p.monthly * 12 * (1 - YEARLY_BILLING.discountPct / 100);
  return yearly / 12;
}

export function proYearlyTotal(currency: PricingCurrency): number | null {
  const p = PRO_PRICES[currency];
  if (p.monthly == null) return null;
  return p.yearly ?? Math.round(p.monthly * 12 * (1 - YEARLY_BILLING.discountPct / 100));
}

export function formatMoney(amount: number, currency: string, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
