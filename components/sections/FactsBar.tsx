import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Landing } from "@/lib/landing";

/** Only show a live user count once it's large enough to be meaningful. */
const MIN_USERS_TO_SHOW = 100;

/**
 * Verifiable product facts instead of invented ratings. The live sign-up
 * count (from /public/landing) replaces the first fact once it passes the
 * threshold above.
 */
export function FactsBar({ t, landing }: { t: Dictionary; landing: Landing }) {
  const items = [...t.facts.items];
  if (landing.live && landing.total_users >= MIN_USERS_TO_SHOW) {
    items[items.length - 1] = {
      value: new Intl.NumberFormat("en").format(landing.total_users),
      label: t.facts.usersLabel,
    };
  }

  return (
    <section aria-label={t.facts.label} className="border-y border-line bg-elevated/60">
      <dl className="container-page grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
        {items.map((f) => (
          <div key={f.label} className="px-2 text-center">
            <dt className="sr-only">{f.label}</dt>
            <dd className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">{f.value}</dd>
            <dd className="mt-1.5 text-sm text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
