import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "@/i18n-config";
import { defaultLocale } from "./constants/locales";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /* =====================
     تجاهل static / api
  ====================== */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const localeInPath = i18n.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  /* =====================
     بدون locale
  ====================== */
  if (!localeInPath) {
    const res = NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname}${search}`, request.url)
    );

    res.cookies.set("lang", defaultLocale, { path: "/" });
    return res;
  }

  /* =====================
     مع locale
  ====================== */
  const locale = localeInPath;

  // منع ظهور defaultLocale في الرابط
  if (locale === defaultLocale) {
    const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
    const res = NextResponse.redirect(
      new URL(`${dest}${search}`, request.url)
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









// import { NextResponse, type NextRequest } from "next/server";
// import { i18n } from "@/i18n-config";
// import { defaultLocale } from "./constants/locales";

// export function middleware(request: NextRequest) {
//   const { pathname, search } = request.nextUrl;

//   /* =====================
//      تجاهل static / api
//   ====================== */
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   const accessToken = request.cookies.get("access_token")?.value;
//   const resetToken = request.cookies.get("reset_token")?.value;
//   const resetDone = request.cookies.get("reset_done")?.value;

//   const localeInPath = i18n.locales.find(
//     (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
//   );

//   /* =====================================================
//      1️⃣ بدون locale
//   ====================================================== */
//   if (!localeInPath) {
//     const publicRoutes = ["/login", "/forget-password"];

//     const isPublic = publicRoutes.some(
//       (p) => pathname === p || pathname.startsWith(p + "/")
//     );

//     const isVerifyPage = pathname === "/verify-code";
//     const isResetPage = pathname === "/reset-password";

//     // verify / reset بدون reset_token
//     if ((isVerifyPage || isResetPage) && !resetToken) {
//       return NextResponse.redirect(
//         new URL(`/forget-password${search}`, request.url)
//       );
//     }

//     // منع الرجوع لـ verify بعد reset
//     if (isVerifyPage && resetDone) {
//       return NextResponse.redirect(
//         new URL(`/login${search}`, request.url)
//       );
//     }

//     // غير مسجل
//     if (!accessToken && !isPublic && !isVerifyPage && !isResetPage) {
//       return NextResponse.redirect(
//         new URL(`/login${search}`, request.url)
//       );
//     }

//     // مسجل ويحاول دخول public
//     if (accessToken && isPublic) {
//       return NextResponse.redirect(new URL(`/`, request.url));
//     }

//     const res = NextResponse.rewrite(
//       new URL(`/${defaultLocale}${pathname}${search}`, request.url)
//     );
//     res.cookies.set("lang", defaultLocale, { path: "/" });
//     return res;
//   }

//   /* =====================================================
//      2️⃣ مع locale
//   ====================================================== */
//   const locale = localeInPath;

//   const setLangCookie = (res: NextResponse, lang: string) => {
//     res.cookies.set("lang", lang, { path: "/" });
//     return res;
//   };

//   // منع ظهور defaultLocale في الرابط
//   if (locale === defaultLocale) {
//     const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
//     const res = NextResponse.redirect(
//       new URL(`${dest}${search}`, request.url)
//     );
//     return setLangCookie(res, defaultLocale);
//   }

//   const publicRoutes = [
//     `/${locale}/login`,
//     `/${locale}/forget-password`,
//   ];

//   const isPublic = publicRoutes.some(
//     (p) => pathname === p || pathname.startsWith(p + "/")
//   );

//   const isVerifyPage = pathname === `/${locale}/verify-code`;
//   const isResetPage = pathname === `/${locale}/reset-password`;

//   // verify / reset بدون reset_token
//   if ((isVerifyPage || isResetPage) && !resetToken) {
//     return NextResponse.redirect(
//       new URL(`/${locale}/forget-password${search}`, request.url)
//     );
//   }

//   // منع الرجوع لـ verify بعد reset
//   if (isVerifyPage && resetDone) {
//     return NextResponse.redirect(
//       new URL(`/${locale}/login${search}`, request.url)
//     );
//   }

//   // غير مسجل
//   if (!accessToken && !isPublic && !isVerifyPage && !isResetPage) {
//     return NextResponse.redirect(
//       new URL(`/${locale}/login${search}`, request.url)
//     );
//   }

//   // مسجل ويحاول دخول public
//   if (accessToken && isPublic) {
//     return NextResponse.redirect(new URL(`/${locale}`, request.url));
//   }

//   const res = NextResponse.next();
//   res.cookies.set("lang", locale, { path: "/" });
//   return res;
// }

// export const config = {
//   matcher: ["/((?!api|_next|favicon.ico).*)"],
// };











// import { NextResponse, type NextRequest } from "next/server";
// import { i18n } from "@/i18n-config";
// import { defaultLocale } from "./constants/locales";

// /**
//  * Auth UI routes (guest only). Logged-in users (`access_token`) are sent home.
//  * Resend OTP is an action on verify-code, not a separate path.
//  */
// const GUEST_AUTH_SEGMENTS = new Set([
//   "login",
//   "sign-up",
//   "select-auth",
//   "forget-password",
//   "reset-password",
//   "verify-code",
// ]);

// function isGuestAuthPath(pathname: string): boolean {
//   const segments = pathname.split("/").filter(Boolean);
//   if (segments.length === 0) return false;

//   const first = segments[0];
//   const second = segments[1];

//   if (i18n.locales.includes(first as (typeof i18n.locales)[number])) {
//     return second ? GUEST_AUTH_SEGMENTS.has(second) : false;
//   }

//   return GUEST_AUTH_SEGMENTS.has(first);
// }

// function getLocaleFromPathname(pathname: string): string {
//   const segments = pathname.split("/").filter(Boolean);
//   if (
//     segments.length >= 1 &&
//     i18n.locales.includes(segments[0] as (typeof i18n.locales)[number])
//   ) {
//     return segments[0];
//   }
//   return defaultLocale;
// }

// /** Home: `/` for default locale (ar), `/{locale}` for others (e.g. `/en`). */
// function redirectLoggedInUserHome(
//   request: NextRequest,
//   pathname: string,
//   search: string,
// ) {
//   const locale = getLocaleFromPathname(pathname);
//   const path = locale === defaultLocale ? "/" : `/${locale}`;
//   const url = new URL(path + search, request.url);
//   return NextResponse.redirect(url);
// }

// export function middleware(request: NextRequest) {
//   const { pathname, search } = request.nextUrl;

//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   const accessToken = request.cookies.get("access_token")?.value;

//   const isVerifyPage = pathname.includes("verify-code");


//   if (accessToken && isGuestAuthPath(pathname) && !isVerifyPage) {
//   return redirectLoggedInUserHome(request, pathname, search);
// }

//   const localeInPath = i18n.locales.find(
//     (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
//   );

//   if (!localeInPath) {
//     const res = NextResponse.rewrite(
//       new URL(`/${defaultLocale}${pathname}${search}`, request.url),
//     );

//     res.cookies.set("lang", defaultLocale, { path: "/" });
//     return res;
//   }

//   const locale = localeInPath;

//   if (locale === defaultLocale) {
//     const dest = pathname.replace(`/${defaultLocale}`, "") || "/";
//     const res = NextResponse.redirect(
//       new URL(`${dest}${search}`, request.url),
//     );

//     res.cookies.set("lang", defaultLocale, { path: "/" });
//     return res;
//   }

//   const res = NextResponse.next();
//   res.cookies.set("lang", locale, { path: "/" });

//   return res;
// }

// export const config = {
//   matcher: ["/((?!api|_next|favicon.ico).*)"],
// };
