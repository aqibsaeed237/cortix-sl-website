import { buildReferrer, websitePlayUrl, WEBSITE_UTM } from "./utm";

/** Android package published as com.techcortix.cortix_sl */
export const ANDROID_PACKAGE_ID = "com.techcortix.cortix_sl";

/** iOS waitlist section — scroll target while the App Store link is not live. */
export const GET_APP_SECTION_ID = "get-app";

export const DEFAULT_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ||
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

export function resolvePlayStoreUrl(fromApi?: string | null): string {
  const trimmed = fromApi?.trim();
  return trimmed || DEFAULT_PLAY_STORE_URL;
}

export function resolveAppStoreUrl(fromApi?: string | null): string | undefined {
  const trimmed = fromApi?.trim();
  return trimmed || process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || undefined;
}

export type StoreLink = {
  href: string;
  label: string;
  external: boolean;
};

/**
 * Play Store — always opens the listing in a new tab.
 * `placement` becomes `utm_content` so Play Console can tell the hero button
 * from the nav button from the pricing card.
 */
export function playStoreLink(fromApi?: string | null, placement = "site"): StoreLink {
  const href = websitePlayUrl(resolvePlayStoreUrl(fromApi), placement);
  return {
    href,
    label: "Get Cortix SL on Google Play (opens in new tab)",
    external: true,
  };
}

/** App Store listing, or scroll to download section if iOS is not live yet. */
export function appStoreLink(fromApi?: string | null): StoreLink {
  const listing = resolveAppStoreUrl(fromApi);
  if (listing) {
    return {
      href: listing,
      label: "Download Cortix SL on the App Store (opens in new tab)",
      external: true,
    };
  }
  return {
    href: `#${GET_APP_SECTION_ID}`,
    label: "Cortix SL on iOS — join the waitlist below",
    external: false,
  };
}

/**
 * Prefer the Play Store app on Android; HTTPS works everywhere.
 * The `referrer` travels on the `market://` link too — dropping it there would
 * lose attribution for exactly the users most likely to install.
 */
export function playStoreHref(webUrl: string, placement = "site"): string {
  if (typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)) {
    const referrer = encodeURIComponent(buildReferrer({ ...WEBSITE_UTM, content: placement }));
    return `market://details?id=${ANDROID_PACKAGE_ID}&referrer=${referrer}`;
  }
  return webUrl;
}

export function openPlayStore(webUrl: string, placement = "site"): void {
  if (typeof window === "undefined") return;
  const tagged = websitePlayUrl(webUrl, placement);
  if (/android/i.test(navigator.userAgent)) {
    window.location.href = playStoreHref(tagged, placement);
    window.setTimeout(() => {
      window.open(tagged, "_blank", "noopener,noreferrer");
    }, 600);
    return;
  }
  window.open(tagged, "_blank", "noopener,noreferrer");
}

/** Id of the waitlist email input, focused after scrolling to the section. */
export const WAITLIST_INPUT_ID = "waitlist-email";

export function scrollToGetApp(): void {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(GET_APP_SECTION_ID)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  window.setTimeout(
    () => document.getElementById(WAITLIST_INPUT_ID)?.focus({ preventScroll: true }),
    reduce ? 0 : 450,
  );
}
