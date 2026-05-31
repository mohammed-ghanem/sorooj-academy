"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SubjectContentSkeleton, {
  SubjectContentHeroTitleSkeleton,
} from "@/components/skeletons/SubjectContentSkeleton";
import InfoModal from "@/components/modals/InfoModal";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import { useGetSubjectDetailQuery } from "@/store/subjects/subjectsApi";
import type { StudyLesson } from "@/types/studySubjectDetail";
import TranslateHook from "@/translate/TranslateHook";
import { cn } from "@/lib/utils";
import card from "@/public/assets/images/card.jpg";
import exams from "@/public/assets/images/exam.svg";
import subjectExam from "@/public/assets/images/subjectExam.svg";
import level from "@/public/assets/images/level.svg";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, type KeyboardEvent } from "react";

function formatLessonLabel(template: string | undefined, index: number) {
  return (template ?? "Lesson {{n}}").replace("{{n}}", String(index + 1));
}

function isLessonAccessible(lesson: StudyLesson): boolean {
  return lesson.canAccessLesson && !lesson.isLocked;
}

function isLessonFullyCompleted(lesson: StudyLesson): boolean {
  return (
    lesson.isCompleted ||
    (lesson.allVideosCompleted && lesson.studentHasPassedLessonExam)
  );
}

function hasLessonProgress(lesson: StudyLesson): boolean {
  return (
    lesson.videosProgress.percentage > 0 || lesson.videosProgress.completed > 0
  );
}

function getLessonActionLabel(
  lesson: StudyLesson,
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
  lesson: StudyLesson,
  onStart: (lesson: StudyLesson) => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onStart(lesson);
  }
}

const SubjectContent = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.subjectDetail;
  const router = useRouter();

  const { lang, termId, contentId } = useParams<{
    lang: string;
    termId: string;
    contentId: string;
  }>();

  const dir = lang === "en" ? "ltr" : "rtl";
  const [lessonLockedOpen, setLessonLockedOpen] = useState(false);

  const termHref = `/${lang}/study-terms/${termId}`;

  const idNum = useMemo(
    () =>
      contentId && !Number.isNaN(Number(contentId)) ? Number(contentId) : NaN,
    [contentId],
  );

  const apiReady = useStudentApiReady();
  const invalidId = !contentId || Number.isNaN(idNum);
  const skipQuery = invalidId || !apiReady;

  const {
    data: subject,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSubjectDetailQuery(
    { id: contentId ?? "", lang: lang ?? "ar" },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const showSkeleton =
    !invalidId && (!apiReady || isLoading || (isFetching && !subject));
  const showError = !invalidId && !showSkeleton && (isError || !subject);
  const subjectLessons = subject?.lessons ?? [];

  const handleLessonStart = (lesson: StudyLesson) => {
    if (!isLessonAccessible(lesson)) {
      setLessonLockedOpen(true);
      return;
    }

    router.push(
      `/${lang}/study-terms/${termId}/content/${contentId}/lesson/${lesson.id}`,
    );
  };

  if (invalidId) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-lg mainColor font-medium mb-4">{t?.notFound}</p>
        <Link href={termHref} className="text-sm scoundColor hover:underline">
          {t?.back}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SmallHeroSection
        title={
          <div className="text-center mt-20">
            <Link
              href={termHref}
              className="text-sm scoundColor hover:underline inline-block mb-2"
            >
              {t?.back}
            </Link>
            {showSkeleton ? (
              <SubjectContentHeroTitleSkeleton />
            ) : (
              <h1 className="text-2xl font-semibold mt-2 mb-4">
                <span className="mainColor">{t?.heroLabel} </span>
                <span className="scoundColor">{subject!.title}</span>
              </h1>
            )}
          </div>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-24">
        {showSkeleton && <SubjectContentSkeleton />}

        {showError && (
          <div className="container mx-auto flex min-h-[40vh] w-[90%] flex-col items-center justify-center py-16 text-center">
            <p className="text-lg mainColor font-medium mb-4">{t?.notFound}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => refetch()}
                className="scoundBgColor rounded-lg px-4 py-2 text-sm text-white"
              >
                {t?.retry}
              </button>
              <Link
                href={termHref}
                className="text-sm scoundColor hover:underline self-center"
              >
                {t?.back}
              </Link>
            </div>
          </div>
        )}

        {!showSkeleton && !showError && (
          <div className="container mx-auto w-[90%] grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-6 shadow-r-sm">
              <div className=" mb-4">
                <h3 className="text-lg font-semibold mainColor">
                  {subject!.title}
                </h3>
                {subject!.description ? (
                  <p className="text-sm text-gray-500 w-[80%] my-4">
                    {subject!.description}
                  </p>
                ) : null}
              </div>

              {subjectLessons.length === 0 ? (
                <p className="text-center text-sm text-gray-600 py-8">
                  {t?.emptyLessons}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {subjectLessons.map((lesson, index) => {
                    const completed = isLessonFullyCompleted(lesson);
                    const statusLabel = completed
                      ? t?.completed
                      : t?.notCompleted;
                    const actionLabel = getLessonActionLabel(lesson, {
                      startStudy: t?.startStudy,
                      continueStudy: t?.continueStudy,
                      viewLesson: t?.viewLesson,
                    });

                    return (
                      <div
                        key={lesson.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${lesson.lessonNumber || formatLessonLabel(t?.lessonNumber, index)} — ${actionLabel}`}
                        onClick={() => handleLessonStart(lesson)}
                        onKeyDown={(event) =>
                          handleLessonCardKeyDown(event, lesson, handleLessonStart)
                        }
                        className={cn(
                          "rounded-xl border p-4 shadow-sm transition-shadow cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f854e]/40",
                          completed
                            ? "border-emerald-100 bg-emerald-50/80"
                            : "border-gray-100 bg-[#fafafa]",
                        )}
                      >
                        <div className="flex items-center justify-between mb-2 ">
                          <div className="relative">
                            <span
                              className={cn(
                                "text-xl py-2 px-3 font-semibold rounded-md",
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
                          <div className="flex  justify-between items-center mb-2">
                            <h4 className="text-sm font-semibold text-gray-500">
                              {lesson.lessonNumber ||
                                formatLessonLabel(t?.lessonNumber, index)}
                            </h4>
                            <span
                              className={cn(
                                "text-[10px] px-3 py-1.5 rounded-3xl",
                                completed
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "scoundColor bg-[#efece7]",
                              )}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          <h5 className="text-xs text-gray-500 mb-3">
                            {lesson.title || lesson.briefContent || t?.untitled}
                          </h5>
                        </div>
                        <hr className="my-3" />
                        <div className="flex  justify-between items-center">
                          <div className="flex items-center border-b border-[#9f854e] pb-2">
                            <span className="text-xs font-semibold scoundColor rounded-md">
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
                          <div className="flex flex-wrap justify-center sm:justify-start gap-1">
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

            {/* subject details */}

            <div className="lg:col-span-4 w-[95%] mx-auto bg-white rounded-2xl p-4 shadow-r-sm h-fit">
              <div className="relative w-full h-56 mb-4">
                <Image
                  src={subject!.cover || card.src}
                  alt={subject!.title}
                  fill
                  className="rounded-xl object-cover"
                  unoptimized={Boolean(subject!.cover)}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold mainColor mb-2">
                  {t?.detailsTitle}
                </h2>
                <hr className="my-2" />
              </div>

              <h3 className="text-lg font-semibold mainColor mb-2">
                {subject!.title}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={lessons.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">{t?.lessonsCount}</span>
                  </div>
                  <span className="mainColor font-semibold">
                    {subject!.lessonsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between my-4">
                  <div className="flex items-center gap-2">
                    <Image src={exams.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">{t?.examsCount}</span>
                  </div>
                  <span className="mainColor font-semibold">
                    {subject!.lessonExamsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={level.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">{t?.progress}</span>
                  </div>
                  <span className="mainColor font-semibold">
                    <span className="me-0.5">{subject!.progress}%</span>
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-3">
                <div
                  className="h-full scoundBgColor transition-all duration-500"
                  style={{ width: `${subject!.progress}%` }}
                />
              </div>
              <button
                className="flex items-center justify-center bkMainColor
               w-full mt-4 rounded-md py-2 px-4 cursor-pointer"
              >
                <Image src={subjectExam.src} width={18} height={18} alt="" />
                <h3 className="text-lg text-white ms-2">اختبار المادة </h3>
              </button>
            </div>
          </div>
        )}

        <InfoModal
          open={lessonLockedOpen}
          onOpenChange={setLessonLockedOpen}
          variant="info"
          title={t?.lessonLockedTitle ?? ""}
          description={t?.lessonLockedMessage}
          primaryLabel={t?.close ?? ""}
          onPrimaryClick={() => setLessonLockedOpen(false)}
          dir={dir}
        />
      </div>
    </div>
  );
};

export default SubjectContent;
