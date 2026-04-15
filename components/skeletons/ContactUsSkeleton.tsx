import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SocialLinks from "@/components/socialLinks/SocialLinks";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const ContactUsSkeleton = () => {
  return (
    <div>
      <SmallHeroSection
        title={
          <div className="text-2xl font-semibold mt-28 mb-4" aria-hidden="true">
            <Skeleton className="h-8 w-56 rounded-md scoundBgColor opacity-15" />
          </div>
        }
      />

      <div
        className="relative container mx-auto w-[95%] lg:w-[70%] mt-10 md:px-8 px-0 py-1 md:py-6 rounded-xl shadow bkMainColor"
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute bottom-2 -right-28 opacity-5">
          <Image
            src="/assets/images/contactbg.webp"
            alt=""
            width={600}
            height={600}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 text-white lg:px-0 px-4">
            <Skeleton className="h-9 w-32 rounded-4xl scoundBgColor opacity-15 my-4" />
            <Skeleton className="h-9 w-[85%] rounded-md scoundBgColor opacity-15" />
            <Skeleton className="mt-2 h-9 w-[60%] rounded-md scoundBgColor opacity-15" />
            <Skeleton className="mt-4 h-4 w-[90%] rounded-md scoundBgColor opacity-15" />
            <Skeleton className="mt-2 h-4 w-[75%] rounded-md scoundBgColor opacity-15" />
            <Skeleton className="mt-4 h-4 w-32 rounded-md scoundBgColor opacity-15" />
            <div className="mt-4">
              <SocialLinks className="rounded-md bg-[#6d7383] border-none" />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white w-[90%] rounded-xl shadow mx-auto lg:mt-0 mt-10">
            <div className="">
              <div className="relative w-full rounded-2xl boxBgOpacity shadow-lg ring-1 ring-black/5 md:px-8 md:py-8 px-4 py-4">
                <div className="pointer-events-none absolute top-0 left-0">
                  <Image
                    src="/assets/images/line.svg"
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                <div className="relative z-10 text-start">
                  <Skeleton className="h-8 w-52 rounded-md scoundBgColor opacity-15" />
                  <Skeleton className="mt-2 h-4 w-[70%] rounded-md scoundBgColor opacity-15" />
                </div>

                <div className="p-0 md:p-4 mt-4 mx-auto z-30 relative space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="mb-4 space-y-2">
                      <Skeleton className="h-3 w-28 rounded-md scoundBgColor opacity-15" />
                      <Skeleton className="h-10 w-full rounded-md scoundBgColor opacity-15" />
                    </div>
                  ))}
                  <div className="mb-4 space-y-2">
                    <Skeleton className="h-3 w-28 rounded-md scoundBgColor opacity-15" />
                    <Skeleton className="h-32 w-full rounded-md scoundBgColor opacity-15" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-lg scoundBgColor opacity-15 mt-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsSkeleton;
