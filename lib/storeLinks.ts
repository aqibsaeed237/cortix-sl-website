/** Android package published as com.techcortix.cortix_sl */
export const ANDROID_PACKAGE_ID = "com.techcortix.cortix_sl";

/** Scroll target when iOS App Store link is not configured yet */
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

/** Play Store — always opens the listing in a new tab. */
export function playStoreLink(fromApi?: string | null): StoreLink {
  const href = resolvePlayStoreUrl(fromApi);
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

/** Prefer Play Store app on Android; HTTPS works everywhere. */
export function playStoreHref(webUrl: string): string {
  if (typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)) {
    return `market://details?id=${ANDROID_PACKAGE_ID}`;
  }
  return webUrl;
}

export function openPlayStore(webUrl: string): void {
  if (typeof window === "undefined") return;
  if (/android/i.test(navigator.userAgent)) {
    window.location.href = playStoreHref(webUrl);
    window.setTimeout(() => {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }, 600);
    return;
  }
  window.open(webUrl, "_blank", "noopener,noreferrer");
}

export function scrollToGetApp(): void {
  if (typeof window === "undefined") return;
  document.getElementById(GET_APP_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
}
