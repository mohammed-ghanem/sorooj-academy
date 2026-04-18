import type { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";
import { defaultLocale } from "@/constants/locales";
import { getSiteUrl } from "@/lib/siteUrl";

/**
 * Public static routes only. Extend this list (or fetch slugs) when you add
 * dynamic pages (courses, blogs, etc.).
 */
const STATIC_PATHS = [
  "",
  "/contact-us",
  "/privacy-policy",
  "/terms-and-conditions",
  "/delete-account",
] as const;

function absoluteUrl(locale: string, path: string): string {
  const base = getSiteUrl();

  if (locale === defaultLocale) {
    if (!path) return `${base}/`;
    return `${base}${path}`;
  }

  if (!path) return `${base}/en`;
  return `${base}/en${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of i18n.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
