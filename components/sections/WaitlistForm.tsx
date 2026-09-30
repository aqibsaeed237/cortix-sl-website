"use client";

import { CircleCheck, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { track } from "@/lib/analytics";
import { formatFetchError, isValidEmail, submitWaitlist } from "@/lib/api";
import { WAITLIST_INPUT_ID } from "@/lib/storeLinks";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * iOS waitlist. Anti-spam: hidden honeypot field + minimum time-on-form,
 * both checked server-side in app/api/waitlist/route.ts, plus rate limits.
 */
export function WaitlistForm({ t, source }: { t: Dictionary["waitlist"]; source: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const mountedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const noteId = useId();

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage(t.invalid);
      return;
    }
    setStatus("submitting");
    track("waitlist_submit", { source });
    try {
      const res = await submitWaitlist({
        email,
        source,
        company: honeypot.current?.value ?? "",
        elapsed_ms: Date.now() - mountedAt.current,
      });
      setStatus("success");
      setMessage(res.message);
      track("waitlist_signup", { source, created: res.created });
    } catch (err) {
      setStatus("error");
      setMessage(formatFetchError(err));
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-start">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div>
          <p className="font-semibold text-fg">{t.successTitle}</p>
          {message && <p className="mt-1 text-sm text-muted">{message}</p>}
        </div>
      </div>
    );
  }

  const invalid = status === "error";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={WAITLIST_INPUT_ID} className="sr-only">
          {t.emailLabel}
        </label>
        <input
          id={WAITLIST_INPUT_ID}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={320}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (invalid) setStatus("idle");
          }}
          placeholder={t.placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : noteId}
          disabled={status === "submitting"}
          className="h-13 min-w-0 flex-1 rounded-full border border-line-strong bg-surface-strong px-5 text-base text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-danger"
        />
        {/* Honeypot: invisible to people, tempting to bots. */}
        <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
          <label>
            Company
            <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button type="submit" disabled={status === "submitting"} className="btn btn-primary btn-lg">
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> {t.submitting}
            </>
          ) : (
            t.submit
          )}
        </button>
      </div>
      {invalid ? (
        <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-danger">
          {message}
        </p>
      ) : (
        <p id={noteId} className="mt-3 text-xs text-subtle">
          {t.privacyNote}
        </p>
      )}
    </form>
  );
}
