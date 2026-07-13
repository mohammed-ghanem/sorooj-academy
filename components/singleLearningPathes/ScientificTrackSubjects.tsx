"use client";

import { useMemo, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SingleTermDetailSkeleton, {
  SingleTermHeroTitleSkeleton,
} from "@/components/skeletons/SingleTermDetailSkeleton";
import { useGetScientificSubjectsByCategoryQuery, useGetScientificTrackCategoriesQuery } from "@/store/scientificTracks/scientificTracksApi";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import { hasAccessToken } from "@/lib/auth/studentGate";
import {
  extractApiErrorMessage,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { cn } from "@/lib/utils";
import lessons from "@/public/assets/images/lessons.svg";
import card from "@/public/assets/images/card.jpg";

function getSubjectActionLabel(
  progressPercent: number,
  labels: {
    startStudy?: string;
    continueStudy?: string;
    reviewStudy?: string;
  },
): string {
  if (progressPercent >= 100) {
    return labels.reviewStudy ?? labels.startStudy ?? "";
  }
  if (progressPercent > 0) {
    return labels.continueStudy ?? labels.startStudy ?? "";
  }
  return labels.startStudy ?? "";
}

function handleSubjectCardKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  onActivate: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
}

const ScientificTrackSubjects = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.singleLearningPaths;
  const termT = translate?.pages?.studyTermDetail;
  const router = useRouter();
  const lang = LangUseParams() ?? "ar";
  const dir = lang === "en" ? "ltr" : "rtl";

  const { categoryId } = useParams<{ categoryId: string }>();
  const listHref = `/${lang}/single-learning-pathes`;
  const loginHref = `/${lang}/login`;

  const idNum = useMemo(
    () =>
      categoryId && !Number.isNaN(Number(categoryId))
        ? Number(categoryId)
        : NaN,
    [categoryId],
  );

  const apiReady = useStudentApiReady();
  const invalidId = !categoryId || Number.isNaN(idNum);
  const skipQuery = invalidId || !apiReady;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetScientificSubjectsByCategoryQuery(
    { categoryId: categoryId ?? "", lang },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const { data: categories = [] } = useGetScientificTrackCategoriesQuery(
    { lang },
    { skip: skipQuery },
  );

  const showSkeleton =
    !invalidId && (!apiReady || isLoading || (isFetching && !data));

  const isUnauthenticated =
    !invalidId &&
    !showSkeleton &&
    isError &&
    readRtkQueryHttpStatus(error) === 401;

  const showError =
    !invalidId &&
    !showSkeleton &&
    !isUnauthenticated &&
    (isError || !data);

  const subjects = data?.subjects ?? [];
  const categoryFromList = categories.find((c) => c.id === idNum);
  const categoryName =
    data?.categoryName || categoryFromList?.name || "";

  const handleSubjectActivate = (subjectId: number) => {
    if (!hasAccessToken()) {
      router.push(loginHref);
      return;
    }
    router.push(
      `/${lang}/single-learning-pathes/${categoryId}/subject/${subjectId}`,
    );
  };

  if (invalidId) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-lg font-medium mainColor">{t?.notFound}</p>
        <Link href={listHref} className="text-sm scoundColor hover:underline">
          {t?.back}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SmallHeroSection
        title={
          <div className="w-full max-w-3xl text-center">
            <Link
              href={listHref}
              className="mb-2 inline-block text-sm scoundColor hover:underline"
            >
              ← {t?.back}
            </Link>
            {showSkeleton || !data ? (
              <SingleTermHeroTitleSkeleton />
            ) : (
              <h1 className="mt-2 mb-4 text-2xl font-semibold">
                <span className="scoundColor">
                  {categoryName || t?.untitledCategory}
                </span>
              </h1>
            )}
          </div>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-24" dir={dir}>
        {showSkeleton && <SingleTermDetailSkeleton />}

        {!showSkeleton && isUnauthenticated && (
          <div className="container mx-auto mt-10 w-[80%]">
            <div className="rounded-xl border border-[#efe7d8] bg-white p-8 text-center shadow-r-sm">
              <h2 className="mb-2 text-lg font-semibold mainColor">
                {t?.gateLoginTitle}
              </h2>
              <p className="mb-6 text-sm descriptionColor">
                {t?.gateLoginDescription}
              </p>
              <Link
                href={loginHref}
                className="inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white scoundBgColor"
              >
                {t?.gateLoginAction}
              </Link>
            </div>
          </div>
        )}

        {showError && (
          <div className="container mx-auto flex min-h-[40vh] w-[80%] flex-col items-center justify-center py-16 text-center">
            <p className="mb-4 text-lg font-medium mainColor">
              {extractApiErrorMessage(error, t?.notFound ?? "")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg px-4 py-2 text-sm text-white scoundBgColor"
              >
                {t?.retry}
              </button>
              <Link
                href={listHref}
                className="self-center text-sm scoundColor hover:underline"
              >
                {t?.back}
              </Link>
            </div>
          </div>
        )}

        {!showSkeleton && !showError && !isUnauthenticated && data && (
          <div className="container mx-auto w-[80%] py-4 md:py-20">
            {subjects.length === 0 ? (
              <p className="text-center text-sm text-gray-600">
                {t?.emptySubjects}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {subjects.map((subject) => {
                  const progressPercent = subject.lessonsProgress.percentage;

                  return (
                    <div
                      key={subject.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSubjectActivate(subject.id)}
                      onKeyDown={(event) =>
                        handleSubjectCardKeyDown(event, () =>
                          handleSubjectActivate(subject.id),
                        )
                      }
                      className="cursor-pointer overflow-hidden rounded-xl bg-white pb-4 text-center shadow-r-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F854E]/40 sm:rounded-2xl sm:text-right"
                      aria-label={subject.title}
                    >
                      <div className="relative mb-4 h-40 w-full">
                        <Image
                          src={subject.cover || card.src}
                          fill
                          alt={subject.title}
                          className="rounded-3xl object-cover p-2.5"
                          unoptimized={Boolean(subject.cover)}
                        />
                      </div>

                      <div className="mx-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-md font-semibold mainColor">
                            {subject.title}
                          </h2>
                        </div>

                        {subject.description ? (
                          <p className="mb-2 text-sm leading-relaxed text-gray-600">
                            {subject.description}
                          </p>
                        ) : null}

                        <div className="mb-1 flex flex-wrap justify-center gap-1 sm:justify-start">
                          <div className="flex items-center">
                            <Image
                              src={lessons.src}
                              width={20}
                              height={20}
                              alt=""
                            />
                            <p className="ms-2 me-2 descriptionColor">
                              <span className="me-0.5">
                                {subject.lessonsCount}
                              </span>
                              <span>{termT?.lessonUnit ?? t?.lessonUnit}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold mainColor">
                            {termT?.progress ?? t?.progress}
                          </p>
                          <p className="text-xs text-gray-500">
                            {progressPercent}%
                          </p>
                        </div>

                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full scoundBgColor transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        <hr className="my-2" />

                        <div className="mt-4 text-end">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white bkMainColor",
                            )}
                          >
                            {getSubjectActionLabel(progressPercent, {
                              startStudy: termT?.startStudy ?? t?.startStudy,
                              continueStudy:
                                termT?.continueStudy ?? t?.continueStudy,
                              reviewStudy: termT?.reviewStudy ?? t?.reviewStudy,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScientificTrackSubjects;
