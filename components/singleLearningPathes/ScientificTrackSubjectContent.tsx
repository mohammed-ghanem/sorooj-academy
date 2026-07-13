"use client";

import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SubjectContentSkeleton, {
  SubjectContentHeroTitleSkeleton,
} from "@/components/skeletons/SubjectContentSkeleton";
import InfoModal from "@/components/modals/InfoModal";
import { useGetScientificSubjectDetailQuery } from "@/store/scientificTracks/scientificTracksApi";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import { hasAccessToken } from "@/lib/auth/studentGate";
import {
  extractApiErrorMessage,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";
import type { ScientificTrackLesson } from "@/types/scientificTrack";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { cn } from "@/lib/utils";
import card from "@/public/assets/images/card.jpg";
import exams from "@/public/assets/images/exam.svg";
import level from "@/public/assets/images/level.svg";
import lessonsIcon from "@/public/assets/images/lessons.svg";

const LESSON_CARD_SUMMARY_MAX_LENGTH = 45;

function formatLessonLabel(template: string | undefined, index: number) {
  return (template ?? "Lesson {{n}}").replace("{{n}}", String(index + 1));
}

function truncateWithEllipsis(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()} ...`;
}

function isLessonAccessible(lesson: ScientificTrackLesson): boolean {
  return lesson.canAccessLesson && !lesson.isLocked;
}

function isLessonFullyCompleted(lesson: ScientificTrackLesson): boolean {
  return (
    lesson.isCompleted ||
    (lesson.allVideosCompleted && lesson.studentHasPassedLessonExam)
  );
}

function hasLessonProgress(lesson: ScientificTrackLesson): boolean {
  return (
    lesson.videosProgress.percentage > 0 || lesson.videosProgress.completed > 0
  );
}

function getLessonActionLabel(
  lesson: ScientificTrackLesson,
  labels: {
    startStudy?: string;
    continueStudy?: string;
    viewLesson?: string;
  },
): string {
  if (isLessonFullyCompleted(lesson)) {
    return labels.viewLesson ?? labels.startStudy ?? "";
  }
  if (hasLessonProgress(lesson)) {
    return labels.continueStudy ?? labels.startStudy ?? "";
  }
  return labels.startStudy ?? "";
}

function handleLessonCardKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  onActivate: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
}

const ScientificTrackSubjectContent = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.singleLearningPaths;
  const subjectT = translate?.pages?.subjectDetail;
  const router = useRouter();
  const lang = LangUseParams() ?? "ar";
  const dir = lang === "en" ? "ltr" : "rtl";

  const { categoryId, subjectId } = useParams<{
    categoryId: string;
    subjectId: string;
  }>();

  const listHref = `/${lang}/single-learning-pathes`;
  const categoryHref = `/${lang}/single-learning-pathes/${categoryId}`;
  const loginHref = `/${lang}/login`;

  const idNum = useMemo(
    () =>
      subjectId && !Number.isNaN(Number(subjectId)) ? Number(subjectId) : NaN,
    [subjectId],
  );

  const apiReady = useStudentApiReady();
  const invalidId = !subjectId || Number.isNaN(idNum);
  const skipQuery = invalidId || !apiReady;

  const {
    data: subject,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetScientificSubjectDetailQuery(
    { subjectId: subjectId ?? "", lang },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const [lessonLockedOpen, setLessonLockedOpen] = useState(false);

  const showSkeleton =
    !invalidId && (!apiReady || isLoading || (isFetching && !subject));

  const isUnauthenticated =
    !invalidId &&
    !showSkeleton &&
    isError &&
    readRtkQueryHttpStatus(error) === 401;

  const showError =
    !invalidId &&
    !showSkeleton &&
    !isUnauthenticated &&
    (isError || !subject);

  const subjectLessons = subject?.lessons ?? [];
  const progressPercent =
    subject?.lessonsProgress.percentage ?? subject?.progress ?? 0;

  const handleLessonStart = useCallback(
    (lesson: ScientificTrackLesson) => {
      if (!hasAccessToken()) {
        router.push(loginHref);
        return;
      }

      if (!isLessonAccessible(lesson)) {
        setLessonLockedOpen(true);
        return;
      }

      router.push(
        `/${lang}/single-learning-pathes/${categoryId}/subject/${subjectId}/lesson/${lesson.id}`,
      );
    },
    [categoryId, lang, loginHref, router, subjectId],
  );

  if (invalidId) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-lg font-medium mainColor">
          {t?.subjectNotFound ?? subjectT?.notFound}
        </p>
        <Link
          href={categoryHref}
          className="text-sm scoundColor hover:underline"
        >
          {t?.backToSubjects ?? t?.back}
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
              href={categoryHref}
              className="mb-2 inline-block text-sm scoundColor hover:underline"
            >
              ← {t?.backToSubjects ?? t?.back}
            </Link>
            {showSkeleton || !subject ? (
              <SubjectContentHeroTitleSkeleton />
            ) : (
              <h1 className="mt-2 mb-4 text-2xl font-semibold">
                <span className="mainColor">
                  {subjectT?.heroLabel ?? t?.subjectHeroLabel}{" "}
                </span>
                <span className="scoundColor">{subject.title}</span>
              </h1>
            )}
          </div>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-24" dir={dir}>
        {showSkeleton && <SubjectContentSkeleton />}

        {!showSkeleton && isUnauthenticated && (
          <div className="container mx-auto mt-10 w-[90%]">
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
          <div className="container mx-auto flex min-h-[40vh] w-[90%] flex-col items-center justify-center py-16 text-center">
            <p className="mb-4 text-lg font-medium mainColor">
              {extractApiErrorMessage(
                error,
                t?.subjectNotFound ?? subjectT?.notFound ?? "",
              )}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg px-4 py-2 text-sm text-white scoundBgColor"
              >
                {t?.retry ?? subjectT?.retry}
              </button>
              <Link
                href={categoryHref}
                className="self-center text-sm scoundColor hover:underline"
              >
                {t?.backToSubjects ?? t?.back}
              </Link>
              <Link
                href={listHref}
                className="self-center text-sm scoundColor hover:underline"
              >
                {t?.back}
              </Link>
            </div>
          </div>
        )}

        {!showSkeleton && !showError && !isUnauthenticated && subject && (
          <div className="container mx-auto grid w-[90%] grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl bg-white p-4 shadow-r-sm md:p-6 lg:col-span-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mainColor">
                  {subject.title}
                </h3>
                {subject.description ? (
                  <p className="my-4 w-[80%] text-sm text-gray-500">
                    {subject.description}
                  </p>
                ) : null}
              </div>

              {subjectLessons.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-600">
                  {subjectT?.emptyLessons ?? t?.emptyLessons}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {subjectLessons.map((lesson, index) => {
                    const completed = isLessonFullyCompleted(lesson);
                    const lessonSummary =
                      lesson.title ||
                      lesson.briefContent ||
                      subjectT?.untitled ||
                      "";
                    const lessonSummaryDisplay = truncateWithEllipsis(
                      lessonSummary,
                      LESSON_CARD_SUMMARY_MAX_LENGTH,
                    );
                    const statusLabel = completed
                      ? subjectT?.completed
                      : subjectT?.notCompleted;
                    const actionLabel = getLessonActionLabel(lesson, {
                      startStudy: subjectT?.startStudy,
                      continueStudy: subjectT?.continueStudy,
                      viewLesson: subjectT?.viewLesson,
                    });

                    return (
                      <div
                        key={lesson.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${lesson.lessonNumber || formatLessonLabel(subjectT?.lessonNumber, index)} — ${actionLabel}`}
                        onClick={() => handleLessonStart(lesson)}
                        onKeyDown={(event) =>
                          handleLessonCardKeyDown(event, () =>
                            handleLessonStart(lesson),
                          )
                        }
                        className={cn(
                          "cursor-pointer rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f854e]/40",
                          completed
                            ? "border-emerald-100 bg-emerald-50/80"
                            : "border-gray-100 bg-[#fafafa]",
                        )}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="relative">
                            <span
                              className={cn(
                                "rounded-md px-3 py-2 text-xl font-semibold",
                                completed
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "scoundColor bg-[#efece7]",
                              )}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="pointer-events-none absolute right-0 bottom-0">
                              <Image
                                src="/assets/images/lineCard.svg"
                                alt=""
                                width={100}
                                height={100}
                                className="h-full w-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-500">
                              {lesson.lessonNumber ||
                                formatLessonLabel(
                                  subjectT?.lessonNumber,
                                  index,
                                )}
                            </h4>
                            <span
                              className={cn(
                                "rounded-3xl px-3 py-1.5 text-[10px]",
                                completed
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "scoundColor bg-[#efece7]",
                              )}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          <h5
                            className="mb-3 text-xs text-gray-500"
                            title={
                              lessonSummary.length >
                              LESSON_CARD_SUMMARY_MAX_LENGTH
                                ? lessonSummary
                                : undefined
                            }
                          >
                            {lessonSummaryDisplay}
                          </h5>
                        </div>
                        <hr className="my-3" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border-b border-[#9f854e] pb-2">
                            <span className="rounded-md text-xs font-semibold scoundColor">
                              {actionLabel}
                            </span>
                            <span>
                              <Image
                                src="/assets/images/arrow-left.svg"
                                width={20}
                                height={20}
                                alt=""
                              />
                            </span>
                          </div>
                          <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
                            <div className="flex items-center">
                              <Image
                                src="/assets/images/video-circle.svg"
                                width={16}
                                height={16}
                                alt=""
                              />
                              <p className="mx-1 descriptionColor">
                                <span className="me-0.5">
                                  {lesson.videosCount}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Image
                                src="/assets/images/doc.svg"
                                width={16}
                                height={16}
                                alt=""
                              />
                              <p className="mx-1 descriptionColor">
                                <span className="me-0.5">
                                  {lesson.attachmentsCount}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mx-auto h-fit w-[95%] rounded-2xl bg-white p-4 shadow-r-sm lg:col-span-4">
              <div className="relative mb-4 h-56 w-full">
                <Image
                  src={subject.cover || card.src}
                  alt={subject.title}
                  fill
                  className="rounded-xl object-cover"
                  unoptimized={Boolean(subject.cover)}
                />
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold mainColor">
                  {subjectT?.detailsTitle ?? t?.detailsTitle}
                </h2>
                <hr className="my-2" />
              </div>

              <h3 className="mb-2 text-lg font-semibold mainColor">
                {subject.title}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={lessonsIcon.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">
                      {subjectT?.lessonsCount}
                    </span>
                  </div>
                  <span className="font-semibold mainColor">
                    {subject.lessonsCount}
                  </span>
                </div>
                <div className="my-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={exams.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">
                      {subjectT?.examsCount}
                    </span>
                  </div>
                  <span className="font-semibold mainColor">
                    {subject.lessonExamsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={level.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">
                      {subjectT?.progress ?? t?.progress}
                    </span>
                  </div>
                  <span className="font-semibold mainColor">
                    <span className="me-0.5">{progressPercent}%</span>
                  </span>
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full scoundBgColor transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <InfoModal
          open={lessonLockedOpen}
          onOpenChange={setLessonLockedOpen}
          variant="info"
          title={subjectT?.lessonLockedTitle ?? ""}
          description={subjectT?.lessonLockedMessage}
          primaryLabel={subjectT?.close ?? t?.gateClose ?? ""}
          onPrimaryClick={() => setLessonLockedOpen(false)}
          dir={dir}
        />
      </div>
    </div>
  );
};

export default ScientificTrackSubjectContent;
