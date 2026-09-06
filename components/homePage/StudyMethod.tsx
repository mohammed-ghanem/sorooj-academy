"use client";

import Image from "next/image";
import studyMethod from "@/public/assets/images/holyQ.jpg";
import { useGetHomeMethodologiesQuery } from "@/store/studentHome/studentHomeApi";
import LangUseParams from "@/translate/LangUseParams";

const DefaultMethodIcon = "/assets/images/frame30.svg";

const StudyMethod = () => {
  const lang = LangUseParams();
  const locale = lang === "en" ? "en" : "ar";

  const {
    data: studyMethods = [],
    isLoading,
    isUninitialized,
    isFetching,
  } = useGetHomeMethodologiesQuery({ lang: locale });

  const showSkeleton =
    isUninitialized || isLoading || (isFetching && studyMethods.length === 0);

  return (
    <section className="py-0 sm:py-16 lg:py-20 px-4 container mx-auto w-[90%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
        <div className="w-full md:w-[85%]">
          <h2 className="text-xl sm:text-2xl font-bold mainColor leading-snug">
            <span className="mainColor">منهجية الدراسة </span>
            <span className="scoundColor"> وآليتها</span>
          </h2>
          <p className="descriptionColor font-bold mt-3 sm:mt-4 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-md leading-relaxed">
            نظام تعليمي متدرج يجمع بين التأصيل العلمي، التطبيق العملي، والتقييم
            المستمر لضمان بناء معرفة راسخة.
          </p>
          <div
            className="relative container mx-auto mt-6 w-full h-80 p-0 
            overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 z-10 bg-[#f7f5f2]/10 rounded-2xl"></div>
            <Image
              src={studyMethod}
              alt="studyMethod"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="relative z-0 mx-auto max-h-107.5 object-cover"
            />
          </div>
        </div>
        <div className="">
          {showSkeleton
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`method-skeleton-${index}`}
                  className="lightBgColor mt-2.5 mb-2.5 flex items-start rounded-md px-4 py-7 md:mt-0"
                  aria-hidden
                >
                  <div className="ml-4 h-15 w-15 shrink-0 animate-pulse rounded-md bg-[#9F854E]/15" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-[#9F854E]/15" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#9F854E]/15" />
                    <div className="h-4 w-[90%] animate-pulse rounded bg-[#9F854E]/15" />
                  </div>
                </div>
              ))
            : studyMethods.map((stat) => (
                <div
                  key={stat.id}
                  className="lightBgColor mt-2.5 md:mt-0 rounded-md mb-2.5 flex items-start py-7 px-4"
                >
                  <div className="lightBgColor p-4 rounded-md ml-4 studyMethod-frame-icon">
                    <Image
                      width={60}
                      height={60}
                      src={stat.icon || DefaultMethodIcon}
                      alt={stat.title}
                      unoptimized={Boolean(stat.icon)}
                    />
                  </div>

                  <div className="text-start">
                    <h3 className="text-md mb-2 font-bold mainColor">
                      {stat.title}
                    </h3>
                    <p className="text-sm mt-1 descriptionColor font-bold">
                      {stat.description}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default StudyMethod;
