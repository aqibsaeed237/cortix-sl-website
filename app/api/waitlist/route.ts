import { getBackendUrl } from "@/lib/backendUrl";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const backend = getBackendUrl();
  const body = await request.text();
  try {
    const res = await fetch(`${backend}/public/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(
      {
        message:
          "Could not reach the server. Check your connection and try again.",
      },
      { status: 502 },
    );
  }
}
