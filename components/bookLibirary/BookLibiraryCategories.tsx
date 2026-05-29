"use client";

import Image from "next/image";
import Link from "next/link";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import {
  LIBRARY_CATEGORIES,
  localizedCategory,
} from "@/lib/bookLibrary/mockData";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

const BookLibiraryCategories = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const bl = translate?.pages?.bookLibrary;
  const locale = lang === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  if (!translate) {
    return (
      <div className="min-h-[50vh] animate-pulse bg-gray-100/50" aria-hidden />
    );
  }

  return (
    <div className="bg-white">
      <div>
        <SmallHeroSection
          title={
            <h1 className="mb-4 mt-28 text-2xl font-semibold md:text-3xl">
              <span className="mainColor">{bl?.title}</span>
              <span className="scoundColor">{bl?.titleSpan}</span>
            </h1>
          }
        />
      </div>

      <div
        className="container mx-auto w-[92%] max-w-7xl px-2 pt-4 pb-16 md:pt-6 md:pb-24"
        dir={dir}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">
          {LIBRARY_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/${lang}/book-library/${category.id}`}
              className="group block"
              aria-label={localizedCategory(category, locale)}
            >
              <article
                className="bookLibraryCategoryCardBg relative flex h-[202px] w-full max-w-[302px]
                  mx-auto flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl
                  p-4 text-center transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className="pointer-events-none absolute right-0 top-0"
                  aria-hidden
                >
                  <Image
                    src="/assets/images/opacityBook.svg"
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>

                <div
                  className="pointer-events-none absolute inset-s-0 bottom-0"
                  aria-hidden
                >
                  <Image
                    src="/assets/images/lineCard.svg"
                    alt=""
                    width={1000}
                    height={100}
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="flex h-14 w-14 items-center justify-center">
                    <Image
                      src="/assets/images/bookLibirary.svg"
                      alt=""
                      width={40}
                      height={40}
                    />
                  </div>

                  <h2 className="text-base font-bold text-[#1a1a1a] sm:text-lg">
                    {localizedCategory(category, locale)}
                  </h2>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookLibiraryCategories;
