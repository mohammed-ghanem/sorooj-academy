"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import TranslateHook from "@/translate/TranslateHook";
import { LogOut, Loader2 } from "lucide-react";

type ConfirmLogoutDialogProps = {
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When set, dialog is controlled from the parent (no trigger button). */
  open?: boolean;
};

export default function ConfirmLogoutDialog({
  onConfirm,
  isLoading,
  onOpenChange,
  open,
}: ConfirmLogoutDialogProps) {
  const translate = TranslateHook();
  const dd = translate?.pages?.userDropDown;
  const isControlled = open !== undefined;

  return (
    <AlertDialog
      onOpenChange={onOpenChange}
      {...(isControlled ? { open } : {})}
    >
      {!isControlled ? (
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full cursor-pointer justify-start hover:bg-gray-50"
          >
            <LogOut className="mr-2 h-4 w-4 scoundBgColor text-white" />
            {dd?.logout}
          </Button>
        </AlertDialogTrigger>
      ) : null}

      <AlertDialogContent className="max-w-[min(100%-2rem,420px)] rounded-2xl border-0 px-8 py-10 text-center shadow-xl sm:max-w-105">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
          <LogOut className="h-7 w-7 text-white" strokeWidth={2.2} aria-hidden />
        </div>

        <AlertDialogHeader className="my-2 items-center text-center!">
          <AlertDialogTitle className="text-lg font-bold text-red-500 sm:text-xl">
            {dd?.confirmLogoutQuestion}
          </AlertDialogTitle>
          <AlertDialogDescription className="mx-auto mt-2 max-w-[320px] text-sm leading-relaxed descriptionColor">
            {dd?.confirmLogoutHint}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex-row! items-center justify-center! gap-3 space-x-0!">
          <AlertDialogCancel
            disabled={isLoading}
            className="m-0 h-auto min-w-30 cursor-pointer rounded-lg border border-[#d7d7d7] bg-white px-6 py-2.5 text-sm font-semibold text-[#6b7280] shadow-none outline-none hover:bg-gray-50 focus-visible:ring-0"
          >
            {dd?.cancelBtn}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              void onConfirm();
            }}
            className="m-0 h-auto min-w-30 cursor-pointer rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white! shadow-none hover:bg-red-600 focus-visible:ring-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {dd?.logoutProcissing}
              </span>
            ) : (
              dd?.logoutBtn ?? dd?.logout
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
