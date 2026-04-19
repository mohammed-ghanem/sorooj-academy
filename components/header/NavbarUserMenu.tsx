"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ChevronDown, User, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useLogoutMutation } from "@/store/auth/authApi";
import TranslateHook from "@/translate/TranslateHook";
import ConfirmLogoutDialog from "@/components/shared/ConfirmLogoutDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NavbarUserMenuProps = {
  displayName: string | null;
  studentFallback?: string;
  lang: string;
  /** e.g. close mobile drawer after logout */
  onAfterLogout?: () => void;
  /** Wider trigger on mobile drawer */
  className?: string;
};

const clearAuthCookies = () => {
  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("reset_token", { path: "/" });
  Cookies.remove("user", { path: "/" });
  Cookies.remove("reset_email", { path: "/" });
  Cookies.remove("auth_otp_flow", { path: "/" });
};

export default function NavbarUserMenu({
  displayName,
  studentFallback,
  lang,
  onAfterLogout,
  className,
}: NavbarUserMenuProps) {
  const translate = TranslateHook();
  const router = useRouter();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const label = displayName?.trim() || studentFallback || "Student";
  const dd = translate?.pages?.userDropDown;

  const handleLogoutConfirm = async () => {
    try {
      const result = await logout().unwrap();
      clearAuthCookies();
      window.dispatchEvent(new Event("sorooj-auth-session"));
      toast.success(result?.message ?? dd?.logout ?? "");
      setLogoutDialogOpen(false);
      setMenuOpen(false);
      onAfterLogout?.();
      router.refresh();
      router.push(`/${lang}`);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error(msg ?? dd?.logout ?? "Logout failed");
      clearAuthCookies();
      window.dispatchEvent(new Event("sorooj-auth-session"));
      setLogoutDialogOpen(false);
      setMenuOpen(false);
      onAfterLogout?.();
      router.push(`/${lang}`);
    }
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} dir="rtl">
        <DropdownMenuTrigger
          className={cn(
            "flex max-w-[220px] items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-bold mainColor outline-none",
            "hover:bg-black/5  focus-visible:ring-[#9F854E]/40 outline-none ",
            " border-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer",
            className,
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          
          className="min-w-48 dir-rtl"
          sideOffset={6}
        >
          <DropdownMenuLabel className="max-w-[240px] truncate font-semibold">
            {label}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/${lang}`}
              className="flex cursor-pointer items-center gap-2"
            >
              <User className="size-4" />
              {dd?.profile ?? "Profile"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${lang}`}
              className="flex cursor-pointer items-center gap-2"
            >
              <KeyRound className="size-4" />
              {dd?.changePassword ?? "Change Password"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer scoundBgColor text-white! font-semibold"
            onSelect={(e) => {
              e.preventDefault();
              setLogoutDialogOpen(true);
            }}
          >
            {dd?.logout ?? "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmLogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
}
