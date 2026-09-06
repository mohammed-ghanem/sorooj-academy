"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "./GlobeBtn";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import { LoginButtonSkeleton } from "@/components/skeletons/LoginButtonSkeleton";
import NavbarUserMenu from "./NavbarUserMenu";

const NAV_FALLBACK = {
  ar: {
    home: "الرئيسية",
    studyPlan: "الخطة الدراسية",
    teachingStaff: "هيئة التدريس",
    StudyTopics: "المحاور الدراسية",
    independentScientificPaths: "مسارات علمية مستقلة",
    library: "المكتبة العلمية",
    contactUs: "تواصل معنا",
    login: "تسجيل الدخول",
    student: "طالب",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    logo: "أكاديمية سرج",
  },
  en: {
    home: "Home",
    studyPlan: "Study Plan",
    teachingStaff: "Teaching Staff",
    StudyTopics: "Study Topics",
    independentScientificPaths: "Independent Scientific Paths",
    library: "Library",
    contactUs: "Contact Us",
    login: "Login",
    student: "Student",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    logo: "Sorooj Academy",
  },
} as const;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [auth, setAuth] = useState<{
    in: boolean;
    displayName: string | null;
  }>({ in: false, displayName: null });

  const lang = LangUseParams();
  const translate = TranslateHook();
  const locale = lang === "en" ? "en" : "ar";
  const fallback = NAV_FALLBACK[locale];
  const nav = translate?.home?.navbar;
  const loginLabel = nav?.login ?? fallback.login;
  const studentFallback = nav?.student ?? fallback.student;

  useEffect(() => {
    const syncAuthFromCookies = () => {
      const token = Cookies.get("access_token");
      if (!token) {
        setAuth({ in: false, displayName: null });
        return;
      }
      const raw = Cookies.get("user");
      if (!raw) {
        setAuth({ in: true, displayName: null });
        return;
      }
      try {
        const u = JSON.parse(raw) as { name?: string; email?: string };
        const displayName =
          u.name?.trim() || u.email?.split("@")[0]?.trim() || null;
        setAuth({ in: true, displayName });
      } catch {
        setAuth({ in: true, displayName: null });
      }
    };

    syncAuthFromCookies();
    window.addEventListener("sorooj-auth-session", syncAuthFromCookies);
    return () =>
      window.removeEventListener("sorooj-auth-session", syncAuthFromCookies);
  }, [pathname]);

  const navLinks = [
    { label: nav?.home ?? fallback.home, href: `/${lang}` },
    { label: nav?.studyPlan ?? fallback.studyPlan, href: `/${lang}/study-plan` },
    { label: nav?.teachingStaff ?? fallback.teachingStaff, href: `/${lang}/faculty-members` },
    { label: nav?.StudyTopics ?? fallback.StudyTopics, href: `/${lang}/study-terms` },
    { label: nav?.independentScientificPaths ?? fallback.independentScientificPaths, href: `/${lang}/single-learning-pathes` },
    { label: nav?.library ?? fallback.library, href: `/${lang}/book-library` },
    { label: nav?.contactUs ?? fallback.contactUs, href: `/${lang}/contact-us` },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="relative flex items-center justify-between mt-4 rounded-xl px-6 py-2 bgTitleColorOpacity shadow-sm">
          {/* logo */}
          <Link href={`/${lang}`}>
            <Image
              src={logo}
              alt={fallback.logo}
              width={logo.width}
              height={logo.height}
              className="h-auto w-[100px]"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <nav
            className="hidden lg:flex items-center gap-4 md:gap-5 text-sm lg:text-base"
            aria-label={locale === "en" ? "Main" : "القائمة الرئيسية"}
          >
            {navLinks.map((link, index) => (
              <Link
                key={`${link.label}-${index}`}
                href={link.href}
                className="hover:mainColor transition font-bold mainColor"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full  flex items-center justify-center text-sm">
              <GlobeBtn />
            </div>

            {translate ? (
              auth.in ? (
                <NavbarUserMenu
                  displayName={auth.displayName}
                  studentFallback={studentFallback}
                  lang={lang ?? "ar"}
                />
              ) : (
                <Link
                  href={`/${lang}/select-auth`}
                  className="scoundBgColor text-white px-4 py-2 rounded-lg text-sm"
                >
                  {loginLabel}
                </Link>
              )
            ) : (
              <LoginButtonSkeleton />
            )}
          </div>
 
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col gap-1"
            aria-expanded={isOpen}
            aria-label={isOpen ? fallback.closeMenu : fallback.openMenu}
          >
            <span className="w-6 h-0.5 scoundBgColor" aria-hidden />
            <span className="w-6 h-0.5 scoundBgColor" aria-hidden />
            <span className="w-6 h-0.5 scoundBgColor" aria-hidden />
          </button>

          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-3 p-4 flex flex-col gap-4 lg:hidden">
              {navLinks.map((link, index) => (
                <Link
                  key={`${link.label}-m-${index}`}
                  href={link.href}
                  className="font-bold mainColor"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Actions inside mobile */}
              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm">
                  <GlobeBtn />
                </div>

                {translate ? (
                  auth.in ? (
                    <NavbarUserMenu
                      displayName={auth.displayName}
                      studentFallback={studentFallback}
                      lang={lang ?? "ar"}
                      onAfterLogout={() => setIsOpen(false)}
                      className="w-full flex-1 justify-between"
                    />
                  ) : (
                    <Link
                      href={`/${lang}/select-auth`}
                      className="scoundBgColor text-white px-4 py-2 rounded-lg text-sm w-full text-center"
                    >
                      {loginLabel}
                    </Link>
                  )
                ) : (
                  <LoginButtonSkeleton fullWidth />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
