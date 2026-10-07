/**
 * Play Store install attribution.
 *
 * Play reports acquisition by the `referrer` query parameter on the listing URL:
 * one URL-encoded `utm_*` string. Without it every install the website sends is
 * filed as organic, which makes the "installs: social organic" and "installs: paid"
 * columns of the weekly dashboard wrong from week one.
 *
 * Canonical spelling of source/medium/campaign lives in
 * `cortix-sl/growth-plan/01_ASO_PLAN.md` §1.9 — keep the two in step.
 */

export type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  /** Placement or creative, e.g. `nav`, `hero`, `pricing_free`. */
  content?: string;
  /**
   * Extra keys to carry through the install, beyond attribution.
   *
   * This is what makes a pre-install click resolve. Play hands the whole
   * `referrer` string back to the app on first open, so an invite token or a
   * referral code put in here survives the trip through the Play Store and
   * the app can finish the job it was sent to do. Values are not slugged:
   * a token is case-sensitive and must arrive byte-identical.
   */
  extra?: Record<string, string>;
};

/** Website links all share one source/campaign; the placement goes in `utm_content`. */
export const WEBSITE_UTM = { source: "website", medium: "cta", campaign: "sl_homepage" } as const;

/** Keeps a referrer value readable in Play Console: lowercase, no spaces. */
function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** The inner `utm_source=…&utm_medium=…` string, before it is encoded once more. */
export function buildReferrer({ source, medium, campaign, content, extra }: UtmParams): string {
  const parts: string[] = [
    `utm_source=${slug(source)}`,
    `utm_medium=${slug(medium)}`,
    `utm_campaign=${slug(campaign)}`,
  ];
  if (content) parts.push(`utm_content=${slug(content)}`);
  for (const [key, value] of Object.entries(extra ?? {})) {
    if (!value) continue;
    parts.push(`${slug(key)}=${encodeURIComponent(value)}`);
  }
  return parts.join("&");
}

/**
 * Adds (or replaces) the `referrer` parameter on a Play listing URL.
 * Any other query parameter already on the URL is preserved, and a non-Play URL
 * is returned untouched so an override in `app_config` cannot be mangled.
 */
export function withPlayReferrer(url: string, params: UtmParams): string {
  try {
    const parsed = new URL(url);
    if (!/(^|\.)play\.google\.com$/.test(parsed.hostname)) return url;
    parsed.searchParams.set("referrer", buildReferrer(params));
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Shorthand for a link on this website: only the placement varies. */
export function websitePlayUrl(url: string, placement: string): string {
  return withPlayReferrer(url, { ...WEBSITE_UTM, content: placement });
}
