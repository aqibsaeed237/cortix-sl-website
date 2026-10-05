import {
  ChartColumn,
  Coins,
  FileText,
  Mic,
  MessageSquare,
  Moon,
  Repeat,
  ScanLine,
  Search,
  Sheet,
  Split,
  Table2,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { APP_CURRENCIES } from "@/lib/product";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";
import { AnimatedChart } from "./AnimatedChart";

export function Features({ t }: { t: Dictionary }) {
  const f = t.features;
  return (
    <section id="features" aria-labelledby="features-title" className="section-y cv-auto">
      <div className="container-page">
        <SectionHeader id="features-title" eyebrow={f.eyebrow} title={f.title} lead={f.lead} />

        <ul className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6">
          {/* Receipt scan — hero cell */}
          <Cell className="md:col-span-3 md:row-span-2" icon={<ScanLine />} title={f.scan.title} body={f.scan.body}>
            <ReceiptScan labels={f.scan} caption={f.illustrative} />
          </Cell>

          <Cell className="md:col-span-3" icon={<Mic />} title={f.voice.title} body={f.voice.body}>
            <VoiceWave transcript={f.voice.transcript} />
          </Cell>

          <Cell className="md:col-span-3" icon={<Search />} title={f.ask.title} body={f.ask.body}>
            <AskBubble q={f.ask.q} a={f.ask.a} />
          </Cell>

          <Cell className="md:col-span-2" icon={<ChartColumn />} title={f.analytics.title} body={f.analytics.body}>
            <AnimatedChart />
          </Cell>

          <Cell className="md:col-span-2" icon={<Wallet />} title={f.budgets.title} body={f.budgets.body}>
            <BudgetBars />
          </Cell>

          <Cell className="md:col-span-2" icon={<Split />} title={f.split.title} body={f.split.body}>
            <div className="mt-5 flex -space-x-2 rtl:space-x-reverse" aria-hidden>
              {["A", "S", "J", "+2"].map((n, i) => (
                <span
                  key={n}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-bg text-xs font-semibold text-accent-fg"
                  style={{ background: ["#22d3ee", "#818cf8", "#34d399", "#64748b"][i] }}
                >
                  {n}
                </span>
              ))}
            </div>
          </Cell>

          <Cell className="md:col-span-3" icon={<FileText />} title={f.export.title} body={f.export.body}>
            <div className="mt-5 flex flex-wrap gap-2" aria-hidden>
              {[
                { l: "CSV", i: <Table2 className="size-4" /> },
                { l: "Excel", i: <Sheet className="size-4" /> },
                { l: "PDF", i: <FileText className="size-4" /> },
              ].map((x) => (
                <span
                  key={x.l}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-fg"
                >
                  <span className="text-accent">{x.i}</span>
                  {x.l}
                </span>
              ))}
            </div>
          </Cell>

          <Cell className="md:col-span-3" icon={<Coins />} title={f.currency.title} body={f.currency.body}>
            <div className="mt-5 flex flex-wrap items-center gap-1.5" aria-hidden>
              {APP_CURRENCIES.map((c) => (
                <span key={c} className="rounded-md border border-line px-2 py-1 font-mono text-xs text-muted">
                  {c}
                </span>
              ))}
              <span className="ms-1 inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-1 text-xs text-accent">
                <Moon className="size-3" /> Dark
              </span>
            </div>
          </Cell>

          <Cell className="md:col-span-3" icon={<MessageSquare />} title={f.sms.title} body={f.sms.body} />

          <Cell className="md:col-span-3" icon={<Repeat />} title={f.recurring.title} body={f.recurring.body} />
        </ul>
      </div>
    </section>
  );
}

function Cell({
  className = "",
  icon,
  title,
  body,
  children,
}: {
  className?: string;
  icon: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <Reveal
      as="li"
      className={`glass group relative flex flex-col overflow-hidden rounded-xl p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong md:p-7 ${className}`}
    >
      <span className="mb-4 flex size-10 items-center justify-center rounded-md bg-accent-soft text-accent [&>svg]:size-5" aria-hidden>
        {icon}
      </span>
      <h3 className="text-h3 font-semibold text-fg">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
      {children}
    </Reveal>
  );
}

/* ── Micro-visuals (decorative; CSS animations, off under reduced motion) ── */

function ReceiptScan({
  labels,
  caption,
}: {
  labels: Dictionary["features"]["scan"];
  caption: string;
}) {
  const rows = [
    { k: labels.merchant, v: "KFC Gulberg" },
    { k: labels.amount, v: "PKR 2,500" },
    { k: labels.date, v: "Today" },
    { k: labels.category, v: "Food & Dining" },
  ];
  return (
    <figure className="mt-6 flex flex-1 flex-col justify-end">
      <div className="grid items-center gap-4 sm:grid-cols-2" aria-hidden>
        {/* Receipt paper with scan line */}
        <div className="relative mx-auto w-full max-w-[200px] overflow-hidden rounded-md bg-white p-4 font-mono text-[10px] leading-[1.7] text-slate-700 shadow-md [--scan-distance:190px]">
          <p className="text-center font-bold text-slate-900">KFC GULBERG</p>
          <p className="text-center text-slate-500">Lahore · Tax inv. #20931</p>
          <div className="my-2 border-t border-dashed border-slate-300" />
          <p className="flex justify-between"><span>Zinger Meal x2</span><span>1,700</span></p>
          <p className="flex justify-between"><span>Hot Wings</span><span>560</span></p>
          <p className="flex justify-between"><span>Drinks</span><span>240</span></p>
          <div className="my-2 border-t border-dashed border-slate-300" />
          <p className="flex justify-between font-bold text-slate-900"><span>TOTAL</span><span>2,500</span></p>
          <p className="mt-1 text-center text-slate-400">Thank you!</p>
          <span className="anim-scan absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
          <span className="anim-scan absolute inset-x-0 top-6 h-px bg-cyan-500" />
        </div>
        {/* Extracted fields */}
        <dl className="space-y-2">
          {rows.map((r, i) => (
            <div
              key={r.k}
              className="anim-fade-up flex items-center justify-between rounded-md border border-line bg-surface-strong px-3 py-2"
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            >
              <dt className="text-xs text-subtle">{r.k}</dt>
              <dd className="text-[13px] font-semibold text-fg">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption className="mt-4 text-xs text-subtle">{caption}</figcaption>
    </figure>
  );
}

function VoiceWave({ transcript }: { transcript: string }) {
  const bars = [0.5, 0.8, 0.35, 1, 0.6, 0.9, 0.4, 0.75, 0.55, 0.95, 0.45, 0.7, 0.3, 0.85, 0.5, 0.65];
  return (
    <div className="mt-5 flex items-center gap-4" aria-hidden>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg shadow-glow">
        <Mic className="size-5" />
      </span>
      <div className="flex h-10 flex-1 items-center gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="anim-wave w-[3px] flex-1 rounded-full bg-accent/70"
            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </div>
      <p className="hidden text-sm font-medium text-fg lg:block">{transcript}</p>
    </div>
  );
}

function AskBubble({ q, a }: { q: string; a: string }) {
  return (
    <div className="mt-5 space-y-2 text-sm" aria-hidden>
      <p className="ms-auto w-fit max-w-[85%] rounded-2xl rounded-ee-sm bg-accent px-3.5 py-2 text-accent-fg">{q}</p>
      <p className="w-fit max-w-[90%] rounded-2xl rounded-es-sm border border-line bg-surface-strong px-3.5 py-2 text-fg">
        {a}
        <span className="anim-caret ms-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-accent" />
      </p>
    </div>
  );
}

function BudgetBars() {
  const rows = [
    { l: "Food", p: 72 },
    { l: "Transport", p: 45 },
    { l: "Shopping", p: 91 },
  ];
  return (
    <div className="mt-5 space-y-3" aria-hidden>
      {rows.map((r) => (
        <div key={r.l}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted">{r.l}</span>
            <span className={r.p > 85 ? "font-semibold text-warning" : "text-subtle"}>{r.p}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
            <div className={`h-full rounded-full ${r.p > 85 ? "bg-warning" : "bg-accent"}`} style={{ width: `${r.p}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
