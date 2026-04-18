/**
 * Canonical public site origin (no trailing slash).
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://academy.sorooj.org).
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy.sorooj.org"
  ).replace(/\/$/, "");
}
