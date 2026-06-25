import type { LandingData, WaitlistResult } from "./types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

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
  const res = await fetch(`${API_URL}/public/landing`, {
    cache: "no-store",
  });
  return parseJson<LandingData>(res);
}

export async function submitWaitlist(email: string): Promise<WaitlistResult> {
  const normalized = email.trim().toLowerCase();
  let res: Response;
  try {
    res = await fetch(`${API_URL}/public/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized }),
    });
  } catch (err) {
    throw new Error(formatFetchError(err));
  }
  return parseJson<WaitlistResult>(res);
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

export function formatUserCount(count: number): string {
  if (count >= 1000) return `${Math.floor(count / 100) / 10}k+`;
  if (count >= 500) return "500+";
  if (count >= 100) return "100+";
  if (count > 0) return `${count}+`;
  return "Join early";
}

export function isValidEmail(email: string): boolean {
  const cleaned = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
}
