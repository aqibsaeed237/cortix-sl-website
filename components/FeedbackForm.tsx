"use client";

import { CircleCheck, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { track } from "@/lib/analytics";
import { formatFetchError, isValidEmail, submitFeedback } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

const CATEGORIES = ["bug", "suggestion", "feature", "pricing", "other"] as const;

export function FeedbackForm({ t }: { t: Dictionary["feedbackForm"] }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const mountedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const errorId = useId();

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!isValidEmail(email)) {
      setStatus("error");
      setFeedbackMsg(t.invalidEmail);
      return;
    }
    if (!message.trim()) {
      setStatus("error");
      setFeedbackMsg(t.invalidMessage);
      return;
    }
    setStatus("submitting");
    track("feedback_submit", { category, source: "website" });
    try {
      const res = await submitFeedback({
        email,
        name,
        category,
        subject,
        message,
        company: honeypot.current?.value ?? "",
        elapsed_ms: Date.now() - mountedAt.current,
      });
      setStatus("success");
      setFeedbackMsg(res.message || t.successBody);
      track("feedback_success", { category });
    } catch (err) {
      setStatus("error");
      setFeedbackMsg(formatFetchError(err));
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-start">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div>
          <p className="font-semibold text-fg">{t.successTitle}</p>
          {feedbackMsg && <p className="mt-1 text-sm text-muted">{feedbackMsg}</p>}
        </div>
      </div>
    );
  }

  const invalid = status === "error";
  const categoryLabel = (key: (typeof CATEGORIES)[number]) => t.categories[key];

  return (
    <form onSubmit={onSubmit} noValidate className="w-full space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-fg">{t.nameLabel}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
            maxLength={120}
            className="h-12 w-full rounded-xl border border-line-strong bg-surface-strong px-4 text-fg"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-fg">{t.emailLabel}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (invalid) setStatus("idle");
            }}
            disabled={status === "submitting"}
            maxLength={320}
            className="h-12 w-full rounded-xl border border-line-strong bg-surface-strong px-4 text-fg aria-invalid:border-danger"
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
          />
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-fg">{t.categoryLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((key) => (
            <button
              key={key}
              type="button"
              disabled={status === "submitting"}
              onClick={() => setCategory(key)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                category === key
                  ? "border-accent bg-accent/10 font-semibold text-fg"
                  : "border-line text-muted hover:border-line-strong"
              }`}
            >
              {categoryLabel(key)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-fg">{t.subjectLabel}</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={status === "submitting"}
          maxLength={200}
          className="h-12 w-full rounded-xl border border-line-strong bg-surface-strong px-4 text-fg"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-fg">{t.messageLabel}</span>
        <textarea
          required
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (invalid) setStatus("idle");
          }}
          disabled={status === "submitting"}
          maxLength={5000}
          rows={6}
          placeholder={t.messageHint}
          className="w-full rounded-xl border border-line-strong bg-surface-strong px-4 py-3 text-fg"
        />
      </label>

      <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {invalid && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {feedbackMsg}
        </p>
      )}

      <p className="text-sm text-muted">{t.screenshotNote}</p>

      <button type="submit" disabled={status === "submitting"} className="btn btn-primary btn-lg">
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {t.submitting}
          </>
        ) : (
          t.submit
        )}
      </button>
    </form>
  );
}
