import { Skeleton } from "@/components/ui/skeleton";

function SubjectCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl bg-white pb-4 text-center shadow-r-sm sm:rounded-2xl sm:text-right"
      aria-hidden
    >
      <div className="relative mb-4 h-40 w-full p-2.5">
        <Skeleton className="h-full w-full rounded-3xl scoundBgColor opacity-15" />
      </div>

      <div className="mx-4">
        <Skeleton className="mb-4 h-5 w-3/4 rounded-md scoundBgColor opacity-15" />

        <Skeleton className="mb-2 h-3 w-full rounded-md scoundBgColor opacity-15" />

        <Skeleton className="mb-1 h-4 w-24 rounded-md scoundBgColor opacity-15" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded-md scoundBgColor opacity-15" />
          <Skeleton className="h-3 w-10 rounded-md scoundBgColor opacity-15" />
        </div>

        <Skeleton className="mt-2 h-2 w-full rounded-full scoundBgColor opacity-15" />

        <hr className="my-2" />

        <div className="mt-4 text-end">
          <Skeleton className="ms-auto inline-block h-9 w-28 rounded-md scoundBgColor opacity-15" />
        </div>
      </div>
    </div>
  );
}

type SingleTermDetailSkeletonProps = {
  count?: number;
};

/** Term detail: grid of subject cards — matches `SingleTerm.tsx`. */
export default function SingleTermDetailSkeleton({
  count = 4,
}: SingleTermDetailSkeletonProps) {
  return (
    <div
      className="container mx-auto grid w-[80%] grid-cols-1 gap-6 py-4 md:grid-cols-4 md:py-20"
      aria-busy="true"
      aria-label="Loading term subjects"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SubjectCardSkeleton key={`term-subject-skeleton-${i}`} />
      ))}
    </div>
  );
}

export function SingleTermHeroTitleSkeleton() {
  return (
    <Skeleton className="mx-auto mt-2 h-8 w-48 max-w-[90%] rounded-md scoundBgColor opacity-15" />
  );
}
