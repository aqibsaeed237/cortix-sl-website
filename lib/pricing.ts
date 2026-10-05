/**
 * Pro plan pricing.
 *
 * Matches cortix-sl-backend/app/core/constants.py (PRO_MONTHLY_PRICE,
 * PRO_YEARLY_PRICE). Checkout is still manual: the app records the plan the
 * user chose and the team activates Pro after payment.
 *
 * - The currency switcher shows only currencies that have a `monthly` price.
 *   (With a single currency, no switcher is rendered.)
 * - The monthly/yearly toggle appears only when YEARLY_BILLING is enabled.
 */

export const PRICING_CURRENCIES = ["PKR", "USD", "AED", "GBP"] as const;
export type PricingCurrency = (typeof PRICING_CURRENCIES)[number];

type Price = { monthly: number | null; yearly: number | null };

export const PRO_PRICES: Record<PricingCurrency, Price> = {
  PKR: { monthly: 1499, yearly: 14990 },
  USD: { monthly: null, yearly: null },
  AED: { monthly: null, yearly: null },
  GBP: { monthly: null, yearly: null },
};

export const YEARLY_BILLING = {
  enabled: true,
  /** Yearly is 10 months (2 free). Shown on the toggle; the billed total is PRO_PRICES.yearly. */
  discountPct: 17,
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
