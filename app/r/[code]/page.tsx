import type { Metadata } from "next";
import { DEFAULT_PLAY_STORE_URL } from "@/lib/storeLinks";
import { withPlayReferrer } from "@/lib/utm";

/*
 * The landing page for a referral link, sl.techcortix.com/r/<code>.
 *
 * Unlike /invite/<token> this page checks nothing with the API. A referral
 * code is not a secret and not a capability — it names who gets credited, and
 * the server decides whether a reward is due long after this page is gone. So
 * there is nothing to look up, nothing to leak, and no reason to fail if the
 * backend is down.
 *
 * It is deliberately honest about when the reward arrives: on the first
 * expense, not on install. Promising it on install and paying on activation is
 * how referral programmes get a reputation for not paying out.
 */

export const metadata: Metadata = {
  title: "Get a month of Cortix SL Pro",
  description:
    "Install Cortix SL with a friend's code and you both get a month of Pro once you log your first expense.",
  // A referral URL is personal to the person who sent it, and these pages
  // would otherwise compete with the real landing page in search.
  robots: { index: false, follow: false },
};

/** Same shape as the server mints: unambiguous alphabet, fixed length. */
const CODE_PATTERN = /^[A-Z0-9]{4,16}$/;

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalised = decodeURIComponent(code).trim().toUpperCase();
  const looksLikeACode = CODE_PATTERN.test(normalised);

  // The code rides through the Play Store in the install referrer, so the app
  // can credit the right person on first open without anyone typing it in.
  // A code that is not even the right shape is dropped rather than passed on:
  // whatever is in the path lands in a database row on the other side.
  const installUrl = withPlayReferrer(DEFAULT_PLAY_STORE_URL, {
    source: "referral",
    medium: "link",
    campaign: "friend_referral",
    ...(looksLikeACode ? { extra: { ref: normalised } } : {}),
  });

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        A friend wants to give you a month of Pro
      </h1>

      <p className="mt-4 text-base opacity-80">
        Cortix SL tracks what you spend without the typing: copy a bank message, paste it in, and
        it reads the amount and the merchant for you. The app has no access to your messages —
        nothing is read unless you paste it.
      </p>

      <p className="mt-4 text-base opacity-80">
        Install it with this link and you both get a month of Pro{" "}
        <strong>once you add your first expense</strong>. Not on install — on the first thing you
        actually log.
      </p>

      {looksLikeACode ? (
        <p className="mt-6 text-sm opacity-60">
          Your friend&apos;s code: <span className="font-mono tracking-widest">{normalised}</span>
        </p>
      ) : (
        <p className="mt-6 text-sm opacity-60">
          That link looks incomplete, so we cannot credit your friend automatically. You can still
          install the app and enter their code in Settings.
        </p>
      )}

      <a
        href={installUrl}
        className="mt-10 inline-flex w-fit items-center rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white"
      >
        Get Cortix SL
      </a>

      <p className="mt-6 text-sm opacity-60">
        Free to use, no ads and no card. One reward per person invited.
      </p>
    </main>
  );
}
