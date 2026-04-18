import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "@/i18n-config";
import { defaultLocale } from "./constants/locales";

/**
 * Auth UI routes (guest only). Logged-in users (`access_token`) are sent home.
 * Resend OTP is an action on verify-code, not a separate path.
 */
const GUEST_AUTH_SEGMENTS = new Set([
  "login",
  "sign-up",
  "select-auth",
  "forget-password",
  "reset-password",
  "verify-code",
]);

function isGuestAuthPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return false;

  const first = segments[0];
  const second = segments[1];

  if (i18n.locales.includes(first as (typeof i18n.locales)[number])) {
    return second ? GUEST_AUTH_SEGMENTS.has(second) : false;
  }

  return GUEST_AUTH_SEGMENTS.has(first);
}

function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (
    segments.length >= 1 &&
    i18n.locales.includes(segments[0] as (typeof i18n.locales)[number])
  ) {
    return segments[0];
  }
  return defaultLocale;
}

/** Home: `/` for default locale (ar), `/{locale}` for others (e.g. `/en`). */
function redirectLoggedInUserHome(
  request: NextRequest,
  pathname: string,
  search: string,
) {
  const locale = getLocaleFromPathname(pathname);
  const path = locale === defaultLocale ? "/" : `/${locale}`;
  const url = new URL(path + search, request.url);
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  if (accessToken && isGuestAuthPath(pathname)) {
    return redirectLoggedInUserHome(request, pathname, search);
  }

  const localeInPath = i18n.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (!localeInPath) {
    const res = NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}${search}`, request.url),
    );

    res.cookies.set("lang", defaultLocale, { path: "/" });
    return res;
  }

  const locale = localeInPath;

  if (locale === defaultLocale) {
    const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
    const res = NextResponse.redirect(
      new URL(`${dest}${search}`, request.url),
    );

    res.cookies.set("lang", defaultLocale, { path: "/" });
    return res;
  }

  const res = NextResponse.next();
  res.cookies.set("lang", locale, { path: "/" });

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
