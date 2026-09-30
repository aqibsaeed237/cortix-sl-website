import "server-only";
import { getBackendUrl } from "./backendUrl";
import { FOUNDING_DEFAULTS } from "./product";
import { DEFAULT_PLAY_STORE_URL } from "./storeLinks";
import type { LandingData } from "./types";

/** Seconds between background refreshes of the founding counter. */
export const LANDING_REVALIDATE = 60;

export type Landing = LandingData & {
  /** False when the API was unreachable — hide live counters. */
  live: boolean;
};

const FALLBACK: LandingData = {
  founding_limit: FOUNDING_DEFAULTS.limit,
  founding_claimed: 0,
  founding_remaining: FOUNDING_DEFAULTS.limit,
  founding_months: FOUNDING_DEFAULTS.months,
  total_users: 0,
  waitlist_count: 0,
  spots_available: true,
  contact: {
    company_name: "Tech Cortix",
    product_name: "Cortix SL",
    email: "contact@techcortix.com",
    phone: "+923116124245",
    whatsapp: "+923116124245",
    app_store_url: "",
    play_store_url: DEFAULT_PLAY_STORE_URL,
    privacy_url: "",
    terms_url: "",
  },
};

/**
 * Server-side fetch of GET /public/landing, cached and revalidated in the
 * background (ISR) so the page stays static-fast while the founding counter
 * stays current. Never throws — falls back to defaults with `live: false`.
 */
export async function getLanding(): Promise<Landing> {
  try {
    const res = await fetch(`${getBackendUrl()}/public/landing`, {
      next: { revalidate: LANDING_REVALIDATE },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as LandingData;
    return {
      ...FALLBACK,
      ...data,
      contact: { ...FALLBACK.contact, ...stripEmpty(data.contact) },
      live: true,
    };
  } catch {
    return { ...FALLBACK, live: false };
  }
}

function stripEmpty<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v !== "string" || v.trim() !== ""),
  ) as Partial<T>;
}
