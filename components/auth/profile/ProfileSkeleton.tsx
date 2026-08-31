import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
  return (
    <div
      className="container mx-auto mt-11! w-[92%] max-w-6xl px-2 pb-16 pt-2 md:pb-24"
      aria-busy="true"
      aria-hidden
    >
      <div className="overflow-hidden rounded-2xl border border-[#d7e4ee] bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-[#edf1f5] lg:border-b-0 lg:border-e">
            <div className="flex flex-col items-center px-6 py-8 text-center bgTitleColor">
              <Skeleton className="mb-4 h-20 w-20 rounded-full scoundBgColor opacity-15" />
              <Skeleton className="mb-2 h-5 w-28 rounded-md scoundBgColor opacity-15" />
              <Skeleton className="h-4 w-16 rounded-md scoundBgColor opacity-15" />
            </div>

            <nav className="flex flex-col px-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={`profile-nav-${i}`}
                  className="mb-1 h-11 w-full rounded-lg scoundBgColor opacity-15"
                />
              ))}
              <Skeleton className="mt-2 h-11 w-full rounded-lg scoundBgColor opacity-15" />
            </nav>
          </aside>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={`profile-stat-${i}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#edf1f5] bg-white px-4 py-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-12 rounded-md scoundBgColor opacity-15" />
                    <Skeleton className="h-3 w-24 rounded-md scoundBgColor opacity-15" />
                  </div>
                  <Skeleton className="h-10 w-10 shrink-0 rounded-lg scoundBgColor opacity-15" />
                </div>
              ))}
            </div>

            <div className="mb-5 flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-40 rounded-md scoundBgColor opacity-15" />
              <Skeleton className="h-5 w-16 rounded-md scoundBgColor opacity-15" />
            </div>

            <div className="flex flex-col gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`profile-field-${i}`} className="text-start">
                  <Skeleton className="mb-1 h-3 w-24 rounded-md scoundBgColor opacity-15" />
                  <Skeleton className="h-5 w-48 max-w-full rounded-md scoundBgColor opacity-15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
