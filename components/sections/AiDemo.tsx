"use client";

import { CircleCheck, Info, Sparkles } from "lucide-react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { track } from "@/lib/analytics";
import { parseExpense, type ParsedExpense } from "@/lib/demoParser";
import { formatMoney } from "@/lib/pricing";

export function AiDemo({ t }: { t: Dictionary["demo"] }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ParsedExpense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runs, setRuns] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();

  function run(text: string, fromExample: boolean) {
    const parsed = parseExpense(text);
    if (!parsed) {
      setResult(null);
      setError(t.needAmount);
      return;
    }
    setError(null);
    setResult(parsed);
    setRuns((n) => n + 1);
    track("demo_used", { example: fromExample });
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="glass mx-auto max-w-2xl rounded-2xl p-4 shadow-lg sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(value, false);
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor={inputId} className="sr-only">
              {t.inputLabel}
            </label>
            <div className="relative flex-1">
              <Sparkles className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden />
              <input
                ref={inputRef}
                id={inputId}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t.placeholder}
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="h-13 w-full rounded-full border border-line-strong bg-surface-strong ps-11 pe-4 text-base text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              {t.submit}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {t.examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setValue(ex);
                  run(ex, true);
                }}
                className="min-h-11 rounded-full border border-line bg-surface px-4 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="mt-5 min-h-[168px]" aria-live="polite">
            {error && (
              <p id={errorId} className="flex items-center gap-2 text-sm text-warning">
                <Info className="size-4" aria-hidden /> {error}
              </p>
            )}
            <AnimatePresence mode="wait">
              {result && (
                <m.div
                  key={runs}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-xl border border-line bg-surface-strong p-5"
                >
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-success">
                    <CircleCheck className="size-4" aria-hidden />
                    {t.resultTitle}
                  </p>
                  <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Field label={t.amount} value={formatMoney(result.amount, result.currency)} strong />
                    <Field label={t.merchant} value={result.merchant ?? t.unknown} />
                    <Field label={t.category} value={result.category} />
                    <Field label={t.date} value={t.today} />
                  </dl>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-2 flex gap-2 text-xs leading-relaxed text-subtle">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {t.disclaimer}
          </p>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}

function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className={`mt-1 truncate ${strong ? "text-lg font-semibold text-fg" : "text-[15px] font-medium text-fg"}`}>
        {value}
      </dd>
    </div>
  );
}
