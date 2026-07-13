"use client";

import { type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection";
import SingleLearningPathsCardsSkeleton from "@/components/skeletons/SingleLearningPathsCardsSkeleton";
import { useGetScientificTrackCategoriesQuery } from "@/store/scientificTracks/scientificTracksApi";
import { hasAccessToken } from "@/lib/auth/studentGate";
import {
  extractApiErrorMessage,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { cn } from "@/lib/utils";
import book from "@/public/assets/images/book.svg";

function handleCardKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  onActivate: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
}

const SingleLearningPathes = () => {
  const translate = TranslateHook();
  const router = useRouter();
  const lang = LangUseParams() ?? "ar";
  const t = translate?.pages?.singleLearningPaths;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const loginHref = `/${lang}/login`;

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetScientificTrackCategoriesQuery({ lang });

  const isUnauthenticated = isError && readRtkQueryHttpStatus(error) === 401;

  const handlePathActivate = (href: string) => {
    if (!hasAccessToken()) {
      router.push(loginHref);
      return;
    }
    router.push(href);
  };

  return (
    <div>
      <SmallHeroSection
        title={
          <h1 className="mb-4 mt-28 text-2xl font-semibold">
            <span className="mainColor">{t?.title}</span>
            <span className="scoundColor">{t?.titleSpan}</span>
          </h1>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-70">
        <div className="container mx-auto mt-20 w-[90%]" dir={dir}>
          {isLoading && <SingleLearningPathsCardsSkeleton dir={dir} />}

          {!isLoading && isUnauthenticated && (
            <div className="rounded-xl border border-[#efe7d8] bg-white p-8 text-center shadow-r-sm">
              <h2 className="mb-2 text-lg font-semibold mainColor">
                {t?.gateLoginTitle}
              </h2>
              <p className="mb-6 text-sm descriptionColor">
                {t?.gateLoginDescription}
              </p>
              <Link
                href={loginHref}
                className="inline-block scoundBgColor rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              >
                {t?.gateLoginAction}
              </Link>
            </div>
          )}

          {!isLoading && isError && !isUnauthenticated && (
            <div
              className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-center text-sm text-red-800"
              role="alert"
            >
              <p className="mb-4 font-semibold whitespace-pre-line">
                {extractApiErrorMessage(error, t?.loadFailed ?? "")}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="scoundBgColor rounded-lg px-4 py-2 text-white"
              >
                {t?.retry ?? "Try again"}
              </button>
            </div>
          )}

          {!isLoading && !isError && categories.length === 0 && (
            <p className="text-center text-sm text-gray-600">{t?.emptyList}</p>
          )}

          {!isLoading && !isError && categories.length > 0 && (
            <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-4 lg:gap-y-8">
              {categories.map((item) => {
                const href = `/${lang}/single-learning-pathes/${item.id}`;

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePathActivate(href)}
                    onKeyDown={(event) =>
                      handleCardKeyDown(event, () => handlePathActivate(href))
                    }
                    className={cn(
                      "group relative block cursor-pointer rounded-xl bg-white p-4 shadow-r-sm transition-all duration-300 ease-in-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f854e]/40 sm:rounded-2xl sm:p-5 lg:p-6",
                    )}
                    aria-label={item.name}
                  >
                    <span className="absolute top-0 left-0 rounded-br-xl bg-[#F6F6F6] px-6 py-4 text-3xl font-bold text-[#c6a96aad]">
                      {String(item.id).padStart(2, "0")}
                    </span>

                    <div className="mb-8 min-h-16 pe-20 md:mb-4">
                      <h2 className="text-lg font-semibold mainColor md:text-xl">
                        {item.name}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center">
                        <Image src={book.src} width={18} height={18} alt="" />
                        <p className="ms-2 me-2 descriptionColor">
                          <span className="me-0.5">{item.subjectsCount}</span>
                          <span>{t?.subjectsCount}</span>
                        </p>
                      </div>
                    </div>

                    {item.aboutCategory ? (
                      <p className="mt-2 text-xs leading-relaxed descriptionColor">
                        {item.aboutCategory}
                      </p>
                    ) : null}

                    <span className="mt-4 block text-sm font-medium scoundColor group-hover:underline">
                      {t?.cardLink}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleLearningPathes;
