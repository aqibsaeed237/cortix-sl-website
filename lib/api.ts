import type { LandingData, WaitlistResult } from "./types";

/** Same-origin Next.js proxy avoids CORS and works when env vars are missing on Vercel. */
const API_BASE = "/api";

function extractErrorMessage(text: string, status: number): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return status === 503
      ? "Waitlist is temporarily unavailable. Please try again shortly."
      : `Request failed (${status})`;
  }
  try {
    const data = JSON.parse(trimmed) as {
      message?: string;
      detail?: string | { message?: string };
    };
    if (typeof data.message === "string" && data.message) return data.message;
    if (typeof data.detail === "string" && data.detail) return data.detail;
    if (data.detail && typeof data.detail === "object" && data.detail.message) {
      return data.detail.message;
    }
  } catch {
    /* plain text body */
  }
  if (trimmed.length > 180) return `Request failed (${status})`;
  return trimmed;
}

export function formatFetchError(err: unknown): string {
  if (err instanceof TypeError) {
    const msg = err.message.toLowerCase();
    if (msg.includes("fetch") || msg.includes("network")) {
      return "Could not reach the server. Check your connection and try again.";
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(extractErrorMessage(text, res.status));
  }
  return res.json() as Promise<T>;
}

export async function fetchLandingData(): Promise<LandingData> {
  const res = await fetch(`${API_BASE}/landing`, {
    cache: "no-store",
  });
  return parseJson<LandingData>(res);
}

export type WaitlistPayload = {
  email: string;
  /** Where the signup came from, e.g. "ios_waitlist". */
  source: string;
  /** Honeypot — must stay empty (hidden from humans). */
  company?: string;
  /** Milliseconds the form was on screen before submit (bot check). */
  elapsed_ms?: number;
};

export async function submitWaitlist(payload: WaitlistPayload): Promise<WaitlistResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, email: payload.email.trim().toLowerCase() }),
    });
  } catch (err) {
    throw new Error(formatFetchError(err));
  }
  return parseJson<WaitlistResult>(res);
}

export type FeedbackPayload = {
  email: string;
  name?: string;
  category: string;
  subject?: string;
  message: string;
  company?: string;
  elapsed_ms?: number;
};

export type FeedbackResult = {
  id: string;
  status: string;
  category: string;
  message: string;
  created_at: string;
  subject?: string | null;
};

export async function submitFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        email: payload.email.trim().toLowerCase(),
        message: payload.message.trim(),
      }),
    });
  } catch (err) {
    throw new Error(formatFetchError(err));
  }
  return parseJson<FeedbackResult>(res);
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length >= 12) {
    return `+92 ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

export function whatsappHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** Mirrors the backend WaitlistRequest validator (schemas.py) plus a TLD check. */
export function isValidEmail(email: string): boolean {
  const cleaned = email.trim();
  if (cleaned.length < 6 || cleaned.length > 320) return false;
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(cleaned);
}
