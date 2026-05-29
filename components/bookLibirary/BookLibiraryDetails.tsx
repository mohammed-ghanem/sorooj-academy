"use client";

import Image from "next/image";
import Link from "next/link";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import {
  getBookById,
  getCategoryById,
  localizedBookField,
  localizedCategory,
  localizedChapterField,
} from "@/lib/bookLibrary/mockData";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { Download } from "lucide-react";

type BookLibiraryDetailsProps = {
  categoryId: string;
  bookId: string;
};

const BookLibiraryDetails = ({
  categoryId,
  bookId, 
}: BookLibiraryDetailsProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const bl = translate?.pages?.bookLibrary;
  const locale = lang === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const book = getBookById(bookId);
  const category = book ? getCategoryById(book.categoryId) : undefined;
  const booksHref = `/${lang}/book-library/${categoryId}`;

  if (!translate) {
    return (
      <div className="min-h-[50vh] animate-pulse bg-gray-100/50" aria-hidden />
    );
  }

  if (!book || book.categoryId !== categoryId) {
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
        <div className="container mx-auto w-[92%] max-w-5xl">
          <Link
            href={booksHref}
            className="mb-6 inline-block text-sm scoundColor hover:underline"
          >
            {bl?.backToBooks}
          </Link>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-8 lg:p-10">
              <div className="relative mx-auto aspect-3/4 w-full max-w-xs overflow-hidden 
              rounded-xl bg-[#efece7] h-[300px] md:max-w-none md:mx-0">
                <Image
                  src={book.coverSrc}
                  alt={localizedBookField(book, locale, "titleAr", "titleEn")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 320px, 400px"
                  priority
                />
              </div>

              <div className="flex flex-col">
                {category ? (
                  <p className="mb-2 text-sm descriptionColor">
                    {localizedCategory(category, locale)}
                  </p>
                ) : null}
                <h2 className="text-xl font-bold leading-snug mainColor md:text-2xl">
                  {localizedBookField(book, locale, "titleAr", "titleEn")}
                </h2>
                <p className="mt-3 text-sm descriptionColor md:text-base">
                  {localizedBookField(book, locale, "authorAr", "authorEn")}
                </p>

                <h3 className="mt-8 mb-4 text-base font-semibold mainColor">
                  {bl?.chaptersTitle}
                </h3>

                <ul className="divide-y divide-gray-100">
                  {book.chapters.map((chapter) => (
                    <li key={chapter.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 py-4 text-start
                          transition-colors hover:bg-gray-50/80"
                        onClick={() => {
                          /* placeholder until API provides download URLs */
                        }}
                        aria-label={`${bl?.downloadChapter}: ${localizedChapterField(chapter, locale, "title")}`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs descriptionColor">
                            {localizedChapterField(chapter, locale, "number")}
                          </span>
                          <span className="mt-0.5 block text-sm font-semibold mainColor">
                            {localizedChapterField(chapter, locale, "title")}
                          </span>
                        </span>
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                            border border-gray-200 text-[#9F854E]"
                        >
                          <Download className="h-4 w-4" aria-hidden />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-8 md:px-10 md:py-10">
              <h3 className="mb-4 text-base font-semibold mainColor">
                {bl?.descriptionTitle}
              </h3>
              <p className="text-sm leading-relaxed descriptionColor whitespace-pre-line md:text-base">
                {localizedBookField(
                  book,
                  locale,
                  "descriptionAr",
                  "descriptionEn",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLibiraryDetails;
