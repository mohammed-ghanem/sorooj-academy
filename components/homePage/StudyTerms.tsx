"use client";

import Image from "next/image";
import { useGetHomeStudyLevelsQuery } from "@/store/studentHome/studentHomeApi";
import LangUseParams from "@/translate/LangUseParams";

const DefaultLevelImage = "/assets/images/term1.webp";

function formatLevelBadge(orderIndex: number): string {
  return String(orderIndex).padStart(2, "0");
}

const StudyTerms = () => {
  const lang = LangUseParams();
  const locale = lang === "en" ? "en" : "ar";

  const {
    data: studyLevels = [],
    isLoading,
    isUninitialized,
    isFetching,
  } = useGetHomeStudyLevelsQuery({ lang: locale });

  const showSkeleton =
    isUninitialized || isLoading || (isFetching && studyLevels.length === 0);

  const timelineCount = showSkeleton ? 4 : studyLevels.length;

  return (
    <section className="py-10 sm:py-16 lg:py-20 px-4 relative decor-bg">
      <div className="absolute inset-0 z-0 studyTermsOverlayBg "></div>
      <div className="container mx-auto w-[90%] ">
        <div className="text-center m-auto mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mainColor">
            <span className="mainColor">نظام </span>
            <span className="scoundColor">الدراسة</span>
          </h2>

          <p className="descriptionColor font-bold mt-3 max-w-xl mx-auto text-sm sm:text-md">
            أربعة محاور دراسية متدرجة
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 h-full w-px scoundBgColor -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:flex  flex-col  justify-between items-center">
            {Array.from({ length: Math.max(timelineCount, 1) }).map((_, i) => (
              <span
                key={`level-dot-${i}`}
                className="w-4 h-4 scoundBgColor rounded-full"
              ></span>
            ))}
          </div>
          {showSkeleton
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`level-skeleton-${index}`}
                  className={`mb-8 flex flex-col items-center md:flex-row ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                  aria-hidden
                >
                  <div className="m-auto flex w-fit justify-center p-4 md:w-1/2">
                    <div className="space-y-2">
                      <div className="h-7 w-10 animate-pulse rounded-full bg-[#dfd8c5]" />
                      <div className="h-5 w-40 animate-pulse rounded bg-[#9F854E]/15" />
                      <div className="h-4 w-32 animate-pulse rounded bg-[#9F854E]/15" />
                    </div>
                  </div>
                  <div className="z-10 h-4 w-4 rounded-full bg-mainColor"></div>
                  <div className="md:w-1/2">
                    <div className="relative m-auto h-48 w-72 animate-pulse overflow-hidden rounded-md bg-[#efece7]" />
                  </div>
                </div>
              ))
            : studyLevels.map((term, index) => (
                <div
                  key={term.id}
                  className={`flex flex-col md:flex-row items-center mb-8 ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2 p-4 m-auto w-fit flex justify-center">
                    <div className="">
                      <p className="bg-[#dfd8c5] rounded-full mb-2 w-fit px-2 py-1 scoundColor">
                        {formatLevelBadge(term.orderIndex)}
                      </p>
                      <h3 className="text-md font-bold scoundColor mb-2">
                        {term.title}
                      </h3>
                      <p className="text-sm mainColor font-bold">
                        {term.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-4 h-4 bg-mainColor rounded-full z-10"></div>

                  <div className="md:w-1/2">
                    <div className="relative w-72 h-48 rounded-md overflow-hidden m-auto">
                      <Image
                        src={term.image || DefaultLevelImage}
                        alt={term.title}
                        fill
                        className="object-cover"
                        sizes="288px"
                        unoptimized={Boolean(term.image)}
                      />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default StudyTerms;
