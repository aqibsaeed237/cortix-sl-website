const DEFAULT_BACKEND = "https://api.techcortix.com";

/** Server-side URL for proxy routes (TechCortix API). */
export function getBackendUrl(): string {
  return (
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    DEFAULT_BACKEND
  ).replace(/\/$/, "");
}
