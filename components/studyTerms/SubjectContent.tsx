"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SubjectContentSkeleton, {
  SubjectContentHeroTitleSkeleton,
} from "@/components/skeletons/SubjectContentSkeleton";
import ExamModal from "@/components/modals/ExamModal";
import type { ExamModalLabels, ExamModalResult } from "@/components/modals/ExamModal";
import InfoModal from "@/components/modals/InfoModal";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import {
  extractApiErrorMessage,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";
import {
  buildExamAccessBlockedDescription,
  fetchExamBlockedBackendMessage,
} from "@/lib/studyLesson/examAccessNotice";
import {
  isExamLoadUnderReviewError,
  resolveSubjectFinalExamUiState,
  type LessonFinalExamPhase,
} from "@/lib/studyLesson/lessonExamState";
import type { StudySubjectDetail } from "@/types/studySubjectDetail";
import {
  useGetSubjectDetailQuery,
  useLazyGetSubjectExamQuery,
  useSubmitSubjectExamMutation,
} from "@/store/subjects/subjectsApi";
import type { StudyLesson } from "@/types/studySubjectDetail";
import type { VideoExam, VideoExamAnswerPayload } from "@/types/studyVideoExam";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import { cn } from "@/lib/utils";
import card from "@/public/assets/images/card.jpg";
import exams from "@/public/assets/images/exam.svg";
import subjectExam from "@/public/assets/images/subjectExam.svg";
import level from "@/public/assets/images/level.svg";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { toast } from "sonner";

/** Max characters shown for lesson title/summary on subject cards. */
const LESSON_CARD_SUMMARY_MAX_LENGTH = 45;

function formatLessonLabel(template: string | undefined, index: number) {
  return (template ?? "Lesson {{n}}").replace("{{n}}", String(index + 1));
}

function truncateWithEllipsis(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()} ...`;
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

function getExamButtonClassName(
  enabled: boolean,
  passed = false,
  options?: {
    successWhenEnabled?: boolean;
    underReview?: boolean;
    className?: string;
  },
) {
  const base =
    "w-full mt-4 rounded-md py-2 px-4 font-medium flex items-center justify-center gap-2";

  if (passed || (options?.successWhenEnabled && enabled)) {
    return cn(
      base,
      "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700",
      options?.className,
    );
  }

  if (options?.underReview) {
    return cn(
      base,
      "bg-gray-400 text-white cursor-pointer hover:bg-gray-500 opacity-90",
      options?.className,
    );
  }

  return cn(
    base,
    enabled
      ? "bkMainColor text-white cursor-pointer"
      : "bg-gray-300 text-gray-500 cursor-pointer hover:opacity-90 opacity-70",
    options?.className,
  );
}

function getSubjectExamButtonLabel(
  phase: LessonFinalExamPhase,
  labels: {
    subjectExam?: string;
    subjectExamPassed?: string;
    examRetake?: string;
    subjectExamUnderReview?: string;
  },
): string {
  switch (phase) {
    case "passed":
      return labels.subjectExamPassed ?? labels.subjectExam ?? "";
    case "retake":
      return labels.examRetake ?? labels.subjectExam ?? "";
    case "under_review":
      return labels.subjectExamUnderReview ?? "";
    case "not_started":
    default:
      return labels.subjectExam ?? "";
  }
}

function subjectExamStatusToastMessage(
  subject: StudySubjectDetail,
  fallback: string,
): string {
  return subject.subjectExamBackendMessage?.trim() || fallback;
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
  const termT = translate?.pages?.studyTermDetail;
  const lessonT = translate?.pages?.lessonDetail;
  const router = useRouter();
  const lang = LangUseParams();

  const { termId, contentId } = useParams<{
    termId: string;
    contentId: string;
  }>();

  const dir = lang === "en" ? "ltr" : "rtl";
  const [lessonLockedOpen, setLessonLockedOpen] = useState(false);
  const [subjectAccessDeniedOpen, setSubjectAccessDeniedOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [examData, setExamData] = useState<VideoExam | null>(null);
  const [examResult, setExamResult] = useState<ExamModalResult | null>(null);
  const [examAccessBlockedOpen, setExamAccessBlockedOpen] = useState(false);
  const [examAccessBlockedDescription, setExamAccessBlockedDescription] =
    useState("");
  const [examAccessBlockedShowContact, setExamAccessBlockedShowContact] =
    useState(false);

  const termHref = `/${lang ?? "ar"}/study-terms/${termId}`;
  const contactUsHref = `/${lang ?? "ar"}/contact-us`;
  const contactUsLabel = translate?.home?.navbar?.contactUs ?? "";

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
    error: subjectError,
    isLoading,
    isFetching,
    isError,
    isUninitialized,
    refetch,
  } = useGetSubjectDetailQuery(
    { id: contentId ?? "", lang: lang ?? "ar" },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const subjectAccessDenied = useMemo(() => {
    if (!subjectError || typeof subjectError !== "object") return false;
    return (subjectError as { status?: number }).status === 403;
  }, [subjectError]);

  const subjectAccessDeniedMessage = useMemo(() => {
    if (!subjectAccessDenied) return "";
    return extractApiErrorMessage(
      subjectError,
      t?.subjectLockedMessage ?? t?.notFound ?? "",
    );
  }, [subjectAccessDenied, subjectError, t?.notFound, t?.subjectLockedMessage]);

  const [fetchSubjectExam, { isFetching: loadingSubjectExam }] =
    useLazyGetSubjectExamQuery();
  const [submitSubjectExam, { isLoading: submittingSubjectExam }] =
    useSubmitSubjectExamMutation();

  const resetExamState = useCallback(() => {
    setExamOpen(false);
    setExamData(null);
    setExamResult(null);
  }, []);

  const showSkeleton =
    !invalidId &&
    (!apiReady ||
      isUninitialized ||
      isLoading ||
      isFetching ||
      (!subject && !isError));
  const showError = !invalidId && !showSkeleton && (isError || !subject);
  const subjectLessons = subject?.lessons ?? [];
  const progressPercent = subject?.lessonsProgress.percentage ?? subject?.progress ?? 0;

  const subjectFinalExamUi = useMemo(() => {
    if (!subject) return null;
    return resolveSubjectFinalExamUiState({
      hasActiveLessonExam: subject.hasActiveSubjectExam,
      lessonExamAttemptStatus: subject.subjectExamAttemptStatus,
      studentHasPassedLessonExam: subject.studentHasPassedSubjectExam,
      canAccessLessonExam: subject.canAccessSubjectExam,
      canStartNewLessonExam: subject.canStartNewSubjectExam,
      canRetakeLessonExam: subject.canRetakeSubjectExam,
    });
  }, [subject]);

  useEffect(() => {
    if (showError && subjectAccessDenied) {
      setSubjectAccessDeniedOpen(true);
    }
  }, [showError, subjectAccessDenied]);

  const showSubjectExamStatusToast = () => {
    if (!subject || !subjectFinalExamUi?.showToastOnClick) return;

    if (subjectFinalExamUi.toastVariant === "success") {
      toast.success(
        subjectExamStatusToastMessage(
          subject,
          t?.subjectExamAlreadyPassed ?? "",
        ),
      );
      return;
    }

    toast.info(
      subjectExamStatusToastMessage(
        subject,
        t?.subjectExamUnderReviewToast ?? "",
      ),
    );
  };

  const showSubjectExamAccessBlockedNotice = async (
    attemptsExhausted: boolean,
  ) => {
    if (!subject) return;

    const message = await fetchExamBlockedBackendMessage(
      () =>
        fetchSubjectExam({
          subjectId: idNum,
          lang: lang ?? "ar",
        }).unwrap(),
      {
        cachedMessage: subject.subjectExamBackendMessage,
        fallbackMessage: t?.subjectExamLoadError ?? "",
      },
    );

    if (attemptsExhausted) {
      setExamAccessBlockedDescription(
        buildExamAccessBlockedDescription(
          message,
          lessonT?.examAttemptsBlockedContactHint,
        ),
      );
      setExamAccessBlockedShowContact(true);
      setExamAccessBlockedOpen(true);
      return;
    }

    toast.info(message);
  };

  const handleOpenSubjectExam = async () => {
    if (!subject || !subjectFinalExamUi) return;

    if (subjectFinalExamUi.showToastOnClick) {
      showSubjectExamStatusToast();
      return;
    }

    setExamData(null);
    setExamResult(null);

    if (!subjectFinalExamUi.canOpenExam) {
      await showSubjectExamAccessBlockedNotice(
        subjectFinalExamUi.attemptsExhausted,
      );
      return;
    }

    setExamOpen(true);

    try {
      const exam = await fetchSubjectExam({
        subjectId: idNum,
        lang: lang ?? "ar",
      }).unwrap();
      setExamData(exam);
    } catch (err) {
      resetExamState();
      if (isExamLoadUnderReviewError(err)) {
        void refetch();
        toast.info(
          extractApiErrorMessage(err, t?.subjectExamUnderReviewToast ?? ""),
        );
        return;
      }
      const message = extractApiErrorMessage(err, t?.subjectExamLoadError ?? "");
      if (readRtkQueryHttpStatus(err) === 403) {
        toast.info(message);
        return;
      }
      toast.error(message);
    }
  };

  const handleSubmitSubjectExam = async (answers: VideoExamAnswerPayload[]) => {
    try {
      const apiResult = await submitSubjectExam({
        subjectId: idNum,
        lang: lang ?? "ar",
        answers,
      }).unwrap();

      const { data: refreshedSubject } = await refetch();

      if (
        apiResult.pendingReview ||
        refreshedSubject?.isSubjectExamUnderReview
      ) {
        setExamResult({
          passed: false,
          pendingReview: true,
          message:
            apiResult.message ||
            (lessonT?.lessonExamUnderReviewDescription ?? ""),
        });
        return;
      }

      const passed =
        apiResult.passed ||
        refreshedSubject?.studentHasPassedSubjectExam === true;

      setExamResult({
        passed,
        score: apiResult.score,
        message: passed
          ? apiResult.message || (t?.subjectExamPassed ?? "")
          : apiResult.message,
      });
    } catch (err) {
      toast.error(
        extractApiErrorMessage(err, t?.subjectExamSubmitError ?? ""),
      );
    }
  };

  const handleRetakeSubjectExam = async () => {
    setExamResult(null);
    setExamData(null);

    try {
      const exam = await fetchSubjectExam({
        subjectId: idNum,
        lang: lang ?? "ar",
      }).unwrap();
      setExamData(exam);
    } catch (err) {
      if (isExamLoadUnderReviewError(err)) {
        void refetch();
        toast.info(
          extractApiErrorMessage(err, t?.subjectExamUnderReviewToast ?? ""),
        );
        return;
      }
      const message = extractApiErrorMessage(err, t?.subjectExamLoadError ?? "");
      if (readRtkQueryHttpStatus(err) === 403) {
        toast.info(message);
        return;
      }
      toast.error(message);
    }
  };

  const examModalLabels = useMemo<ExamModalLabels>(
    () => ({
      loading: lessonT?.videoExamLoading ?? "",
      noQuestions: lessonT?.videoExamNoQuestions ?? "",
      trueAnswer: lessonT?.examTrueAnswer ?? "",
      falseAnswer: lessonT?.examFalseAnswer ?? "",
      questionOf: lessonT?.examQuestionOf ?? "",
      multipleChoice: lessonT?.examMultipleChoice ?? "",
      trueFalseType: lessonT?.examTrueFalseType ?? "",
      articleType: lessonT?.examArticleType ?? "",
      articlePlaceholder: lessonT?.examArticlePlaceholder ?? "",
      previous: lessonT?.examPrevious ?? "",
      next: lessonT?.examNext ?? "",
      finish: lessonT?.examFinish ?? "",
      confirmTitle: lessonT?.examConfirmTitle ?? "",
      confirmDescription: lessonT?.examConfirmDescription ?? "",
      totalQuestions: lessonT?.examTotalQuestions ?? "",
      answeredQuestions: lessonT?.examAnsweredQuestions ?? "",
      remainingQuestions: lessonT?.examRemainingQuestions ?? "",
      confirmSubmit: lessonT?.examConfirmSubmit ?? "",
      backToReview: lessonT?.examBackToReview ?? "",
      passedTitle: t?.subjectExamPassed ?? "",
      failedTitle: t?.subjectExamFailed ?? "",
      failedDescription: lessonT?.examFailDescription ?? "",
      pendingReviewTitle: lessonT?.lessonExamUnderReviewTitle ?? "",
      pendingReviewDescription: lessonT?.lessonExamUnderReviewDescription ?? "",
      retake: lessonT?.examRetake ?? "",
      backToLesson: t?.subjectExamBack ?? "",
      close: lessonT?.videoExamClose ?? "",
      cancel: lessonT?.videoExamCancel ?? "",
    }),
    [lessonT, t],
  );

  const handleLessonStart = (lesson: StudyLesson) => {
    if (!isLessonAccessible(lesson)) {
      setLessonLockedOpen(true);
      return;
    }

    router.push(
      `/${lang ?? "ar"}/study-terms/${termId}/content/${contentId}/lesson/${lesson.id}`,
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
            {showSkeleton || !subject ? (
              <SubjectContentHeroTitleSkeleton />
            ) : (
              <h1 className="text-2xl font-semibold mt-2 mb-4">
                <span className="mainColor">{t?.heroLabel} </span>
                <span className="scoundColor">{subject.title}</span>
              </h1>
            )}
          </div>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-24">
        {showSkeleton && <SubjectContentSkeleton />}

        {showError && (
          <div className="container mx-auto flex min-h-[40vh] w-[90%] flex-col items-center justify-center py-16 text-center">
            {subjectAccessDenied ? (
              <>
                <Link
                  href={termHref}
                  className="text-sm scoundColor hover:underline mb-4"
                >
                  {t?.back}
                </Link>
                <InfoModal
                  open={subjectAccessDeniedOpen}
                  onOpenChange={setSubjectAccessDeniedOpen}
                  variant="info"
                  title={termT?.subjectLockedTitle ?? ""}
                  description={subjectAccessDeniedMessage}
                  primaryLabel={t?.close ?? ""}
                  onPrimaryClick={() => setSubjectAccessDeniedOpen(false)}
                  dir={dir}
                />
              </>
            ) : (
              <>
                <p className="text-lg mainColor font-medium mb-4">
                  {t?.notFound}
                </p>
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
              </>
            )}
          </div>
        )}

        {!showSkeleton && !showError && subject && (
          <div className="container mx-auto w-[90%] grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-6 shadow-r-sm">
              <div className=" mb-4">
                <h3 className="text-lg font-semibold mainColor">
                  {subject.title}
                </h3>
                {subject.description ? (
                  <p className="text-sm text-gray-500 w-[80%] my-4">
                    {subject.description}
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
                    const lessonSummary =
                      lesson.title || lesson.briefContent || t?.untitled || "";
                    const lessonSummaryDisplay = truncateWithEllipsis(
                      lessonSummary,
                      LESSON_CARD_SUMMARY_MAX_LENGTH,
                    );
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
                          <h5
                            className="text-xs text-gray-500 mb-3"
                            title={
                              lessonSummary.length > LESSON_CARD_SUMMARY_MAX_LENGTH
                                ? lessonSummary
                                : undefined
                            }
                          >
                            {lessonSummaryDisplay}
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
                  src={subject.cover || card.src}
                  alt={subject.title}
                  fill
                  className="rounded-xl object-cover"
                  unoptimized={Boolean(subject.cover)}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold mainColor mb-2">
                  {t?.detailsTitle}
                </h2>
                <hr className="my-2" />
              </div>

              <h3 className="text-lg font-semibold mainColor mb-2">
                {subject.title}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={lessons.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">{t?.lessonsCount}</span>
                  </div>
                  <span className="mainColor font-semibold">
                    {subject.lessonsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between my-4">
                  <div className="flex items-center gap-2">
                    <Image src={exams.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">{t?.examsCount}</span>
                  </div>
                  <span className="mainColor font-semibold">
                    {subject.lessonExamsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={level.src} width={18} height={18} alt="" />
                    <span className="descriptionColor">{t?.progress}</span>
                  </div>
                  <span className="mainColor font-semibold">
                    <span className="me-0.5">{progressPercent}%</span>
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-3">
                <div
                  className="h-full scoundBgColor transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {/* subject exam button */}
              {subject.hasActiveSubjectExam && subjectFinalExamUi ? (
                <button
                  type="button"
                  disabled={loadingSubjectExam}
                  onClick={() => void handleOpenSubjectExam()}
                  className={getExamButtonClassName(
                    subjectFinalExamUi.canOpenExam ||
                      subjectFinalExamUi.showToastOnClick ||
                      subjectFinalExamUi.attemptsExhausted ||
                      !subject.canAccessSubjectExam,
                    subjectFinalExamUi.phase === "passed",
                    {
                      successWhenEnabled:
                        subjectFinalExamUi.phase === "not_started" ||
                        subjectFinalExamUi.phase === "passed",
                      underReview:
                        subjectFinalExamUi.phase === "under_review",
                    },
                  )}
                >
                  <Image
                    src={subjectExam.src}
                    width={18}
                    height={18}
                    alt=""
                    className={cn(
                      "shrink-0",
                      (subjectFinalExamUi.phase === "passed" ||
                        subjectFinalExamUi.phase === "under_review" ||
                        subjectFinalExamUi.canOpenExam) &&
                        "brightness-0 invert",
                    )}
                  />
                  <span className="text-lg ms-2">
                    {getSubjectExamButtonLabel(subjectFinalExamUi.phase, {
                      subjectExam: t?.subjectExam,
                      subjectExamPassed: t?.subjectExamPassed,
                      examRetake: lessonT?.examRetake,
                      subjectExamUnderReview: t?.subjectExamUnderReview,
                    })}
                  </span>
                </button>
              ) : null}
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

        <InfoModal
          open={examAccessBlockedOpen}
          onOpenChange={setExamAccessBlockedOpen}
          variant="info"
          title=""
          description={examAccessBlockedDescription}
          primaryLabel={
            examAccessBlockedShowContact ? contactUsLabel : (t?.close ?? "")
          }
          primaryHref={
            examAccessBlockedShowContact ? contactUsHref : undefined
          }
          onPrimaryClick={
            examAccessBlockedShowContact
              ? undefined
              : () => setExamAccessBlockedOpen(false)
          }
          secondaryLabel={
            examAccessBlockedShowContact ? (t?.close ?? "") : ""
          }
          dir={dir}
        />

        <ExamModal
          open={examOpen}
          onOpenChange={(open) => {
            if (!open) resetExamState();
            else setExamOpen(true);
          }}
          exam={examData}
          loading={loadingSubjectExam}
          submitting={submittingSubjectExam}
          result={examResult}
          dir={dir}
          labels={examModalLabels}
          onSubmit={handleSubmitSubjectExam}
          onRetake={handleRetakeSubjectExam}
          onCloseResult={resetExamState}
        />
      </div>
    </div>
  );
};

export default SubjectContent;
