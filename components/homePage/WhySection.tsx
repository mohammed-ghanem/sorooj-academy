"use client";

import Image from "next/image";
import "./styles.css";
import { useGetHomeFeaturesQuery } from "@/store/studentHome/studentHomeApi";
import LangUseParams from "@/translate/LangUseParams";

const DefaultFeatureIcon = "/assets/images/frame5.svg";

const WhySection = () => {
  const lang = LangUseParams();
  const locale = lang === "en" ? "en" : "ar";

  const {
    data: features = [],
    isLoading,
    isUninitialized,
    isFetching,
  } = useGetHomeFeaturesQuery({ lang: locale });

  const showSkeleton =
    isUninitialized || isLoading || (isFetching && features.length === 0);

  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 bgTitleColor m-3 md:m-0 decor-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mainColor leading-snug">
            <span className="mainColor">ما الذي يجعل هذه</span>
            <span className="scoundColor"> التجربة استثنائية؟</span>
          </h2>

          <p className="descriptionColor font-bold mt-3 sm:mt-4 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            رحلة علمية متكاملة صُممت بعناية لتيسير طلب العلم، وبناء المعرفة،
            وصناعة أثر علمي راسخ يمتد نفعه إلى الفرد والمجتمع.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {showSkeleton
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`feature-skeleton-${index}`}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm"
                  aria-hidden
                >
                  <div className="mb-3 flex justify-center sm:mb-4 sm:justify-start">
                    <div className="home-page-bg mb-2 h-13 w-13 animate-pulse rounded-lg sm:h-12 sm:w-12" />
                  </div>
                  <div className="mb-2 h-6 w-2/3 animate-pulse rounded bg-[#9F854E]/15" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#9F854E]/15" />
                  <div className="mt-2 h-4 w-[92%] animate-pulse rounded bg-[#9F854E]/15" />
                </div>
              ))
            : features.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 
              shadow-sm hover:shadow-md transition duration-300 text-center sm:text-right"
                >
                  <div className="flex justify-center sm:justify-start mb-3 sm:mb-4">
                    <div className=" p-3.25! sm:p-3 rounded-lg home-page-bg mb-2">
                      <Image
                        src={item.icon || DefaultFeatureIcon}
                        alt={item.title}
                        width={30}
                        height={30}
                        className="w-7.5 h-7.5"
                        unoptimized={Boolean(item.icon)}
                      />
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-1 sm:mb-2 mainColor ">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm descriptionColor leading-relaxed font-bold">
                    {item.description}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
