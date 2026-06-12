import { Skeleton } from "@/components/ui/skeleton";

/** Home hero — matches `HeroSection.tsx` layout. */
export default function HeroSectionSkeleton() {
  return (
    <div className="relative" aria-busy="true" aria-label="Loading hero">
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <Skeleton className="absolute left-0 top-0 h-full w-24 opacity-10 sm:w-32 md:w-40" />
        <Skeleton className="absolute right-0 top-0 h-full w-24 opacity-10 sm:w-32 md:w-40" />

        <div className="absolute inset-0 heroSectionBg z-1 pointer-events-none" />

        <div className="relative z-10 mt-3 flex max-w-2xl flex-col items-center justify-center px-2 text-center heroSectionBg2">
          <Skeleton className="mb-8 h-11 w-[min(100%,320px)] rounded-3xl scoundBgColor opacity-15" />

          <div className="mb-4 flex w-full flex-col items-center gap-2">
            <Skeleton className="h-10 w-[min(100%,280px)] rounded-md scoundBgColor opacity-15 md:h-12" />
            <Skeleton className="h-10 w-[min(100%,220px)] rounded-md scoundBgColor opacity-15 md:h-12" />
          </div>

          <Skeleton className="mt-2 h-4 w-[min(100%,480px)] rounded-md scoundBgColor opacity-15" />
          <Skeleton className="mt-2 h-4 w-[min(100%,420px)] rounded-md scoundBgColor opacity-15" />

          <div className="mt-8 flex items-center justify-center gap-6">
            <Skeleton className="h-10 w-40 rounded-md scoundBgColor opacity-15" />
            <Skeleton className="h-10 w-36 rounded-md scoundBgColor opacity-15" />
          </div>
        </div>
      </section>
    </div>
  );
}
