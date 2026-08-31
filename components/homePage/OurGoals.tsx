"use client";

import Image from "next/image";
import "./styles.css";
import { useGetHomeGoalsQuery } from "@/store/studentHome/studentHomeApi";
import LangUseParams from "@/translate/LangUseParams";

const DefaultGoalImage = "/assets/images/goal1.webp";
const DefaultGoalIcon = "/assets/images/balance.svg";

const OurGoals = () => {
  const lang = LangUseParams();
  const locale = lang === "en" ? "en" : "ar";

  const {
    data: goals = [],
    isLoading,
    isUninitialized,
    isFetching,
  } = useGetHomeGoalsQuery({ lang: locale });

  const showSkeleton =
    isUninitialized || isLoading || (isFetching && goals.length === 0);

  return (
    <section className="py-14 sm:py-16 lg:py-18 px-2 bg-white container mx-auto w-[90%]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-xl md:text-2xl font-bold mainColor leading-snug">
            <span className="mainColor">أهدافنا نحو بناء </span>
            <span className="scoundColor">جيلٍ واعٍ بالعلم </span>
          </h2>

          <p className="descriptionColor font-bold mt-3 sm:mt-4  mx-auto text-sm sm:text-base leading-relaxed">
            نعمل على بناء تجربة تعليمية متكاملة تدعم طالب العلم في رحلته نحو
            الفهم والتأصيل عبر منهج واضح ومتدرج.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {showSkeleton
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`goal-skeleton-${index}`}
                  className="relative mb-10 rounded-xl bg-white shadow-sm sm:rounded-2xl"
                  aria-hidden
                >
                  <div className="relative h-80 w-full animate-pulse overflow-hidden rounded-xl bg-[#efece7] sm:rounded-2xl" />
                  <div
                    className="absolute -bottom-10 right-0 left-0 m-auto w-[90%] rounded-xl
                      bg-white p-4 shadow sm:h-40 sm:rounded-2xl sm:p-5 lg:h-45 lg:p-6"
                  >
                    <div className="absolute top-0 right-4 h-12 w-12 animate-pulse rounded-b-full bg-[#9F854E]/20" />
                    <div className="mt-8 space-y-2">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-[#9F854E]/15" />
                      <div className="h-4 w-full animate-pulse rounded bg-[#9F854E]/15" />
                    </div>
                  </div>
                </div>
              ))
            : goals.map((item) => (
                <div
                  key={item.id}
                  className="bg-white
              shadow-sm hover:shadow-md transition duration-300 text-center sm:text-right relative
               rounded-xl sm:rounded-2xl mb-10"
                >
                  <div className=" w-full h-80 relative rounded-xl sm:rounded-2xl overflow-hidden">
                    <Image
                      src={item.image || DefaultGoalImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={Boolean(item.image)}
                    />
                  </div>
                  <div
                    className="absolute bg-white rounded-xl sm:rounded-2xl w-[90%]
               m-auto -bottom-10 left-0 right-0 p-4 sm:p-5 lg:p-6 shadow h-auto sm:h-40 lg:h-45"
                  >
                    <div className="scoundBgColor absolute top-0 right-4 w-12 h-12 rounded-b-full flex items-center justify-center shadow-md">
                      <Image
                        src={item.icon || DefaultGoalIcon}
                        alt={item.title}
                        width={30}
                        height={30}
                        className="w-7.5 h-7.5"
                        unoptimized={Boolean(item.icon)}
                      />
                    </div>
                    <div className="mt-8">
                      <h3 className="font-bold text-xl mb-1 sm:mb-2 mainColor ">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm descriptionColor leading-relaxed font-bold">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default OurGoals;
