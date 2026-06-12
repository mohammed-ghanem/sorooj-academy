import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder playlist rows in the lesson sidebar. */
function PlaylistItemSkeleton() {
  return (
    <div
      className="my-1 rounded-md border border-transparent bg-white px-4 py-3 shadow-sm"
      aria-hidden
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex shrink-0 items-center">
          <Skeleton className="me-4 h-4 w-4 rounded scoundBgColor opacity-15" />
          <Skeleton className="h-11 w-11 shrink-0 rounded-full scoundBgColor opacity-15" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-start">
          <Skeleton className="h-[50px] w-[90px] shrink-0 rounded-md scoundBgColor opacity-15" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md scoundBgColor opacity-15" />
            <Skeleton className="h-7 w-24 rounded-md scoundBgColor opacity-15" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lesson page body: subject bar, player, playlist, tabs — matches `SingleLessonContent.tsx`. */
export default function SingleLessonContentSkeleton() {
  return (
    <>
      <div className="container mx-auto w-[90%] bg-white py-10">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded scoundBgColor opacity-15" />
          <Skeleton className="h-6 w-56 max-w-[70%] rounded-md scoundBgColor opacity-15" />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Skeleton className="h-11 w-11 shrink-0 rounded-full scoundBgColor opacity-15" />
          <Skeleton className="h-4 w-40 rounded-md scoundBgColor opacity-15" />
        </div>
      </div>

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-14 md:pb-24">
        <div
          className="container mx-auto grid w-[90%] grid-cols-1 gap-6 lg:grid-cols-12"
          aria-busy="true"
          aria-label="Loading lesson"
        >
          <div className="order-1 lg:order-0 lg:col-span-8 lg:row-start-1">
            <div className="rounded-2xl bg-white p-4 shadow-r-sm md:p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="mb-4 flex w-full items-center justify-between gap-3">
                  <Skeleton className="h-5 w-2/5 max-w-[200px] rounded-md scoundBgColor opacity-15" />
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Skeleton className="h-9 w-32 rounded-md scoundBgColor opacity-15" />
                    <Skeleton className="h-9 w-36 rounded-md scoundBgColor opacity-15" />
                  </div>
                </div>
              </div>

              <Skeleton className="aspect-video w-full rounded-xl scoundBgColor opacity-15" />
            </div>
          </div>

          <div className="order-2 h-fit overflow-hidden rounded-2xl shadow-r-sm lg:order-0 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
            <div className="mb-4 bg-[#faf7f1] px-4 py-4">
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-md scoundBgColor opacity-15" />
                <Skeleton className="h-4 w-10 rounded-md scoundBgColor opacity-15" />
              </div>
              <Skeleton className="h-2 w-full rounded-full scoundBgColor opacity-15" />
            </div>

            <div className="max-h-[560px] overflow-x-hidden overflow-y-auto px-1 pb-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlaylistItemSkeleton key={`playlist-skeleton-${i}`} />
              ))}
            </div>
          </div>

          <div className="order-3 rounded-2xl shadow-r-sm lg:order-0 lg:col-span-8 lg:row-start-2">
            <div className="mb-4 border-b border-[#efe7d8]">
              <div className="grid grid-cols-2">
                <Skeleton className="h-12 rounded-none scoundBgColor opacity-15" />
                <Skeleton className="h-12 rounded-none scoundBgColor opacity-15" />
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-white p-4">
              <Skeleton className="h-3 w-full rounded-md scoundBgColor opacity-15" />
              <Skeleton className="h-3 w-[95%] rounded-md scoundBgColor opacity-15" />
              <Skeleton className="h-3 w-[88%] rounded-md scoundBgColor opacity-15" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Hero title placeholder while lesson detail loads. */
export function SingleLessonHeroTitleSkeleton() {
  return (
    <Skeleton className="mx-auto mt-2 h-8 w-64 max-w-[90%] rounded-md scoundBgColor opacity-15" />
  );
}
