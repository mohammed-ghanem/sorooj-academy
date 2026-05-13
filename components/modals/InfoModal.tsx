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

export type InfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryLabel: string;
  /** If set, primary action navigates (modal closes via link click). */
  primaryHref?: string;
  onPrimaryClick?: () => void;
  secondaryLabel: string;
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
  secondaryLabel,
  dir = "rtl",
}: InfoModalProps) {
  const rtl = dir === "rtl";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(rtl ? "text-right" : "text-left")}
        dir={dir}
        showCloseButton
      >
        <DialogHeader className={cn(rtl ? "sm:text-right" : "sm:text-left")}>
          <DialogTitle className="mainColor">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-base text-red-400">
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
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            {secondaryLabel}
          </Button>

          {primaryHref ? (
            <Button
              asChild
              className="scoundBgColor w-full text-white hover:opacity-90 sm:w-auto"
            >
              <Link
                href={primaryHref}
                onClick={() => onOpenChange(false)}
              >
                {primaryLabel}
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              className="scoundBgColor w-full text-white hover:opacity-90 sm:w-auto"
              onClick={() => {
                onPrimaryClick?.();
                onOpenChange(false);
              }}
            >
              {primaryLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
