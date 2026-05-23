import { Skeleton } from "@/components/ui/skeleton";

function SubjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white pb-4 shadow-r-sm sm:rounded-2xl">
      <Skeleton className="mb-4 h-40 w-full rounded-none scoundBgColor opacity-15" />
      <div className="mx-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-3 w-full rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-3 w-5/6 rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-2 w-full rounded-full scoundBgColor opacity-15" />
        <Skeleton className="ms-auto h-9 w-28 rounded-md scoundBgColor opacity-15" />
      </div>
    </div>
  );
}

type SingleTermDetailSkeletonProps = {
  count?: number;
};

/** Term detail: grid of subject cards. */
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
