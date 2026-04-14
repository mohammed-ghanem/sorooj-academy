import Image from "next/image";
import HeroAuth from "@/components/auth/heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import {
  SelectAuthHeaderDescriptionSkeleton,
  SelectAuthHeaderTitleSkeleton,
} from "./SelectAuthSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

const SignUpSkeleton = () => {
  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 mb-10">
          <Image
            src={logo}
            alt=""
            width={140}
            height={48}
            className="h-auto w-35 object-contain"
            priority
          />
          <div className="relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1 ring-black/5 md:p-8">
            <div className="pointer-events-none absolute top-0 left-0">
              <Image
                src="/assets/images/line.svg"
                alt=""
                width={100}
                height={100}
              />
            </div>
            <div className="relative z-10 text-start">
              <div className="flex items-start justify-between gap-3">
                <SelectAuthHeaderTitleSkeleton />
                <div className="me-10">
                  <GlobeBtn />
                </div>
              </div>
              <SelectAuthHeaderDescriptionSkeleton />
              <div className="flex gap-2 mt-4 items-center" aria-hidden="true">
                <Skeleton className="h-1 flex-1 rounded-full scoundBgColor opacity-15" />
                <Skeleton className="h-1 flex-1 rounded-full scoundBgColor opacity-15" />
                <Skeleton className="h-4 w-24 rounded-md scoundBgColor opacity-15" />
              </div>
              <div
                className="mt-4 flex items-center gap-3 justify-end"
                aria-hidden="true"
              >
                <Skeleton className="h-9 w-9 rounded-full scoundBgColor opacity-15" />
                <Skeleton className="h-9 w-9 rounded-full scoundBgColor opacity-15" />
              </div>
            </div>
            <div className="mt-6 space-y-4" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-28 rounded-md scoundBgColor opacity-15 " />
                  <Skeleton className="h-10 w-full rounded-md scoundBgColor opacity-15" />
                </div>
              ))}
              <Skeleton className="h-12 w-full rounded-lg scoundBgColor opacity-15" />
            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default SignUpSkeleton;
