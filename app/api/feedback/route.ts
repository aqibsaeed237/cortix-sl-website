import { isValidEmail } from "@/lib/api";
import { getBackendUrl } from "@/lib/backendUrl";
import { clientIp } from "@/lib/clientIp";

export const dynamic = "force-dynamic";

const MIN_ELAPSED_MS = 1500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const ALLOWED_CATEGORIES = new Set(["bug", "suggestion", "feature", "pricing", "other"]);

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

function silentOk() {
  return Response.json({
    id: "ok",
    status: "new",
    category: "suggestion",
    message: "Thanks — we received your feedback.",
    created_at: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  let body: {
    email?: unknown;
    name?: unknown;
    category?: unknown;
    subject?: unknown;
    message?: unknown;
    company?: unknown;
    elapsed_ms?: unknown;
    source?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  if (typeof body.company === "string" && body.company.trim() !== "") return silentOk();
  if (typeof body.elapsed_ms === "number" && body.elapsed_ms < MIN_ELAPSED_MS) return silentOk();

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return Response.json({ message: "Please enter a valid email address." }, { status: 422 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 5000) {
    return Response.json({ message: "Please enter a message (up to 5000 characters)." }, { status: 422 });
  }

  const categoryRaw = typeof body.category === "string" ? body.category.trim().toLowerCase() : "suggestion";
  const category = ALLOWED_CATEGORIES.has(categoryRaw) ? categoryRaw : "suggestion";
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 200) : undefined;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : undefined;

  const ip = clientIp(request);
  if (throttled(ip)) {
    return Response.json(
      { message: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  try {
    const res = await fetch(`${getBackendUrl()}/public/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ip !== "unknown" ? { "X-Forwarded-For": ip } : {}),
      },
      body: JSON.stringify({
        email,
        name,
        category,
        subject,
        message,
        source: "website",
        platform: "web",
      }),
      signal: AbortSignal.timeout(10000),
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
