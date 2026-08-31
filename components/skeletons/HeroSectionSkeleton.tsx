import { Skeleton } from "@/components/ui/skeleton";

/** Inner hero copy — same spacing as `HeroSection.tsx` so content swaps in place. */
export default function HeroSectionSkeleton() {
  return (
    <div
      className="flex w-full flex-col items-center"
      aria-busy="true"
      aria-label="Loading hero"
    >
      <Skeleton className="mb-8 h-[46px] w-[min(100%,380px)] rounded-3xl bgTitleColor" />

      <Skeleton className="mb-4 h-10 w-[min(100%,420px)] rounded-md bgTitleColor md:h-12 md:w-[min(100%,520px)]" />

      <Skeleton className="mt-2 h-4 w-[min(100%,540px)] rounded-md bgTitleColor" />
      <Skeleton className="mt-2 h-4 w-[min(100%,460px)] rounded-md bgTitleColor" />

      <div className="mt-8 flex items-center justify-center gap-6">
        <Skeleton className="h-10 w-40 rounded-md bgTitleColor" />
        <Skeleton className="h-10 w-36 rounded-md bgTitleColor" />
      </div>
    </div>
  );
}
