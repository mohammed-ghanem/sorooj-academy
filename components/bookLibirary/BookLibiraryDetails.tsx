"use client";

import Image from "next/image";
import Link from "next/link";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import { useGetBookDetailQuery } from "@/store/bookLibrary/bookLibraryApi";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

const DefaultBookCover = "/assets/images/holyQ.jpg";

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
  const booksHref = `/${lang}/book-library/${categoryId}`;

  const idNum =
    bookId && !Number.isNaN(Number(bookId)) ? Number(bookId) : NaN;
  const skip = Number.isNaN(idNum);

  const {
    data: book,
    isLoading,
    isFetching,
    isUninitialized,
    isError,
    error,
    refetch,
  } = useGetBookDetailQuery(
    { bookId, lang: locale },
    { skip, refetchOnMountOrArgChange: true },
  );

  const showSkeleton =
    !translate ||
    skip ||
    isUninitialized ||
    isLoading ||
    (isFetching && !book);

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
          <div className="container mx-auto w-[92%] max-w-5xl">
            <div className="mb-6 h-4 w-28 animate-pulse rounded bg-[#9F854E]/15" />
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-8 lg:p-10">
                <div className="mx-auto h-75 w-full max-w-xs animate-pulse rounded-xl bg-[#efece7] md:mx-0 md:max-w-none" />
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-[#9F854E]/15" />
                  <div className="h-7 w-3/4 animate-pulse rounded bg-[#9F854E]/15" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#9F854E]/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-lg font-medium mainColor">
          {extractApiErrorMessage(error, bl?.notFound ?? "")}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => refetch()}
            className="scoundBgColor rounded-lg px-4 py-2 text-sm text-white"
          >
            {bl?.retry ?? "Try again"}
          </button>
          <Link
            href={booksHref}
            className="self-center text-sm scoundColor hover:underline"
          >
            {bl?.backToBooks}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {hero}

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
              <div
                className="relative mx-auto aspect-3/4 h-75 w-full max-w-xs overflow-hidden
              rounded-xl bg-[#efece7] md:mx-0 md:max-w-none"
              >
                <Image
                  src={book.image || DefaultBookCover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 320px, 400px"
                  priority
                  unoptimized={Boolean(book.image)}
                />
              </div>

              <div className="flex flex-col">
                {book.categoryName ? (
                  <p className="mb-2 text-sm descriptionColor">
                    {book.categoryName}
                  </p>
                ) : null}
                <h2 className="text-xl font-bold leading-snug mainColor md:text-2xl">
                  {book.title}
                </h2>
                {book.authorName ? (
                  <p className="mt-3 text-sm descriptionColor md:text-base">
                    {book.authorName}
                  </p>
                ) : null}

                <h3 className="mt-8 mb-4 text-base font-semibold mainColor">
                  {bl?.chaptersTitle}
                </h3>

                <ul className="divide-y divide-gray-100">
                  {book.attachments.map((attachment) => (
                    <li key={attachment.id}>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex w-full items-center justify-between gap-4 py-4 text-start
                          transition-colors hover:bg-gray-50/80"
                        aria-label={`${bl?.downloadChapter}: ${attachment.name}`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs descriptionColor">
                            {attachment.fileName}
                          </span>
                          <span className="mt-0.5 block text-sm font-semibold mainColor">
                            {attachment.name}
                          </span>
                        </span>
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                            border border-gray-200 text-[#9F854E]"
                        >
                          <Download className="h-4 w-4" aria-hidden />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-8 md:px-10 md:py-10">
              <h3 className="mb-4 text-base font-semibold mainColor">
                {bl?.descriptionTitle}
              </h3>
              {book.content.trim() ? (
                <div
                  className={cn(
                    "text-sm leading-relaxed descriptionColor md:text-base",
                    "[&_p]:mb-3 [&_p:last-child]:mb-0",
                  )}
                  dangerouslySetInnerHTML={{ __html: book.content }}
                />
              ) : (
                <p className="text-sm leading-relaxed descriptionColor whitespace-pre-line md:text-base">
                  {bl?.emptyBooks}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLibiraryDetails;
