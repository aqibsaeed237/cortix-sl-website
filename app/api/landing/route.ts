import { getBackendUrl } from "@/lib/backendUrl";

export const dynamic = "force-dynamic";

export async function GET() {
  const backend = getBackendUrl();
  try {
    const res = await fetch(`${backend}/public/landing`, { cache: "no-store" });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(
      { message: "Backend unavailable" },
      { status: 502 },
    );
  }
}
