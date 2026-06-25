import type { LandingData, WaitlistResult } from "./types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
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
  const res = await fetch(`${API_URL}/public/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
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
