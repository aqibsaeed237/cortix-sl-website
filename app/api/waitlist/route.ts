import { isValidEmail } from "@/lib/api";
import { getBackendUrl } from "@/lib/backendUrl";
import { clientIp } from "@/lib/clientIp";

export const dynamic = "force-dynamic";

/** Humans take longer than this to type an email; bots submit instantly. */
const MIN_ELAPSED_MS = 1500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const ALLOWED_SOURCES = new Set(["ios_waitlist", "website"]);

/**
 * Best-effort per-IP throttle. Memory is per server instance, so this caps
 * bursts rather than guaranteeing a global limit — the backend also limits.
 */
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Looks like success to a bot, but nothing is stored. */
function silentOk() {
  return Response.json({
    status: "created",
    message: "You're on the list! We'll be in touch soon.",
    founding_remaining: 0,
    created: true,
  });
}

export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown; company?: unknown; elapsed_ms?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  // Anti-spam: honeypot filled or submitted faster than a human could type.
  if (typeof body.company === "string" && body.company.trim() !== "") return silentOk();
  if (typeof body.elapsed_ms === "number" && body.elapsed_ms < MIN_ELAPSED_MS) return silentOk();

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return Response.json({ message: "Please enter a valid email address." }, { status: 422 });
  }

  const ip = clientIp(request);
  if (throttled(ip)) {
    return Response.json(
      { message: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const source =
    typeof body.source === "string" && ALLOWED_SOURCES.has(body.source) ? body.source : "website";

  try {
    // Backend currently ignores `source` (stores "website"); sent for when it's supported.
    const res = await fetch(`${getBackendUrl()}/public/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ip !== "unknown" ? { "X-Forwarded-For": ip } : {}),
      },
      body: JSON.stringify({ email, source }),
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(
      { message: "Could not reach the server. Check your connection and try again." },
      { status: 502 },
    );
  }
}
