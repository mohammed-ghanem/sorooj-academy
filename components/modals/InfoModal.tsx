"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarClock,
  CircleCheck,
  Info,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";

export type InfoModalVariant =
  | "info"
  | "login"
  | "enroll"
  | "success"
  | "ready"
  | "schedule";

const VARIANT_CONFIG: Record<
  InfoModalVariant,
  { icon: LucideIcon; iconClassName: string; ringClassName: string }
> = {
  info: {
    icon: Info,
    iconClassName: "mainColor",
    ringClassName: "lightBgColor",
  },
  login: {
    icon: LogIn,
    iconClassName: "mainColor",
    ringClassName: "lightBgColor",
  },
  enroll: {
    icon: UserPlus,
    iconClassName: "scoundColor",
    ringClassName: "bgTitleColor",
  },
  success: {
    icon: CircleCheck,
    iconClassName: "scoundColor",
    ringClassName: "bgTitleColor",
  },
  ready: {
    icon: BookOpen,
    iconClassName: "scoundColor",
    ringClassName: "bgTitleColor",
  },
  schedule: {
    icon: CalendarClock,
    iconClassName: "mainColor",
    ringClassName: "lightBgColor",
  },
};

export type InfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryLabel: string;
  /** Visual tone and default icon. */
  variant?: InfoModalVariant;
  /** If set, primary action navigates (modal closes via link click). */
  primaryHref?: string;
  /** When set without `primaryHref`, runs on primary tap; modal does not auto-close (caller closes via `onOpenChange`). */
  onPrimaryClick?: () => void | Promise<void>;
  /** Disables primary control and shows loading affordance. */
  primaryLoading?: boolean;
  /** Disables primary without loading spinner (e.g. irrecoverable enroll error). */
  primaryDisabled?: boolean;
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
  variant = "info",
  primaryHref,
  onPrimaryClick,
  primaryLoading = false,
  primaryDisabled = false,
  secondaryLabel = "",
  dir = "rtl",
}: InfoModalProps) {
  const rtl = dir === "rtl";
  const showSecondary = secondaryLabel.trim() !== "";
  const hasTitle = title.trim().length > 0;
  const hasDescription = Boolean(description?.trim());
  const accessibleTitle =
    title.trim() ||
    description?.trim().split("\n")[0]?.trim() ||
    primaryLabel.trim() ||
    "Info";
  const { icon: Icon, iconClassName, ringClassName } = VARIANT_CONFIG[variant];
  const primaryInactive = primaryLoading || primaryDisabled;

  const primaryButtonClass = cn(
    "scoundBgColor text-white hover:opacity-90",
    showSecondary ? "w-full sm:w-auto" : "w-full",
    primaryDisabled && !primaryLoading && "opacity-50 cursor-not-allowed",
  );

  const primaryButton = primaryHref ? (
    <Button
      asChild
      className={primaryButtonClass}
      disabled={primaryInactive}
    >
      <Link href={primaryHref} onClick={() => onOpenChange(false)}>
        {primaryLabel}
      </Link>
    </Button>
  ) : (
    <Button
      type="button"
      className={primaryButtonClass}
      disabled={primaryInactive}
      onClick={() => {
        if (primaryInactive) return;
        if (onPrimaryClick) {
          void Promise.resolve(onPrimaryClick());
          return;
        }
        onOpenChange(false);
      }}
    >
      {primaryLoading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          <span>{primaryLabel}</span>
        </span>
      ) : (
        primaryLabel
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-xl",
          rtl ? "text-right" : "text-left",
          "**:data-[slot=dialog-close]:top-3 **:data-[slot=dialog-close]:right-3",
          "**:data-[slot=dialog-close]:rtl:right-auto **:data-[slot=dialog-close]:rtl:left-3",
        )}
        dir={dir}
        showCloseButton
      >
        <div className="min-h-42 space-y-5 px-8 pb-4 pt-8">
          <div
            className={cn(
              "flex items-start gap-5",
              rtl ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                ringClassName,
              )}
              aria-hidden
            >
              <Icon className={cn("h-7 w-7", iconClassName)} strokeWidth={1.75} />
            </div>

            <div className="min-w-0 flex-1 space-y-3 pe-7">
              <DialogTitle
                className={cn(
                  "text-xl font-semibold leading-snug mainColor",
                  !hasTitle && "sr-only",
                )}
              >
                {hasTitle ? title : accessibleTitle}
              </DialogTitle>
              {hasDescription ? (
                <DialogDescription
                  className={cn(
                    "text-base leading-relaxed descriptionColor whitespace-pre-line",
                    !hasTitle && "text-lg font-medium mainColor",
                  )}
                >
                  {description}
                </DialogDescription>
              ) : null}
            </div>
          </div>
        </div>

        <DialogFooter
          className={cn(
            "border-t border-gray-100 bg-gray-50/80 px-8 py-5",
            "flex-col gap-3 sm:flex-row sm:gap-4",
            rtl ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end",
          )}
        >
          {showSecondary ? (
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 bg-white sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              {secondaryLabel}
            </Button>
          ) : null}
          {primaryButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
