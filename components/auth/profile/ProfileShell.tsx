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
      <div className="min-h-screen bg-white">
        {hero}
        <ProfileSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-white">
      {hero}

      <div
        className="container mx-auto mt-11! w-[92%] max-w-6xl px-2 pb-16 pt-2 md:pb-24"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="overflow-hidden rounded-2xl border border-[#d7e4ee] bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
            <aside className="border-b border-[#edf1f5] lg:border-b-0 lg:border-e">
              <div className="flex flex-col items-center px-6 py-8 text-center bgTitleColor">
                <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bkMainColor text-2xl font-bold text-white">
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
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-[#f3f5f7] mainColor border-s-4 border-[#7eb8d6]"
                          : "descriptionColor hover:bg-[#f7f7f7]",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setLogoutDialogOpen(true)}
                  className={cn(
                    "mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-start text-sm font-semibold scoundColor transition-colors hover:bg-[#f5f3ed]",
                    logoutDialogOpen && "bg-[#f5f3ed]",
                  )}
                >
                  <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                  {dd?.logout}
                </button>
              </nav>
            </aside>

            <div className="p-5 sm:p-8 lg:p-10">{children}</div>
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
