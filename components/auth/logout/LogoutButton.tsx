/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLogoutMutation } from "@/store/auth/authApi";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ConfirmLogoutDialog from "@/components/shared/ConfirmLogoutDialog";
import LangUseParams from "@/translate/LangUseParams";

interface LogoutButtonProps {
  onSuccess?: () => void;
  onDialogOpen?: () => void;
  onDialogClose?: () => void;
}

export default function LogoutButton({

  
  onSuccess,
  onDialogOpen,
  onDialogClose,
}: LogoutButtonProps) {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();
  const lang = LangUseParams();

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();

      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("reset_token", { path: "/" });

      toast.success(result?.message);
      onSuccess?.();


      router.refresh();

    } catch (err: any) {
      toast.error(
        err?.data?.message
      );

      Cookies.remove("access_token", { path: "/" });
      router.push(`/${lang}/`);
    }
  };

  return (
    <ConfirmLogoutDialog
      onConfirm={handleLogout}
      isLoading={isLoading}
      onOpenChange={(open) =>
        open ? onDialogOpen?.() : onDialogClose?.()
      }
    />
  );
}