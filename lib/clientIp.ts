/**
 * The caller's IP, as far as it can be trusted.
 *
 * `x-forwarded-for` is a list the client can prepend to, so reading its *first*
 * entry means a bot can rotate `X-Forwarded-For: <random>` and walk straight
 * past every per-IP throttle. On Vercel the platform sets `x-vercel-forwarded-for`
 * itself and appends the real peer to the end of `x-forwarded-for`, so we take
 * the platform header when it is there and the **last** hop otherwise.
 *
 * Behind a different proxy, set TRUSTED_PROXY_HOPS to how many proxies of your
 * own sit in front of this app.
 */
const TRUSTED_HOPS = Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? "1", 10) || 1;

export function clientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel.split(",")[0]!.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((h) => h.trim()).filter(Boolean);
    // Count back from the end: those entries were written by infrastructure we
    // control, not by the caller.
    const index = Math.max(0, hops.length - TRUSTED_HOPS);
    const ip = hops[index];
    if (ip) return ip;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
