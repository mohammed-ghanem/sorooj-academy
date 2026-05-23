"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type InfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryLabel: string;
  /** If set, primary action navigates (modal closes via link click). */
  primaryHref?: string;
  /** When set without `primaryHref`, runs on primary tap; modal does not auto-close (caller closes via `onOpenChange`). */
  onPrimaryClick?: () => void | Promise<void>;
  /** Disables primary control and shows loading affordance. */
  primaryLoading?: boolean;
  /** When empty, the outline secondary button is omitted. */
  secondaryLabel?: string;
  /** Layout for Arabic vs English */
  dir?: "rtl" | "ltr";
};

export default function InfoModal({
  open,
  onOpenChange,
  title,
  description,
  primaryLabel,
  primaryHref,
  onPrimaryClick,
  primaryLoading = false,
  secondaryLabel = "",
  dir = "rtl",
}: InfoModalProps) {
  const rtl = dir === "rtl";
  const showSecondary = secondaryLabel.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(rtl ? "text-right" : "text-left")}
        dir={dir}
        showCloseButton
      >
        <DialogHeader className={cn(rtl ? "sm:text-right" : "sm:text-left")}>
          {title.trim() ? (
            <DialogTitle className="mainColor">{title}</DialogTitle>
          ) : null}
          {description ? (
            <DialogDescription
              className={cn(
                "text-base text-gray-700 whitespace-pre-line",
                !title.trim() && "text-lg font-semibold mainColor",
              )}
            >
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <DialogFooter
          className={cn(
            "flex-col gap-2 sm:flex-row",
            rtl ? "sm:justify-start sm:gap-3" : "sm:justify-end sm:gap-3",
          )}
        >
          {showSecondary ? (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              {secondaryLabel}
            </Button>
          ) : null}

          {primaryHref ? (
            <Button
              asChild
              className="scoundBgColor w-full text-white hover:opacity-90 sm:w-auto"
            >
              <Link href={primaryHref} onClick={() => onOpenChange(false)}>
                {primaryLabel}
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              className="scoundBgColor w-full text-white hover:opacity-90 sm:w-auto"
              disabled={primaryLoading}
              onClick={() => {
                if (primaryLoading) return;
                if (onPrimaryClick) {
                  void Promise.resolve(onPrimaryClick());
                  return;
                }
                onOpenChange(false);
              }}
            >
              {primaryLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2
                    className="h-4 w-4 shrink-0 animate-spin"
                    aria-hidden
                  />
                  <span>{primaryLabel}</span>
                </span>
              ) : (
                primaryLabel
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
