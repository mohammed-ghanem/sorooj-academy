import Image from "next/image";
import HeroAuth from "@/components/auth/heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import {
  SelectAuthHeaderDescriptionSkeleton,
  SelectAuthHeaderTitleSkeleton,
} from "./SelectAuthSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

const LoginSkeleton = () => {
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
          <div
            className=" relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1
           ring-black/5 md:p-8"
          >
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
                <div className="relative z-20 shrink-0 me-10 ">
                  <GlobeBtn />
                </div>
              </div>
              <SelectAuthHeaderDescriptionSkeleton />
            </div>
            <div className="p-0 md:p-4 mt-4  mx-auto z-30 relative">
              <div className="mb-4 space-y-2" aria-hidden="true">
                <Skeleton className="h-3 w-24 rounded-md scoundBgColor opacity-15" />
                <Skeleton className="h-10 w-full rounded-md scoundBgColor opacity-15" />
              </div>
              <div className="mb-4 space-y-2" aria-hidden="true">
                <Skeleton className="h-3 w-28 rounded-md scoundBgColor opacity-15" />
                <Skeleton className="h-10 w-full rounded-md scoundBgColor opacity-15" />
              </div>
              <Skeleton
                className="h-3 w-36 rounded-md scoundBgColor opacity-15"
                aria-hidden="true"
              />
              <Skeleton
                className="mt-8 h-12 w-full rounded-lg scoundBgColor opacity-15"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 space-y-3 px-0 md:px-4" aria-hidden="true">
              <Skeleton className="h-11 w-full rounded-lg scoundBgColor opacity-15" />
              <Skeleton className="h-11 w-full rounded-lg scoundBgColor opacity-15" />
            </div>
            <div className="mt-2 flex justify-center">
              <Skeleton className="h-4 w-56 rounded-md scoundBgColor opacity-15" />
            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default LoginSkeleton;
