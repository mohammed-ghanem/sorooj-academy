"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import {
  useGetBookCategoriesQuery,
  useGetBooksQuery,
} from "@/store/bookLibrary/bookLibraryApi";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { ArrowUpLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const DefaultBookCover = "/assets/images/holyQ.jpg";

type BookLibiraryCardsProps = {
  categoryId: string;
};

const BookLibiraryCards = ({ categoryId }: BookLibiraryCardsProps) => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const bl = translate?.pages?.bookLibrary;
  const locale = lang === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isUninitialized: categoriesUninitialized,
    isError: categoriesError,
  } = useGetBookCategoriesQuery({ lang: locale });

  const {
    data: allBooks = [],
    isLoading: booksLoading,
    isFetching: booksFetching,
    isUninitialized: booksUninitialized,
    isError: booksError,
    error: booksErrorPayload,
    refetch: refetchBooks,
  } = useGetBooksQuery({ lang: locale });

  const isAll = categoryId === "all";
  const activeCategory = categories.find(
    (item) => String(item.id) === String(categoryId),
  );

  const books = useMemo(() => {
    if (isAll) return allBooks;
    return allBooks.filter(
      (book) => String(book.categoryId) === String(categoryId),
    );
  }, [allBooks, categoryId, isAll]);

  const showSkeleton =
    !translate ||
    categoriesUninitialized ||
    booksUninitialized ||
    categoriesLoading ||
    booksLoading ||
    (booksFetching && allBooks.length === 0);

  const hero = (
    <SmallHeroSection
      title={
        <h1 className="mb-4 mt-28 text-2xl font-semibold md:text-3xl">
          <span className="mainColor">{bl?.title}</span>
          <span className="scoundColor">{bl?.titleSpan}</span>
        </h1>
      }
    />
  );

  if (showSkeleton) {
    return (
      <div className="min-h-screen bg-white">
        {hero}
        <div className="bg-[#F6F6F6] px-2 pt-6 pb-16 md:pb-24">
          <div className="container mx-auto w-[92%] max-w-7xl">
            <div className="mb-8 h-14 animate-pulse rounded-lg bg-white shadow-sm" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`book-card-skeleton-${i}`}
                  className="h-[380px] animate-pulse rounded-xl bg-[#efece7]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (booksError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-lg font-medium mainColor">
          {extractApiErrorMessage(booksErrorPayload, bl?.loadFailed ?? "")}
        </p>
        <button
          type="button"
          onClick={() => refetchBooks()}
          className="scoundBgColor rounded-lg px-4 py-2 text-sm text-white"
        >
          {bl?.retry ?? "Try again"}
        </button>
      </div>
    );
  }

  if (!categoriesError && !isAll && !activeCategory) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-lg font-medium mainColor">{bl?.notFound}</p>
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
    ...categories.map((c) => ({
      id: String(c.id),
      label: c.name,
    })),
  ];

  return (
    <div className="min-h-screen bg-white">
      {hero}

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
                const sectionId = book.categoryId ?? categoryId;
                const detailHref = `/${lang}/book-library/${sectionId}/${book.id}`;
                const coverSrc = book.image || DefaultBookCover;

                return (
                  <article
                    key={book.id}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white
                      shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Link href={detailHref} className="block">
                      <div className="relative aspect-3/4 h-[300px] w-full overflow-hidden bg-[#efece7]">
                        <Image
                          src={coverSrc}
                          alt={book.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized={Boolean(book.image)}
                        />
                      </div>
                    </Link>

                    <div className="flex flex-1 items-start justify-between gap-3 p-4">
                      <div className="min-w-0 flex-1 text-start">
                        <Link href={detailHref}>
                          <h3
                            className="line-clamp-2 text-sm font-bold leading-snug mainColor
                            transition-colors group-hover:scoundColor"
                          >
                            {book.title}
                          </h3>
                        </Link>
                        {book.authorName ? (
                          <p className="mt-2 line-clamp-2 text-xs descriptionColor">
                            {book.authorName}
                          </p>
                        ) : null}
                      </div>

                      <Link
                        href={detailHref}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                          border border-[#9F854E] bg-white mainColor transition-colors"
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
