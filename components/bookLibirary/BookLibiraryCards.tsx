"use client";

import Image from "next/image";
import Link from "next/link";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import {
  getBooksByCategory,
  getCategoryById,
  LIBRARY_CATEGORIES,
  localizedBookField,
  localizedCategory,
} from "@/lib/bookLibrary/mockData";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { ArrowUpLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BookLibiraryCardsProps = {
  categoryId: string;
};

const BookLibiraryCards = ({ categoryId }: BookLibiraryCardsProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const bl = translate?.pages?.bookLibrary;
  const locale = lang === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const activeCategory = getCategoryById(categoryId);
  const books = getBooksByCategory(categoryId);
  const isAll = categoryId === "all";

  if (!translate) {
    return (
      <div className="min-h-[50vh] animate-pulse bg-gray-100/50" aria-hidden />
    );
  }

  if (!isAll && !activeCategory) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-lg mainColor font-medium mb-4">{bl?.notFound}</p>
        <Link
          href={`/${lang}/book-library`}
          className="text-sm scoundColor hover:underline"
        >
          {bl?.backToCategories}
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "all", label: bl?.allBooks ?? "" },
    ...LIBRARY_CATEGORIES.map((c) => ({
      id: c.id,
      label: localizedCategory(c, locale),
    })),
  ];

  return (
    <div className="bg-white">
      <SmallHeroSection
        title={
          <h1 className="mb-4 mt-28 text-2xl font-semibold md:text-3xl">
            <span className="mainColor">{bl?.title}</span>
            <span className="scoundColor">{bl?.titleSpan}</span>
          </h1>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-6 pb-16 md:pb-24" dir={dir}>
        <div className="container mx-auto w-[92%] max-w-7xl">
          <nav
            className="mb-8 flex gap-6 overflow-x-auto border-b border-gray-200/80
              [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              bg-white p-4 rounded-lg shadow-sm"
            aria-label={bl?.allBooks}
          >
            {tabs.map((tab) => {
              const active = tab.id === categoryId;
              return (
                <Link
                  key={tab.id}
                  href={`/${lang}/book-library/${tab.id}`}
                  className={cn(
                    "shrink-0 pb-3 font-medium transition-colors whitespace-nowrap text-base",
                    active
                      ? "scoundColor border-b-2 border-[#9F854E]"
                      : "descriptionColor hover:mainColor",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {books.length === 0 ? (
            <p className="py-16 text-center text-sm descriptionColor">
              {bl?.emptyBooks}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {books.map((book) => {
               
                const detailHref = `/${lang}/book-library/${book.categoryId}/${book.id}`;

                return (
                  <article
                    key={book.id}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white
                      shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Link href={detailHref} className="block">
                      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#efece7] h-[300px]">
                        <Image
                          src={book.coverSrc}
                          alt={localizedBookField(
                            book,
                            locale,
                            "titleAr",
                            "titleEn",
                          )}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    </Link>

                    <div className="flex flex-1 items-start justify-between gap-3 p-4">
                      <div className="min-w-0 flex-1 text-start">
                        <Link href={detailHref}>
                          <h3
                            className="text-sm font-bold leading-snug mainColor line-clamp-2
                            group-hover:scoundColor transition-colors"
                          >
                            {localizedBookField(
                              book,
                              locale,
                              "titleAr",
                              "titleEn",
                            )}
                          </h3>
                        </Link>
                        <p className="mt-2 text-xs descriptionColor line-clamp-2">
                          {localizedBookField(
                            book,
                            locale,
                            "authorAr",
                            "authorEn",
                          )}
                        </p>
                      </div>

                      <Link
                        href={detailHref}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                          border border-[#9F854E] bg-white mainColor transition-colors
                          "
                        aria-label={bl?.viewBook}
                      >
                        <ArrowUpLeft className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookLibiraryCards;
