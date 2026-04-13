import { Skeleton } from "@/components/ui/skeleton";

/** Title line beside globe (replaces h1). */
export function SelectAuthHeaderTitleSkeleton() {
  return (
    <div className="min-w-0 flex-1" aria-hidden="true">
      <Skeleton className="h-8 w-[40%] max-w-sm rounded-md scoundBgColor opacity-15 " />
    </div>
  );
}
 
/** Description block under the title row. */
export function SelectAuthHeaderDescriptionSkeleton() {
  return (
    <div className="mt-2 space-y-2" aria-hidden="true">
      <Skeleton className="h-4 w-[70%] rounded-md scoundBgColor opacity-15" />
      {/* <Skeleton className="h-4 w-[92%] rounded-md scoundBgColor opacity-30" /> */}
    </div>
  );
}

/** Section subtitle under description. */
export function SelectAuthHeaderSectionSkeleton() {
  return (
    <Skeleton
      className="mt-6 h-5 w-36 rounded-md md:h-6 md:w-56 scoundBgColor opacity-15"
      aria-hidden="true"
    />
  );
}

/** Role card title + description (student / trainer). */
export function SelectAuthRoleCardTextSkeleton() {
  return (
    <div
      className="flex w-full flex-col items-center gap-2.5"
      aria-hidden="true"
    >
      <Skeleton className="h-6 w-36 rounded-md md:h-7 md:w-40 scoundBgColor opacity-15" />
      <Skeleton className="h-3 w-full max-w-[220px] rounded-md scoundBgColor opacity-15" />
      <Skeleton className="h-3 w-[90%] max-w-[200px] rounded-md scoundBgColor opacity-15" />
      <Skeleton className="h-3 w-[70%] max-w-[160px] rounded-md scoundBgColor opacity-15" />
    </div>
  );
}
