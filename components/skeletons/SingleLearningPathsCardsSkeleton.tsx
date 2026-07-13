import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SingleLearningPathsCardsSkeletonProps = {
  count?: number;
  dir?: "rtl" | "ltr";
};

function PathCardSkeleton({ dir = "rtl" }: { dir?: "rtl" | "ltr" }) {
  const isRtl = dir === "rtl";

  return (
    <div
      className={cn(
        "relative block rounded-xl bg-white p-4 text-center shadow-r-sm sm:rounded-2xl sm:p-5 lg:p-6",
        isRtl ? "sm:text-right" : "sm:text-left",
      )}
      aria-hidden
    >
      <Skeleton
        className={cn(
          "absolute top-0 h-16 w-20 scoundBgColor opacity-5",
          isRtl ? "left-0 rounded-br-xl" : "right-0 rounded-bl-xl",
        )}
      />

      <div
        className={cn(
          "mb-8 min-h-16 md:mb-4",
          isRtl ? "text-right" : "pe-20 text-left",
        )}
      >
        <Skeleton className="h-6 w-2/3 max-w-[180px] rounded-md scoundBgColor opacity-15" />
      </div>

      <Skeleton className="h-4 w-28 rounded-md scoundBgColor opacity-15" />
      <Skeleton className="mt-3 h-3 w-full max-w-[95%] rounded-md scoundBgColor opacity-15" />
      <Skeleton className="mt-2 h-3 w-4/5 max-w-[80%] rounded-md scoundBgColor opacity-15" />

      <Skeleton
        className={cn(
          "mt-4 h-4 w-24 rounded-md scoundBgColor opacity-15",
          isRtl ? "ms-auto" : "me-auto",
        )}
      />
    </div>
  );
}

export default function SingleLearningPathsCardsSkeleton({
  count = 4,
  dir = "rtl",
}: SingleLearningPathsCardsSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-4 lg:gap-y-8"
      aria-busy="true"
      aria-label="Loading scientific paths"
    >
      {Array.from({ length: count }).map((_, i) => (
        <PathCardSkeleton key={`path-skeleton-${i}`} dir={dir} />
      ))}
    </div>
  );
}
