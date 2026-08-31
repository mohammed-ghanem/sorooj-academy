"use client";

import Image from "next/image";
import Link from "next/link";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import { useGetBookCategoriesQuery } from "@/store/bookLibrary/bookLibraryApi";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

const BookLibiraryCategories = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const bl = translate?.pages?.bookLibrary;

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBookCategoriesQuery({ lang: lang ?? "" });

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
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8"
            aria-busy="true"
            aria-hidden
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`book-cat-skeleton-${i}`}
                className="bookLibraryCategoryCardBg relative mx-auto h-50.5 w-full max-w-75.5
                  animate-pulse overflow-hidden rounded-2xl"
              />
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-center text-sm text-red-800"
            role="alert"
          >
            <p className="mb-4 font-semibold whitespace-pre-line">
              {extractApiErrorMessage(error, bl?.loadFailed ?? "")}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="scoundBgColor rounded-lg px-4 py-2 text-white"
            >
              {bl?.retry ?? "Try again"}
            </button>
          </div>
        ) : null}

        {!isLoading && !isError && categories.length === 0 ? (
          <p className="py-16 text-center text-sm descriptionColor">
            {bl?.emptyCategories}
          </p>
        ) : null}

        {!isLoading && !isError && categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${lang}/book-library/${category.id}`}
                className="group block"
                aria-label={category.name}
              >
                <article
                  className="bookLibraryCategoryCardBg relative flex h-50.5 w-full max-w-75.5
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
                        width={80}
                        height={80}
                      />
                    </div>

                    <h2 className="text-base font-bold mt-2 text-[#1a1a1a] sm:text-lg">
                      {category.name}
                    </h2>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookLibiraryCategories;
