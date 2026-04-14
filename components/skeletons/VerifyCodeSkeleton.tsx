import Image from "next/image";
import HeroAuth from "@/components/auth/heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import {
  SelectAuthHeaderDescriptionSkeleton,
  SelectAuthHeaderTitleSkeleton,
} from "./SelectAuthSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

const VerifyCodeSkeleton = () => {
  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 my-15 pb-9">
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
                <div className="relative z-20 shrink-0 me-10">
                  <GlobeBtn />
                </div>
              </div>
              <SelectAuthHeaderDescriptionSkeleton />
            </div>
            <div
              className="flex justify-center gap-3 mt-6"
              dir="ltr"
              aria-hidden="true"
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-14 rounded-md scoundBgColor opacity-15"
                />
              ))}
            </div>
            <Skeleton
              className="mt-6 h-12 w-full rounded-lg scoundBgColor opacity-15"
              aria-hidden="true"
            />
            <div className="mt-3 flex justify-center" aria-hidden="true">
              <Skeleton className="h-4 w-48 rounded-md scoundBgColor opacity-15" />
            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default VerifyCodeSkeleton;
