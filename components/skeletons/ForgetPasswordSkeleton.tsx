import Image from "next/image";
import Link from "next/link";
import HeroAuth from "@/components/auth/heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import { Skeleton } from "@/components/ui/skeleton";

const ForgetPasswordSkeleton = () => {
  const lang = LangUseParams();

  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 my-15 pb-20">
          <Link href={`/${lang}`}>
            <Image
              src={logo}
              alt=""
              width={140}
              height={48}
              className="h-auto w-35 object-contain"
              priority
            />
          </Link>

          <div
            className="relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1
           ring-black/5 md:mt-4 md:p-12"
          >
            <div className="pointer-events-none absolute top-0 left-0">
              <Image
                src="/assets/images/line.svg"
                alt=""
                width={100}
                height={100}
              />
            </div>

            <div className="relative z-10 text-start" aria-hidden="true">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-7 w-[85%] max-w-sm rounded-md scoundBgColor opacity-15" />
                </div>
                <div className="relative z-20 shrink-0 me-10">
                  <GlobeBtn />
                </div>
              </div>
              <Skeleton className="mt-2 h-4 w-[72%] max-w-md rounded-md scoundBgColor opacity-15" />
            </div>

            <form
              className="p-0 md:p-4 mt-4 mx-auto z-30 relative"
              dir="ltr"
              aria-hidden="true"
            >
              <div className="mb-4 space-y-2">
                <Skeleton className="h-3 w-24 rounded-md scoundBgColor opacity-15" />
                <Skeleton className="h-10 w-full rounded-md scoundBgColor opacity-15" />
              </div>
              <Skeleton className="mt-6 h-12 w-full rounded-lg scoundBgColor opacity-15" />
            </form>

            <div className="mt-4 text-center" aria-hidden="true">
              <Skeleton className="mx-auto h-4 w-40 rounded-md scoundBgColor opacity-15" />
            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default ForgetPasswordSkeleton;
