import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "@/i18n-config";
import { defaultLocale } from "./constants/locales";

type Locale = (typeof i18n)["locales"][number];

/** Auth UI: only for guests. Logged-in users are redirected home. */
const GUEST_ONLY_SEGMENTS = new Set([
  "login",
  "sign-up",
  "select-auth",
  "forget-password",
  "verify-code",
  "reset-password",
]);

/** Requires `access_token`. */
const PROTECTED_SEGMENTS = new Set([
  "profile",
  "update-profile",
  "change-password",
  "delete-account",
]);

function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}

/**
 * `/login` → ar + login; `/en/profile` → en + profile; `/` → ar + null
 */
function parsePath(pathname: string): { locale: Locale; firstSegment: string | null } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) {
    return { locale: defaultLocale as Locale, firstSegment: null };
  }
  if (isLocale(parts[0])) {
    return {
      locale: parts[0],
      firstSegment: parts[1] ?? null,
    };
  }
  return {
    locale: defaultLocale as Locale,
    firstSegment: parts[0] ?? null,
  };
}

function homeUrl(locale: Locale, request: NextRequest, search: string): URL {
  const path = locale === defaultLocale ? "/" : `/${locale}`;
  return new URL(`${path}${search}`, request.url);
}

function loginUrl(locale: Locale, request: NextRequest, search: string): URL {
  const path = locale === defaultLocale ? "/login" : `/${locale}/login`;
  return new URL(`${path}${search}`, request.url);
}

function forgetPasswordUrl(
  locale: Locale,
  request: NextRequest,
  search: string,
): URL {
  const path =
    locale === defaultLocale ? "/forget-password" : `/${locale}/forget-password`;
  return new URL(`${path}${search}`, request.url);
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
  const resetToken = request.cookies.get("reset_token")?.value;

  const { locale: pathLocale, firstSegment } = parsePath(pathname);

  if (firstSegment && GUEST_ONLY_SEGMENTS.has(firstSegment)) {
    if (accessToken) {
      return NextResponse.redirect(homeUrl(pathLocale, request, search));
    }
    if (
      (firstSegment === "verify-code" || firstSegment === "reset-password") &&
      !resetToken
    ) {
      return NextResponse.redirect(
        forgetPasswordUrl(pathLocale, request, search),
      );
    }
  }

  if (
    !accessToken &&
    firstSegment &&
    PROTECTED_SEGMENTS.has(firstSegment)
  ) {
    return NextResponse.redirect(loginUrl(pathLocale, request, search));
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
    const res = NextResponse.redirect(new URL(`${dest}${search}`, request.url));
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
