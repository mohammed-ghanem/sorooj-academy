import { Skeleton } from "@/components/ui/skeleton";

type StudyTermsCardsSkeletonProps = {
  /** Number of placeholder cards (default 4). */
  count?: number;
};

function StudyTermsCardSkeleton() {
  return (
    <div className="relative rounded-xl bg-white p-4 shadow-r-sm sm:rounded-2xl sm:p-5 lg:p-6">
      <div className="mb-8 flex items-start justify-between md:mb-4">
        <Skeleton className="h-6 w-2/3 max-w-[180px] rounded-md scoundBgColor opacity-15" />
        <Skeleton className="absolute left-0 top-0 h-16 w-20 rounded-br-xl scoundBgColor opacity-5" />
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
        <Skeleton className="h-4 w-28 rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-4 w-24 rounded-md scoundBgColor opacity-15" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-full rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-3 w-[92%] rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-3 w-4/5 rounded-md scoundBgColor opacity-15" />
      </div>

      <Skeleton className="mt-3 mb-3 h-2 w-full rounded-full scoundBgColor opacity-15" />

      <Skeleton className="mb-4 h-3 w-16 rounded-md scoundBgColor opacity-15" />
      <Skeleton className="h-4 w-20 rounded-md scoundBgColor opacity-15" />
    </div>
  );
}

export default function StudyTermsCardsSkeleton({
  count = 4,
}: StudyTermsCardsSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-y-8 md:gap-y-16"
      aria-busy="true"
      aria-label="Loading study terms"
    >
      {Array.from({ length: count }).map((_, i) => (
        <StudyTermsCardSkeleton key={`study-term-skeleton-${i}`} />
      ))}
    </div>
  );
}
