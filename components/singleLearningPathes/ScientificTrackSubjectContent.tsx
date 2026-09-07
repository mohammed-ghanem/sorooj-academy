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
import { toast } from "sonner";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SubjectContentSkeleton, {
  SubjectContentHeroTitleSkeleton,
} from "@/components/skeletons/SubjectContentSkeleton";
import ExamModal from "@/components/modals/ExamModal";
import type { ExamModalLabels, ExamModalResult } from "@/components/modals/ExamModal";
import InfoModal from "@/components/modals/InfoModal";
import {
  useGetScientificSubjectDetailQuery,
  useLazyGetScientificSubjectExamQuery,
  useSubmitScientificSubjectExamMutation,
} from "@/store/scientificTracks/scientificTracksApi";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import { hasAccessToken } from "@/lib/auth/studentGate";
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
import type { ScientificTrackLesson, ScientificTrackSubjectDetail } from "@/types/scientificTrack";
import type { VideoExam, VideoExamAnswerPayload } from "@/types/studyVideoExam";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { cn } from "@/lib/utils";
import card from "@/public/assets/images/card.jpg";
import exams from "@/public/assets/images/exam.svg";
import subjectExam from "@/public/assets/images/subjectExam.svg";
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
  subject: ScientificTrackSubjectDetail,
  fallback: string,
): string {
  return subject.subjectExamBackendMessage?.trim() || fallback;
}

const ScientificTrackSubjectContent = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.singleLearningPaths;
  const subjectT = translate?.pages?.subjectDetail;
  const lessonT = translate?.pages?.lessonDetail;
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
  const [examOpen, setExamOpen] = useState(false);
  const [examData, setExamData] = useState<VideoExam | null>(null);
  const [examResult, setExamResult] = useState<ExamModalResult | null>(null);
  const [examAccessBlockedOpen, setExamAccessBlockedOpen] = useState(false);
  const [examAccessBlockedDescription, setExamAccessBlockedDescription] =
    useState("");
  const [examAccessBlockedShowContact, setExamAccessBlockedShowContact] =
    useState(false);

  const [fetchSubjectExam, { isFetching: loadingSubjectExam }] =
    useLazyGetScientificSubjectExamQuery();
  const [submitSubjectExam, { isLoading: submittingSubjectExam }] =
    useSubmitScientificSubjectExamMutation();

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
  const contactUsHref = `/${lang}/contact-us`;
  const contactUsLabel = translate?.home?.navbar?.contactUs ?? "";

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

  const resetExamState = () => {
    setExamOpen(false);
    setExamData(null);
    setExamResult(null);
  };

  const showSubjectExamStatusToast = () => {
    if (!subject || !subjectFinalExamUi?.showToastOnClick) return;

    if (subjectFinalExamUi.toastVariant === "success") {
      toast.success(
        subjectExamStatusToastMessage(
          subject,
          subjectT?.subjectExamAlreadyPassed ?? "",
        ),
      );
      return;
    }

    toast.info(
      subjectExamStatusToastMessage(
        subject,
        subjectT?.subjectExamUnderReviewToast ?? "",
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
          lang,
        }).unwrap(),
      {
        cachedMessage: subject.subjectExamBackendMessage,
        fallbackMessage: subjectT?.subjectExamLoadError ?? "",
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
    if (!hasAccessToken()) {
      router.push(loginHref);
      return;
    }

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
        lang,
      }).unwrap();
      setExamData(exam);
    } catch (err) {
      resetExamState();
      if (isExamLoadUnderReviewError(err)) {
        void refetch();
        toast.info(
          extractApiErrorMessage(err, subjectT?.subjectExamUnderReviewToast ?? ""),
        );
        return;
      }
      const message = extractApiErrorMessage(
        err,
        subjectT?.subjectExamLoadError ?? "",
      );
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
        lang,
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
          ? apiResult.message || (subjectT?.subjectExamPassed ?? "")
          : apiResult.message,
      });
    } catch (err) {
      toast.error(
        extractApiErrorMessage(err, subjectT?.subjectExamSubmitError ?? ""),
      );
    }
  };

  const handleRetakeSubjectExam = async () => {
    setExamResult(null);
    setExamData(null);

    try {
      const exam = await fetchSubjectExam({
        subjectId: idNum,
        lang,
      }).unwrap();
      setExamData(exam);
    } catch (err) {
      if (isExamLoadUnderReviewError(err)) {
        void refetch();
        toast.info(
          extractApiErrorMessage(err, subjectT?.subjectExamUnderReviewToast ?? ""),
        );
        return;
      }
      const message = extractApiErrorMessage(
        err,
        subjectT?.subjectExamLoadError ?? "",
      );
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
      passedTitle: subjectT?.subjectExamPassed ?? "",
      failedTitle: subjectT?.subjectExamFailed ?? "",
      failedDescription: lessonT?.examFailDescription ?? "",
      pendingReviewTitle: lessonT?.lessonExamUnderReviewTitle ?? "",
      pendingReviewDescription: lessonT?.lessonExamUnderReviewDescription ?? "",
      retake: lessonT?.examRetake ?? "",
      backToLesson: subjectT?.subjectExamBack ?? "",
      close: lessonT?.videoExamClose ?? "",
      cancel: lessonT?.videoExamCancel ?? "",
    }),
    [lessonT, subjectT],
  );

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
                  <span className="ms-2 text-lg">
                    {getSubjectExamButtonLabel(subjectFinalExamUi.phase, {
                      subjectExam: subjectT?.subjectExam,
                      subjectExamPassed: subjectT?.subjectExamPassed,
                      examRetake: lessonT?.examRetake,
                      subjectExamUnderReview: subjectT?.subjectExamUnderReview,
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
          title={subjectT?.lessonLockedTitle ?? ""}
          description={subjectT?.lessonLockedMessage}
          primaryLabel={subjectT?.close ?? t?.gateClose ?? ""}
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
            examAccessBlockedShowContact
              ? contactUsLabel
              : (subjectT?.close ?? t?.gateClose ?? "")
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
            examAccessBlockedShowContact
              ? (subjectT?.close ?? t?.gateClose ?? "")
              : ""
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

export default ScientificTrackSubjectContent;
