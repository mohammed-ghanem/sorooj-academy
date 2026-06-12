import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StudyPlanSkeletonProps = {
  dir?: "rtl" | "ltr";
};

function StudyPlanTimelineCardSkeleton({
  withArrow = false,
  staggerClass = "",
}: {
  withArrow?: boolean;
  staggerClass?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-1 flex-col", staggerClass)} aria-hidden>
      {withArrow ? (
        <Skeleton className="mb-2 hidden h-9 w-40 max-w-full rounded-md scoundBgColor opacity-15 lg:block" />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col rounded-2xl lightBgColor p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-2/3 max-w-[180px] rounded-md scoundBgColor opacity-15" />
          <Skeleton className="h-8 w-10 rounded-md scoundBgColor opacity-15" />
        </div>

        <Skeleton className="h-4 w-full rounded-md scoundBgColor opacity-15" />
        <Skeleton className="mt-2 h-4 w-[92%] rounded-md scoundBgColor opacity-15" />

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#e8e4dc]/80 pt-5 sm:gap-6">
          {[0, 1].map((col) => (
            <div key={col}>
              <Skeleton className="mb-3 h-4 w-20 rounded-md scoundBgColor opacity-15" />
              <div className="flex gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full scoundBgColor opacity-15" />
                <div className="flex flex-1 flex-col gap-3 py-0.5">
                  <Skeleton className="h-4 w-full rounded-md scoundBgColor opacity-15" />
                  <Skeleton className="h-3 w-4/5 rounded-md scoundBgColor opacity-15" />
                  <Skeleton className="h-4 w-full rounded-md scoundBgColor opacity-15" />
                  <Skeleton className="h-3 w-4/5 rounded-md scoundBgColor opacity-15" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudyPlanAxisCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-6"
      aria-hidden
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-7 w-40 max-w-full rounded-md scoundBgColor opacity-15" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-5 w-24 rounded-md scoundBgColor opacity-15" />
            <Skeleton className="h-5 w-24 rounded-md scoundBgColor opacity-15" />
          </div>
        </div>
        <Skeleton className="h-4 w-4 shrink-0 rounded scoundBgColor opacity-15" />
      </div>

      <hr className="my-5 border-[#efefef]" />

      <div className="space-y-4">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-48 max-w-full rounded-md scoundBgColor opacity-15" />
              <div className="grid w-[50%] grid-cols-2 gap-y-1">
                <Skeleton className="h-3 w-full rounded-md scoundBgColor opacity-15" />
                <Skeleton className="h-3 w-full rounded-md scoundBgColor opacity-15" />
              </div>
            </div>
            <Skeleton className="h-7 w-16 shrink-0 rounded-full scoundBgColor opacity-15" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudyPlanHeroTitleSkeleton() {
  return (
    <Skeleton className="mx-auto mb-4 mt-28 h-8 w-48 max-w-[90%] rounded-md scoundBgColor opacity-15" />
  );
}

export default function StudyPlanSkeleton({ dir = "rtl" }: StudyPlanSkeletonProps) {
  const isRtl = dir === "rtl";

  return (
    <div aria-busy="true" aria-label="Loading study plan">
      <div>
        <div className="flex justify-center px-2">
          <StudyPlanHeroTitleSkeleton />
        </div>

        <div className="container mx-auto mt-5 w-[92%] max-w-7xl px-2 pt-4 pb-8 md:pt-6 md:pb-10">
          <Skeleton className="mx-auto h-8 w-64 max-w-full rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-4 h-4 w-[min(100%,640px)] rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-2 h-4 w-[min(100%,520px)] rounded-md scoundBgColor opacity-15" />
        </div>

        <div className="container mx-auto w-[92%] max-w-7xl px-2 pb-16 md:pb-20">
          <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:gap-5 xl:gap-6">
            <StudyPlanTimelineCardSkeleton />
            <StudyPlanTimelineCardSkeleton withArrow staggerClass="xl:mt-3" />
            <StudyPlanTimelineCardSkeleton withArrow staggerClass="xl:mt-18" />
          </div>
        </div>
      </div>

      <div className="bg-[#F6F6F6] pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="container mx-auto w-[92%] max-w-7xl px-2 pt-2">
          <Skeleton className="mx-auto h-9 w-72 max-w-full rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-4 h-4 w-[min(100%,560px)] rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-2 h-4 w-[min(100%,480px)] rounded-md scoundBgColor opacity-15" />
        </div>

        <div
          dir={dir}
          className={cn(
            "container mx-auto mt-10 w-[92%] max-w-7xl space-y-6 px-2 md:mt-14",
            isRtl ? "text-right" : "text-left",
          )}
        >
          {[0, 1].map((year) => (
            <div key={year} className="space-y-4">
              <Skeleton className="mx-auto h-7 w-48 rounded-md scoundBgColor opacity-15" />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                <StudyPlanAxisCardSkeleton />
                <StudyPlanAxisCardSkeleton />
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="m-3 bgTitleColor px-4 py-14 sm:py-16 lg:py-20 md:m-0">
        <div className="container mx-auto">
          <Skeleton className="mx-auto size-[100px] rounded-full scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-10 h-8 w-80 max-w-full rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-4 h-4 w-[min(100%,480px)] rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-2 h-4 w-[min(100%,420px)] rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mx-auto mt-10 h-[min(60vw,420px)] w-full max-w-4xl rounded-2xl scoundBgColor opacity-15" />
        </div>
      </section>
    </div>
  );
}
