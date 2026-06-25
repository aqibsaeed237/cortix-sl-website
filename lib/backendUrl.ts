const DEFAULT_BACKEND = "https://cortix-sl-api.onrender.com";

/** Server-side URL for proxy routes (Render API). */
export function getBackendUrl(): string {
  return (
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    DEFAULT_BACKEND
  ).replace(/\/$/, "");
}
