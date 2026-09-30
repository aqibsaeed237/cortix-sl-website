import { EyeOff, Lock, Mic, ScanLine, ShieldCheck, SlidersHorizontal, Trash2 } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";

const ICONS = [Lock, ShieldCheck, ScanLine, Mic, SlidersHorizontal, Trash2];

export function Security({ t, privacyHref }: { t: Dictionary; privacyHref: string }) {
  const s = t.security;
  return (
    <section id="security" aria-labelledby="security-title" className="section-y bg-elevated/60 cv-auto">
      <div className="container-page">
        <SectionHeader id="security-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <Reveal as="li" key={item.title} delay={(i % 3) * 0.06} className="glass rounded-xl p-6">
                <Icon className="mb-4 size-6 text-accent" aria-hidden />
                <h3 className="text-base font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
          <p className="flex items-center gap-2 text-sm font-medium text-fg">
            <EyeOff className="size-4 text-accent" aria-hidden />
            {s.noSelling}
          </p>
          <a href={privacyHref} className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline">
            {s.readPolicy} →
          </a>
        </div>
      </div>
    </section>
  );
}
