import { Skeleton } from "@/components/ui/skeleton";

type FacultyMembersSkeletonProps = {
  count?: number;
};

function FacultyMemberCardSkeleton() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden>
      <div
        className="relative rounded-3xl border border-[#E8E0D4]/60 bg-[#FAF7F2] px-5 pb-8 pt-16 shadow-sm
          md:rounded-[18px] md:px-6 md:pb-10 md:pt-17"
      >
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Skeleton
            className="size-[104px] rounded-full border-[3px] border-transparent scoundBgColor opacity-15 md:size-[118px]"
          />
          <Skeleton className="mx-auto mt-3 h-9 w-[min(100%,140px)] rounded-full scoundBgColor opacity-15" />
        </div>

        <div className="relative z-1 mt-4 flex flex-col items-center gap-2 pt-1">
          <Skeleton className="h-6 w-40 max-w-full rounded-md scoundBgColor opacity-15 md:h-7" />
          <Skeleton className="h-4 w-48 max-w-full rounded-md scoundBgColor opacity-15" />
          <Skeleton className="h-4 w-36 max-w-full rounded-md scoundBgColor opacity-15" />
        </div>
      </div>
    </div>
  );
}

export default function FacultyMembersSkeleton({
  count = 4,
}: FacultyMembersSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-4 lg:gap-y-8"
      aria-busy="true"
      aria-label="Loading faculty members"
    >
      {Array.from({ length: count }).map((_, i) => (
        <FacultyMemberCardSkeleton key={`faculty-member-skeleton-${i}`} />
      ))}
    </div>
  );
}

export function FacultyMembersHeroTitleSkeleton() {
  return (
    <Skeleton className="mx-auto mb-4 mt-28 h-8 w-56 max-w-[90%] rounded-md scoundBgColor opacity-15" />
  );
}
