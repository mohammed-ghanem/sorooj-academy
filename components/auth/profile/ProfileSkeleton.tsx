import { Skeleton } from "@/components/ui/skeleton";

type ProfileSkeletonActive =
  | "personal"
  | "certificates"
  | "journey"
  | "settings";

function CertificateCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem] bg-[#f7f4ec] px-6 py-5 shadow-[0_12px_28px_-18px_rgba(66,76,97,0.18)] ring-1 ring-black/5 sm:px-8 sm:py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(6,78,59,0.14) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <span
        aria-hidden
        className="absolute start-5 top-4 h-3.5 w-3.5 border-s-2 border-t-2 border-emerald-800/35"
      />
      <span
        aria-hidden
        className="absolute end-4 top-4 h-3.5 w-3.5 border-e-2 border-t-2 border-emerald-800/35"
      />
      <span
        aria-hidden
        className="absolute start-5 bottom-4 h-3.5 w-3.5 border-s-2 border-b-2 border-emerald-800/35"
      />
      <span
        aria-hidden
        className="absolute end-4 bottom-4 h-3.5 w-3.5 border-e-2 border-b-2 border-emerald-800/35"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative mx-auto h-[5.25rem] w-[7.25rem] shrink-0 sm:mx-0">
          <Skeleton className="h-full w-full rounded-xl rotate-[-4deg] scoundBgColor opacity-15" />
          <Skeleton className="absolute -bottom-2 -end-2 h-9 w-9 rounded-full scoundBgColor opacity-20" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-28 rounded-md scoundBgColor opacity-15" />
          <Skeleton className="h-5 w-48 max-w-full rounded-md scoundBgColor opacity-15" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-28 rounded-md scoundBgColor opacity-15" />
            <Skeleton className="h-6 w-24 rounded-md scoundBgColor opacity-15" />
          </div>
        </div>
        <div className="flex shrink-0 gap-2 sm:flex-col">
          <Skeleton className="h-10 w-28 rounded-full scoundBgColor opacity-15" />
          <Skeleton className="h-10 w-28 rounded-full scoundBgColor opacity-15" />
        </div>
      </div>
    </div>
  );
}

function CertificatesSkeletonBody() {
  return (
    <>
      <Skeleton className="mb-5 h-6 w-28 rounded-md scoundBgColor opacity-15" />
      <div className="mb-5 overflow-hidden rounded-xl border border-[#efe7d8]">
        <div className="grid grid-cols-2">
          <Skeleton className="h-12 w-full rounded-none scoundBgColor opacity-15" />
          <Skeleton className="h-12 w-full rounded-none scoundBgColor opacity-10" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <CertificateCardSkeleton />
        <CertificateCardSkeleton />
      </div>
    </>
  );
}

function PersonalSkeletonBody() {
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-40 rounded-md scoundBgColor opacity-15" />
        <Skeleton className="h-5 w-16 rounded-md scoundBgColor opacity-15" />
      </div>

      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={`profile-field-${i}`}
            className="flex items-center gap-3 rounded-xl bg-[#f8f5ef] px-3 py-3"
          >
            <Skeleton className="h-9 w-9 shrink-0 rounded-full scoundBgColor opacity-15" />
            <div className="min-w-0 flex-1 text-start">
              <Skeleton className="mb-1 h-3 w-20 rounded-md scoundBgColor opacity-15" />
              <Skeleton className="h-4 w-40 max-w-full rounded-md scoundBgColor opacity-15" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProfileSkeleton({
  active = "personal",
}: {
  active?: ProfileSkeletonActive;
}) {
  return (
    <div
      className="container mx-auto mt-11! w-[92%] max-w-6xl px-2 pb-16 pt-2 md:pb-24"
      aria-busy="true"
      aria-hidden
    >
      <div className="overflow-hidden rounded-3xl border border-[#eadfcf] bg-[#fffdf9] shadow-[0_18px_40px_rgba(66,76,97,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-[#eadfcf] lg:border-b-0 lg:border-e">
            <div className="flex flex-col items-center px-6 py-8 text-center bg-[linear-gradient(180deg,#f7f5f2_0%,#e7dfd5_100%)]">
              <Skeleton className="mb-4 h-20 w-20 rounded-full scoundBgColor opacity-15" />
              <Skeleton className="mb-2 h-5 w-28 rounded-md scoundBgColor opacity-15" />
              <Skeleton className="h-4 w-16 rounded-md scoundBgColor opacity-15" />
            </div>

            <nav className="flex flex-col px-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={`profile-nav-${i}`}
                  className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full scoundBgColor opacity-15" />
                  <Skeleton className="h-4 w-28 rounded-md scoundBgColor opacity-15" />
                </div>
              ))}
              <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full scoundBgColor opacity-15" />
                <Skeleton className="h-4 w-24 rounded-md scoundBgColor opacity-15" />
              </div>
            </nav>
          </aside>

          <div className="bg-white p-5 sm:p-8 lg:p-10">
            {active === "certificates" ? (
              <CertificatesSkeletonBody />
            ) : (
              <PersonalSkeletonBody />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
