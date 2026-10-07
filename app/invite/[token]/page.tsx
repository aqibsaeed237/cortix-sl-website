import type { Metadata } from "next";
import { getBackendUrl } from "@/lib/backendUrl";
import { DEFAULT_PLAY_STORE_URL } from "@/lib/storeLinks";
import { withPlayReferrer } from "@/lib/utm";

export const dynamic = "force-dynamic";

/*
 * The fallback half of a split-group invite.
 *
 * On a phone with Cortix SL installed, Android and iOS verify this domain
 * against /.well-known/assetlinks.json and apple-app-site-association and open
 * the app on the invite directly — this page is never seen. It is what the
 * link does everywhere else: a desktop browser, a phone without the app, or a
 * device where verification has not completed.
 *
 * It must therefore do two things and no more: say who invited whom, so the
 * link does not look like spam, and offer the install. It deliberately shows
 * nothing about the group beyond its name, because anyone holding the URL can
 * load this page without signing in.
 */

export const metadata: Metadata = {
  title: "You have been invited",
  description: "Join a shared expense group on Cortix SL.",
  // An invite URL is private to the person who received it.
  robots: { index: false, follow: false },
};

type InvitePreview = {
  group_name: string;
  invited_email?: string | null;
  display_name?: string | null;
  expires_at?: string | null;
};

type PreviewResult =
  | { state: "ok"; preview: InvitePreview }
  | { state: "gone"; message: string }
  | { state: "unknown" };

async function loadPreview(token: string): Promise<PreviewResult> {
  try {
    const res = await fetch(`${getBackendUrl()}/split-invites/${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      return { state: "ok", preview: (await res.json()) as InvitePreview };
    }
    if (res.status === 400) {
      // Expired, revoked or already used — the API phrases each one.
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      return { state: "gone", message: body?.message ?? "This invitation is no longer valid." };
    }
    return { state: "unknown" };
  } catch {
    // The API being down should not make a valid invite look cancelled.
    return { state: "unknown" };
  }
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await loadPreview(token);

  // The token rides through the Play Store in the install referrer, so the
  // first open after installing joins this group instead of landing the new
  // user in an empty app with no idea what they clicked.
  const installUrl = withPlayReferrer(DEFAULT_PLAY_STORE_URL, {
    source: "invite",
    medium: "link",
    campaign: "split_invite",
    extra: { invite: token },
  });

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-16">
      {result.state === "ok" ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight">
            You have been invited to {result.preview.group_name}
          </h1>
          <p className="mt-4 text-base opacity-80">
            Someone wants to split expenses with you on Cortix SL. Install the app and open this
            link again on your phone to join — nothing is shared with you until you accept.
          </p>
          {result.preview.expires_at ? (
            <p className="mt-2 text-sm opacity-60">
              This invitation expires on{" "}
              {new Date(result.preview.expires_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          ) : null}
        </>
      ) : result.state === "gone" ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight">This invitation is no longer valid</h1>
          <p className="mt-4 text-base opacity-80">
            {result.message} Ask whoever invited you to send a new link.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Open this invitation in the app</h1>
          <p className="mt-4 text-base opacity-80">
            We could not check this invitation just now. Install Cortix SL and open the link again
            on your phone.
          </p>
        </>
      )}

      <a
        href={installUrl}
        className="mt-10 inline-flex w-fit items-center rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white"
      >
        Get Cortix SL
      </a>

      <p className="mt-6 text-sm opacity-60">
        Already have the app? Open this page on the phone it is installed on and it will take you
        straight there.
      </p>
    </main>
  );
}
