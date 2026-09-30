import { Smartphone } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Landing } from "@/lib/landing";
import { GET_APP_SECTION_ID } from "@/lib/storeLinks";
import { TrackedLink } from "../ui/TrackedLink";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist({ t, landing }: { t: Dictionary; landing: Landing }) {
  const w = t.waitlist;
  return (
    <section id={GET_APP_SECTION_ID} aria-labelledby="waitlist-title" className="section-y">
      <div className="container-page">
        <div className="glass relative mx-auto max-w-3xl overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 [background:var(--gradient-hero)]" />
          <div className="relative">
            <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Smartphone className="size-6" aria-hidden />
            </span>
            <p className="mb-3 text-sm font-semibold text-accent">{w.eyebrow}</p>
            <h2 id="waitlist-title" className="text-h2 font-semibold text-balance text-fg">
              {w.title}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lead text-muted">{w.body}</p>
            <div className="mx-auto mt-8 max-w-lg">
              <WaitlistForm t={w} source="ios_waitlist" />
            </div>
            <p className="mt-8 text-sm text-muted">
              {w.androidNow}{" "}
              <TrackedLink
                href={landing.contact.play_store_url}
                behavior="play"
                event="store_click"
                eventProps={{ store: "play", location: "waitlist" }}
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                Google Play →
              </TrackedLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
