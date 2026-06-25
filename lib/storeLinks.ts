/** Android package published as com.techcortix.cortix_sl */
export const ANDROID_PACKAGE_ID = "com.techcortix.cortix_sl";

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

/** Prefer Play Store app on Android; HTTPS works everywhere. */
export function playStoreHref(webUrl: string): string {
  if (typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)) {
    return `market://details?id=${ANDROID_PACKAGE_ID}`;
  }
  return webUrl;
}
