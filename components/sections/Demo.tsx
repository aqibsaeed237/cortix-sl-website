import dynamic from "next/dynamic";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeader } from "../ui/SectionHeader";

// Split the interactive demo into its own chunk; SSR still renders the markup.
const AiDemo = dynamic(() => import("./AiDemo").then((m) => m.AiDemo), {
  loading: () => <div className="glass mx-auto h-[360px] max-w-2xl rounded-2xl" />,
});

export function Demo({ t }: { t: Dictionary }) {
  return (
    <section id="demo" aria-labelledby="demo-title" className="section-y relative overflow-hidden bg-elevated/60">
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:var(--gradient-hero)] opacity-60" />
      <div className="container-page relative">
        <SectionHeader id="demo-title" eyebrow={t.demo.eyebrow} title={t.demo.title} lead={t.demo.lead} />
        <AiDemo t={t.demo} />
      </div>
    </section>
  );
}
