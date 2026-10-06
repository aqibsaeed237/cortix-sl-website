import { NextResponse } from "next/server";
import { DEFAULT_PLAY_STORE_URL } from "@/lib/storeLinks";
import { withPlayReferrer } from "@/lib/utm";

/**
 * `sl.techcortix.com/get` — the one short install link used in bios, email
 * footers, WhatsApp replies and print. It redirects to the Play listing with a
 * Play `referrer` attached, so Play Console can attribute the install.
 *
 * Accepts the UTM fields as short query parameters so a link stays typable:
 *   /get?s=instagram&m=bio&c=organic_profile&t=link_in_bio
 * Long forms (`utm_source`, …) work too. Anything missing falls back to the
 * generic website values, so a bare /get is still attributed, never organic.
 *
 * Channel spellings: cortix-sl/growth-plan/01_ASO_PLAN.md §1.9.
 */
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pick = (short: string, long: string, fallback: string) =>
    searchParams.get(short)?.trim() || searchParams.get(long)?.trim() || fallback;

  const target = withPlayReferrer(DEFAULT_PLAY_STORE_URL, {
    source: pick("s", "utm_source", "website"),
    medium: pick("m", "utm_medium", "link"),
    campaign: pick("c", "utm_campaign", "sl_get"),
    content: pick("t", "utm_content", "") || undefined,
  });

  // 302, not 301: the campaign parameters vary per request and must not be
  // cached by a browser or an intermediary against this path.
  return NextResponse.redirect(target, { status: 302 });
}
