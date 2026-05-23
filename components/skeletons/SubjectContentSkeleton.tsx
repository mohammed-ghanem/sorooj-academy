import { Skeleton } from "@/components/ui/skeleton";

function LessonCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-4">
      <Skeleton className="h-10 w-14 rounded-md scoundBgColor opacity-15" />
      <Skeleton className="mt-5 h-4 w-2/3 rounded-md scoundBgColor opacity-15" />
      <Skeleton className="mt-2 h-3 w-full rounded-md scoundBgColor opacity-15" />
      <hr className="my-3" />
      <Skeleton className="h-4 w-24 rounded-md scoundBgColor opacity-15" />
    </div>
  );
}

/** Subject page: lessons grid + sidebar summary. */
export default function SubjectContentSkeleton() {
  return (
    <div
      className="container mx-auto grid w-[90%] grid-cols-1 gap-6 lg:grid-cols-12"
      aria-busy="true"
      aria-label="Loading subject"
    >
      <div className="lg:col-span-8 rounded-2xl bg-white p-4 shadow-r-sm md:p-6">
        <Skeleton className="mb-4 h-6 w-3/4 rounded-md scoundBgColor opacity-15" />
        <Skeleton className="mb-4 h-16 w-[80%] rounded-md scoundBgColor opacity-15" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LessonCardSkeleton key={`subject-lesson-skeleton-${i}`} />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4 mx-auto h-fit w-[95%] rounded-2xl bg-white p-4 shadow-r-sm">
        <Skeleton className="mb-4 h-56 w-full rounded-xl scoundBgColor opacity-15" />
        <Skeleton className="mb-2 h-6 w-1/2 rounded-md scoundBgColor opacity-15" />
        <Skeleton className="mb-4 h-5 w-full rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-2 w-full rounded-full scoundBgColor opacity-15" />
      </div>
    </div>
  );
}

export function SubjectContentHeroTitleSkeleton() {
  return (
    <Skeleton className="mx-auto mt-2 h-8 w-56 max-w-[90%] rounded-md scoundBgColor opacity-15" />
  );
}
