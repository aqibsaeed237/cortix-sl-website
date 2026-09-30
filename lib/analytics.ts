/**
 * Privacy-friendly event tracking. Sends to whichever providers are
 * configured (see components/Analytics.tsx); a no-op when none are.
 *
 * Events:
 *   cta_click       { location, target }
 *   store_click     { store: "play" | "app_store" | "ios_waitlist", location }
 *   waitlist_submit { source }
 *   waitlist_signup { source, created }
 *   demo_used       { example: boolean }
 *   pricing_change  { currency?, period? }
 *   contact_click   { channel }
 */

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, { props });
    window.gtag?.("event", event, props);
  } catch {
    /* analytics must never break the page */
  }
}
