import type { Dictionary } from "@/i18n/dictionaries/en";
import { CheckCell } from "../ui/CheckCell";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";

export function Compare({ t }: { t: Dictionary }) {
  const c = t.compare;
  const yes = t.pricing.included;
  const no = t.pricing.notIncluded;
  return (
    <section aria-labelledby="compare-title" className="section-y bg-elevated/60 cv-auto">
      <div className="container-page">
        <SectionHeader id="compare-title" eyebrow={c.eyebrow} title={c.title} />
        <Reveal className="glass mx-auto max-w-3xl overflow-x-auto rounded-xl">
          <table className="w-full min-w-[520px] border-collapse text-start">
            <caption className="sr-only">{c.title}</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-4 text-start text-sm font-medium text-subtle">
                  <span className="sr-only">{t.pricing.tableFeature}</span>
                </th>
                <th scope="col" className="bg-accent-soft p-4 text-center text-sm font-semibold text-accent">
                  {c.colUs}
                </th>
                <th scope="col" className="p-4 text-center text-sm font-medium text-muted">{c.colSheet}</th>
                <th scope="col" className="p-4 text-center text-sm font-medium text-muted">{c.colPaper}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-start text-[15px] font-normal text-fg">{r.label}</th>
                  <td className="bg-accent-soft p-4 text-center"><CheckCell value={r.us} yes={yes} no={no} /></td>
                  <td className="p-4 text-center"><CheckCell value={r.sheet} yes={yes} no={no} /></td>
                  <td className="p-4 text-center"><CheckCell value={r.paper} yes={yes} no={no} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
