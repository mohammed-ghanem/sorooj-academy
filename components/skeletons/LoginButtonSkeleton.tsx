import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoginButtonSkeletonProps = {
  fullWidth?: boolean;
};

export function LoginButtonSkeleton({ fullWidth }: LoginButtonSkeletonProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm ",
        fullWidth && "w-full min-w-0"
      )}
      aria-hidden="true"
    >
      <Skeleton
        className={cn(
          "h-5 rounded-md ",
          fullWidth ? "w-full" : "w-26 sm:w-30 h-8 scoundBgColor"
        )}
      />
    </span>
  );
}
