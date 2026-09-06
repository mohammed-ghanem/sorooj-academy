"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  GraduationCap,
  LogOut,
  Medal,
  Settings,
  User,
} from "lucide-react";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import ConfirmLogoutDialog from "@/components/shared/ConfirmLogoutDialog";
import ProfileSkeleton from "@/components/auth/profile/ProfileSkeleton";
import {
  asProfileText,
  unwrapProfileUser,
} from "@/components/auth/profile/profileUser";
import { useGetProfileQuery, useLogoutMutation } from "@/store/auth/authApi";
import { cn } from "@/lib/utils";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

export type ProfileNavId =
  | "personal"
  | "certificates"
  | "journey"
  | "settings";

const NAV_ICON_TONE: Record<
  ProfileNavId,
  { wrap: string; icon: string }
> = {
  personal: {
    wrap: "bg-[#e8edf4] text-[#424C61]",
    icon: "text-[#424C61]",
  },
  certificates: {
    wrap: "bg-[#f3ead6] text-[#9F854E]",
    icon: "text-[#9F854E]",
  },
  journey: {
    wrap: "bg-[#e5f0ea] text-[#4F7A62]",
    icon: "text-[#4F7A62]",
  },
  settings: {
    wrap: "bg-[#e9eef6] text-[#5A6B8A]",
    icon: "text-[#5A6B8A]",
  },
};

const PAGE_BG =
  "min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fdfcfa_100%)]";
const MAIN_CARD =
  "overflow-hidden rounded-3xl border border-[#eadfcf] bg-[#fffdf9] shadow-[0_18px_40px_rgba(66,76,97,0.08)]";

type ProfileShellProps = {
  active: ProfileNavId;
  children: ReactNode;
};

const clearAuthCookies = () => {
  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("reset_token", { path: "/" });
  Cookies.remove("user", { path: "/" });
  Cookies.remove("reset_email", { path: "/" });
  Cookies.remove("auth_otp_flow", { path: "/" });
};

export default function ProfileShell({ active, children }: ProfileShellProps) {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();
  const p = translate?.pages?.profile;
  const dd = translate?.pages?.userDropDown;

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { data, isLoading, isUninitialized } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const user = unwrapProfileUser(data);

  const hero = (
    <SmallHeroSection
      title={
        <h1 className="mb-4 mt-28 text-2xl font-semibold md:text-3xl">
          <span className="mainColor">{p?.title}</span>
          <span className="scoundColor">{p?.titleSpan}</span>
        </h1>
      }
    />
  );

  const handleLogoutConfirm = async () => {
    try {
      const result = await logout().unwrap();
      clearAuthCookies();
      window.dispatchEvent(new Event("sorooj-auth-session"));
      toast.success(result?.message ?? dd?.logout ?? "");
      setLogoutDialogOpen(false);
      router.refresh();
      router.push(`/${lang}`);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error(msg ?? dd?.logout ?? "Logout failed");
      clearAuthCookies();
      window.dispatchEvent(new Event("sorooj-auth-session"));
      setLogoutDialogOpen(false);
      router.push(`/${lang}`);
    }
  };

  if (!translate || isUninitialized || isLoading) {
    return (
      <div className={PAGE_BG}>
        {hero}
        <ProfileSkeleton active={active} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={PAGE_BG}>
        {hero}
        <p className="py-20 mb-3.5 text-center text-lg font-medium mainColor">
          {p?.noData}
        </p>
      </div>
    );
  }

  const name = asProfileText(user.name) || p?.emptyValue || "—";
  const genderLabel = asProfileText(user._gender) || asProfileText(user.gender);
  const avatarSrc = asProfileText(user.avatar) || asProfileText(user.image);
  const initial = name.slice(0, 1);

  const navItems = [
    {
      id: "personal" as const,
      href: `/${lang}/profile`,
      label: p?.personalDetails,
      icon: User,
    },
    {
      id: "certificates" as const,
      href: `/${lang}/profile/certificates`,
      label: p?.certificates,
      icon: Medal,
    },
    {
      id: "journey" as const,
      href: `/${lang}/profile/journey`,
      label: p?.journey,
      icon: GraduationCap,
    },
    {
      id: "settings" as const,
      href: `/${lang}/change-password`,
      label: p?.settings,
      icon: Settings,
    },
  ];

  return (
    <div className={PAGE_BG}>
      {hero}

      <div
        className="container mx-auto mt-11! w-[92%] max-w-6xl px-2 pb-16 pt-2 md:pb-24"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className={MAIN_CARD}>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
            <aside className="border-b border-[#eadfcf] bg-[#fffdf9] lg:border-b-0 lg:border-e">
              <div className="flex flex-col items-center px-6 py-8 text-center bg-[linear-gradient(180deg,#f7f5f2_0%,#e7dfd5_100%)]">
                <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bkMainColor text-2xl font-bold text-white ring-2 ring-white">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={name}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <p className="text-base font-bold mainColor">{name}</p>
                {genderLabel ? (
                  <p className="mt-1 text-sm descriptionColor">{genderLabel}</p>
                ) : null}
              </div>

              <nav
                className="flex flex-col px-3 py-4"
                aria-label={`${p?.title ?? ""}${p?.titleSpan ?? ""}`}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === active;
                  const tone = NAV_ICON_TONE[item.id];
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-[#f7f4ee] mainColor"
                          : "descriptionColor hover:bg-[#f8f5ef]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          tone.wrap,
                        )}
                      >
                        <Icon className={cn("h-4 w-4", tone.icon)} aria-hidden />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setLogoutDialogOpen(true)}
                  className={cn(
                    "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold scoundColor transition-colors hover:bg-[#f7f4ee]",
                    logoutDialogOpen && "bg-[#f7f4ee]",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3ead6] text-[#9F854E]">
                    <LogOut className="h-4 w-4" aria-hidden />
                  </span>
                  {dd?.logout}
                </button>
              </nav>
            </aside>

            <div className="bg-white p-5 sm:p-8 lg:p-10">{children}</div>
          </div>
        </div>
      </div>

      <ConfirmLogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
