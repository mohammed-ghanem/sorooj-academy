"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SingleLessonContentSkeleton, {
  SingleLessonHeroTitleSkeleton,
} from "@/components/skeletons/SingleLessonContentSkeleton";
import ExamModal from "@/components/modals/ExamModal";
import type { ExamModalLabels, ExamModalResult } from "@/components/modals/ExamModal";
import InfoModal from "@/components/modals/InfoModal";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import { isLessonExamNoMoreAttemptsMessage } from "@/lib/studyLesson/lessonExamState";
import {
  useCompleteVideoWatchMutation,
  useGetLessonDetailQuery,
  useLazyGetLessonExamQuery,
  useLazyGetVideoExamQuery,
  useSubmitLessonExamMutation,
  useSubmitVideoExamMutation,
} from "@/store/lessons/lessonsApi";
import type { StudyLessonVideo } from "@/types/studyLessonDetail";
import type { VideoExam, VideoExamAnswerPayload } from "@/types/studyVideoExam";
import TranslateHook from "@/translate/TranslateHook";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const DefaultDoctorAvatar = "/assets/images/doctor.svg";

/** YouTube IDs may include `?si=...`; embed URLs need the bare id. */
const stripYoutubeVideoId = (youtubeId: string) => youtubeId.split("?")[0];

/** Resolve iframe or native video source from API-mapped video row. */
function getVideoPlayback(
  video?: Pick<StudyLessonVideo, "youtubeId" | "embedUrl" | "streamUrl">,
): { kind: "youtube" | "stream"; src: string } | null {
  if (!video) return null;

  if (video.embedUrl?.trim()) {
    const url = video.embedUrl.trim();
    return url.includes("youtube") || url.includes("youtu.be")
      ? { kind: "youtube", src: url }
      : { kind: "stream", src: url };
  }

  if (video.youtubeId?.trim()) {
    return {
      kind: "youtube",
      src: `https://www.youtube.com/embed/${stripYoutubeVideoId(video.youtubeId)}?rel=0`,
    };
  }

  if (video.streamUrl?.trim()) {
    return { kind: "stream", src: video.streamUrl.trim() };
  }

  return null;
}

function formatVideoListLabel(template: string | undefined, index: number) {
  return (template ?? "Video {{n}}").replace("{{n}}", String(index + 1));
}

function getApiErrorMessage(err: unknown, fallback: string): string {
  const errorData = err as {
    data?: {
      message?: string;
      errors?: Record<string, string[]> | string[];
    };
  };
  const payload = errorData?.data;

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  if (payload?.errors) {
    if (Array.isArray(payload.errors)) {
      const first = payload.errors.find(
        (item) => typeof item === "string" && item.trim(),
      );
      if (typeof first === "string") return first.trim();
    } else {
      const messages = Object.values(payload.errors).flat();
      if (messages.length) return messages[0];
    }
  }

  return fallback;
}

function resolveResumeVideoId(videos: StudyLessonVideo[]): string {
  if (!videos.length) return "";

  const inProgress = videos.find(
    (video) => video.canAccessVideo && !video.isLocked && !video.isCompleted,
  );
  if (inProgress) return String(inProgress.id);

  const accessible = videos.filter(
    (video) => video.canAccessVideo && !video.isLocked,
  );
  if (accessible.length > 0) {
    return String(accessible[accessible.length - 1].id);
  }

  return String(videos[0].id);
}

function getExamButtonClassName(
  enabled: boolean,
  passed = false,
  options?: { successWhenEnabled?: boolean; className?: string },
) {
  const base =
    "text-[13px] text-white px-4 py-2 mt-2.5 rounded-md font-medium flex items-center gap-1.5";

  if (passed || (options?.successWhenEnabled && enabled)) {
    return cn(
      base,
      "bg-emerald-600 cursor-pointer hover:bg-emerald-700",
      options?.className,
    );
  }

  return cn(
    base,
    enabled
      ? "bkMainColor cursor-pointer"
      : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70",
    options?.className,
  );
}

/** Extra Tailwind classes for the final lesson exam button only — edit here. */
const LESSON_FINAL_EXAM_BUTTON_CLASS = "font-semibold text-[15px]";

type ExamContext =
  | { kind: "video"; videoId: number }
  | { kind: "lesson" }
  | null;

const SingleLessonContent = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.lessonDetail;
  const subjectT = translate?.pages?.subjectDetail;

  const { lang, termId, contentId, lessonId } = useParams<{
    lang: string;
    termId: string;
    contentId: string;
    lessonId: string;
  }>();

  const subjectContentHref = `/${lang}/study-terms/${termId}/content/${contentId}`;

  const idNum = useMemo(
    () =>
      lessonId && !Number.isNaN(Number(lessonId)) ? Number(lessonId) : NaN,
    [lessonId],
  );

  const apiReady = useStudentApiReady();
  const invalidId = !lessonId || Number.isNaN(idNum);
  const skipQuery = invalidId || !apiReady;

  const {
    data: lesson,
    error: lessonError,
    isLoading,
    isFetching,
    isError,
    isUninitialized,
    refetch,
  } = useGetLessonDetailQuery(
    { id: lessonId ?? "", lang: lang ?? "ar" },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const lessonAccessDenied = useMemo(() => {
    if (!lessonError || typeof lessonError !== "object") return false;
    return (lessonError as { status?: number }).status === 403;
  }, [lessonError]);

  const lessonAccessDeniedMessage = useMemo(() => {
    if (!lessonAccessDenied) return "";
    return extractApiErrorMessage(
      lessonError,
      subjectT?.lessonLockedMessage ?? t?.notFound ?? "",
    );
  }, [
    lessonAccessDenied,
    lessonError,
    subjectT?.lessonLockedMessage,
    t?.notFound,
  ]);

  const showSkeleton =
    !invalidId &&
    (!apiReady ||
      isUninitialized ||
      isLoading ||
      isFetching ||
      (!lesson && !isError));
  const showError = !invalidId && !showSkeleton && (isError || !lesson);

  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState("");
  const [activeLessonTab, setActiveLessonTab] = useState<
    "description" | "files"
  >("description");
  const [examOpen, setExamOpen] = useState(false);
  const [examContext, setExamContext] = useState<ExamContext>(null);
  const [examData, setExamData] = useState<VideoExam | null>(null);
  const [examResult, setExamResult] = useState<ExamModalResult | null>(null);

  const [completeVideoWatch, { isLoading: completingWatch }] =
    useCompleteVideoWatchMutation();
  const [fetchVideoExam, { isFetching: loadingVideoExam }] =
    useLazyGetVideoExamQuery();
  const [fetchLessonExam, { isFetching: loadingLessonExam }] =
    useLazyGetLessonExamQuery();
  const [submitVideoExam, { isLoading: submittingVideoExam }] =
    useSubmitVideoExamMutation();
  const [submitLessonExam, { isLoading: submittingLessonExam }] =
    useSubmitLessonExamMutation();

  const loadingExam = loadingVideoExam || loadingLessonExam;
  const submittingExam = submittingVideoExam || submittingLessonExam;

  const dir = lang === "en" ? "ltr" : "rtl";

  useEffect(() => {
    if (showError && lessonAccessDenied) {
      setAccessDeniedOpen(true);
    }
  }, [showError, lessonAccessDenied]);

  // Resume on the current unlocked step (not always the first video).
  useEffect(() => {
    if (!lesson?.videos.length) return;

    const resumeId = resolveResumeVideoId(lesson.videos);

    setActiveVideoId((current) => {
      if (!current) return resumeId;

      const currentVideo = lesson.videos.find(
        (video) => String(video.id) === current,
      );

      if (
        !currentVideo ||
        !currentVideo.canAccessVideo ||
        currentVideo.isLocked
      ) {
        return resumeId;
      }

      if (currentVideo.isCompleted && resumeId !== current) {
        return resumeId;
      }

      return current;
    });
  }, [lesson]);
  const videos = lesson?.videos ?? [];
  const attachments = lesson?.attachments ?? [];
  const activeVideo =
    videos.find((video) => String(video.id) === activeVideoId) ?? videos[0];
  const activePlayback = getVideoPlayback(activeVideo);
  const videosProgress = lesson?.videosProgress ?? {
    completed: 0,
    total: videos.length,
    percentage: 0,
  };
  const progressPercent = videosProgress.percentage;
  const activeVideoWatchCompleted = activeVideo?.isWatchCompleted ?? false;

  const selectNextUnlockedVideo = useCallback(
    (fromVideoId: number) => {
      const currentIndex = videos.findIndex((v) => v.id === fromVideoId);
      const next = videos[currentIndex + 1];
      if (next && next.canAccessVideo && !next.isLocked) {
        setActiveVideoId(String(next.id));
      }
    },
    [videos],
  );

  const resetExamState = useCallback(() => {
    setExamOpen(false);
    setExamContext(null);
    setExamData(null);
    setExamResult(null);
  }, []);

  const handleWatchComplete = async () => {
    if (!activeVideo || completingWatch || activeVideoWatchCompleted) return;

    try {
      await completeVideoWatch({
        videoId: activeVideo.id,
        lessonId: idNum,
        lang: lang ?? "ar",
      }).unwrap();

      const { data: refreshedLesson } = await refetch();
      const refreshedVideo = refreshedLesson?.videos.find(
        (video) => video.id === activeVideo.id,
      );

      if (
        refreshedVideo &&
        !refreshedVideo.hasActiveVideoExam &&
        refreshedVideo.isCompleted
      ) {
        selectNextUnlockedVideo(activeVideo.id);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, t?.watchCompleteError ?? ""));
    }
  };

  const handleOpenVideoExam = async (video: StudyLessonVideo) => {
    if (video.studentHasPassedVideoExam) {
      toast.success(t?.videoExamAlreadyPassed ?? "");
      return;
    }

    if (!video.canAccessVideoExam) return;

    setExamContext({ kind: "video", videoId: video.id });
    setExamData(null);
    setExamResult(null);
    setExamOpen(true);

    try {
      const exam = await fetchVideoExam({
        videoId: video.id,
        lang: lang ?? "ar",
      }).unwrap();
      setExamData(exam);
    } catch (err) {
      resetExamState();
      toast.error(getApiErrorMessage(err, t?.videoExamLoadError ?? ""));
    }
  };

  const handleOpenLessonExam = async () => {
    if (lesson?.isLessonExamUnderReview) {
      toast.info(t?.lessonExamUnderReviewToast ?? "");
      return;
    }

    if (lesson?.studentHasPassedLessonExam) {
      toast.success(t?.lessonExamAlreadyPassed ?? "");
      return;
    }

    if (!lesson?.canOpenLessonFinalExam) return;

    setExamContext({ kind: "lesson" });
    setExamData(null);
    setExamResult(null);
    setExamOpen(true);

    try {
      const exam = await fetchLessonExam({
        lessonId: idNum,
        lang: lang ?? "ar",
      }).unwrap();
      setExamData(exam);
    } catch (err) {
      resetExamState();
      const message = getApiErrorMessage(err, t?.lessonExamLoadError ?? "");
      if (isLessonExamNoMoreAttemptsMessage(message)) {
        toast.info(t?.lessonExamUnderReviewToast ?? "");
        return;
      }
      toast.error(message);
    }
  };

  const handleSubmitExam = async (answers: VideoExamAnswerPayload[]) => {
    if (!examContext) return;

    try {
      const apiResult =
        examContext.kind === "video"
          ? await submitVideoExam({
              videoId: examContext.videoId,
              lessonId: idNum,
              lang: lang ?? "ar",
              answers,
            }).unwrap()
          : await submitLessonExam({
              lessonId: idNum,
              lang: lang ?? "ar",
              answers,
            }).unwrap();

      const { data: refreshedLesson } = await refetch();

      if (examContext.kind === "video") {
        const refreshedVideo = refreshedLesson?.videos.find(
          (video) => video.id === examContext.videoId,
        );
        const passed =
          apiResult.passed ||
          refreshedVideo?.studentHasPassedVideoExam === true ||
          refreshedVideo?.isCompleted === true;

        setExamResult({
          passed,
          score: apiResult.score,
          message: passed
            ? apiResult.message || (t?.videoExamPassed ?? "")
            : undefined,
        });

        if (passed && refreshedVideo?.isCompleted) {
          selectNextUnlockedVideo(examContext.videoId);
        }
        return;
      }

      if (apiResult.pendingReview || refreshedLesson?.isLessonExamUnderReview) {
        setExamResult({
          passed: false,
          pendingReview: true,
          message:
            apiResult.message || (t?.lessonExamUnderReviewDescription ?? ""),
        });
        return;
      }

      const passed =
        apiResult.passed ||
        refreshedLesson?.studentHasPassedLessonExam === true;

      setExamResult({
        passed,
        score: apiResult.score,
        message: passed
          ? apiResult.message || (t?.lessonFinalExamPassed ?? "")
          : apiResult.message,
      });
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          examContext.kind === "video"
            ? (t?.videoExamSubmitError ?? "")
            : (t?.lessonExamSubmitError ?? ""),
        ),
      );
    }
  };

  const handleRetakeExam = async () => {
    if (!examContext) return;

    setExamResult(null);
    setExamData(null);

    try {
      if (examContext.kind === "video") {
        const exam = await fetchVideoExam({
          videoId: examContext.videoId,
          lang: lang ?? "ar",
        }).unwrap();
        setExamData(exam);
        return;
      }

      const exam = await fetchLessonExam({
        lessonId: idNum,
        lang: lang ?? "ar",
      }).unwrap();
      setExamData(exam);
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          examContext.kind === "video"
            ? (t?.videoExamLoadError ?? "")
            : (t?.lessonExamLoadError ?? ""),
        ),
      );
    }
  };

  const examModalLabels = useMemo<ExamModalLabels>(
    () => ({
      loading: t?.videoExamLoading ?? "",
      noQuestions: t?.videoExamNoQuestions ?? "",
      trueAnswer: t?.examTrueAnswer ?? "",
      falseAnswer: t?.examFalseAnswer ?? "",
      questionOf: t?.examQuestionOf ?? "",
      multipleChoice: t?.examMultipleChoice ?? "",
      trueFalseType: t?.examTrueFalseType ?? "",
      previous: t?.examPrevious ?? "",
      next: t?.examNext ?? "",
      finish: t?.examFinish ?? "",
      confirmTitle: t?.examConfirmTitle ?? "",
      confirmDescription: t?.examConfirmDescription ?? "",
      totalQuestions: t?.examTotalQuestions ?? "",
      answeredQuestions: t?.examAnsweredQuestions ?? "",
      remainingQuestions: t?.examRemainingQuestions ?? "",
      confirmSubmit: t?.examConfirmSubmit ?? "",
      backToReview: t?.examBackToReview ?? "",
      passedTitle:
        examContext?.kind === "lesson"
          ? (t?.lessonFinalExamPassed ?? "")
          : (t?.videoExamPassed ?? ""),
      failedTitle:
        examContext?.kind === "lesson"
          ? (t?.lessonExamFailed ?? "")
          : (t?.videoExamFailed ?? ""),
      failedDescription: t?.examFailDescription ?? "",
      pendingReviewTitle: t?.lessonExamUnderReviewTitle ?? "",
      pendingReviewDescription: t?.lessonExamUnderReviewDescription ?? "",
      retake: t?.examRetake ?? "",
      backToLesson: t?.examBackToLesson ?? "",
      close: t?.videoExamClose ?? "",
      cancel: t?.videoExamCancel ?? "",
    }),
    [examContext?.kind, t],
  );

  const renderVideoExamButton = (
    video: StudyLessonVideo,
    options?: { stopPropagation?: boolean; className?: string },
  ) => {
    if (!video.hasActiveVideoExam) return null;

    const passed = video.studentHasPassedVideoExam;
    const canOpenExam = video.canAccessVideoExam && !passed;

    return (
      <button
        type="button"
        disabled={!canOpenExam && !passed}
        onClick={(event) => {
          if (options?.stopPropagation) event.stopPropagation();
          if (passed) {
            toast.success(t?.videoExamAlreadyPassed ?? "");
            return;
          }
          if (!canOpenExam) return;
          void handleOpenVideoExam(video);
        }}
        className={cn(
          getExamButtonClassName(canOpenExam, passed),
          options?.className,
        )}
      >
        {passed ? (t?.videoExamPassed ?? t?.videoExam) : t?.videoExam}
      </button>
    );
  };

  const renderLessonFinalExamButton = (options?: { className?: string }) => {
    if (!lesson?.hasActiveLessonExam) return null;

    const underReview = lesson.isLessonExamUnderReview;
    const passed = lesson.studentHasPassedLessonExam;
    const canRetake = lesson.canRetakeLessonExam;
    const canOpen = lesson.canOpenLessonFinalExam;
    const isHighlighted = passed || (canOpen && !underReview);

    const buttonLabel = underReview
      ? (t?.lessonExamUnderReview ?? "")
      : passed
        ? (t?.lessonFinalExamPassed ?? t?.lessonFinalExam)
        : t?.lessonFinalExam;

    return (
      <button
        type="button"
        disabled={underReview || (!canOpen && !passed)}
        onClick={() => {
          if (underReview) {
            toast.info(t?.lessonExamUnderReviewToast ?? "");
            return;
          }
          if (passed) {
            toast.success(t?.lessonExamAlreadyPassed ?? "");
            return;
          }
          if (!canOpen && !canRetake) return;
          void handleOpenLessonExam();
        }}
        className={getExamButtonClassName(canOpen && !underReview, passed, {
          successWhenEnabled: !canRetake || passed,
          className: cn(LESSON_FINAL_EXAM_BUTTON_CLASS, options?.className),
        })}
      >
        <Image
          src="/assets/images/exam.svg"
          alt=""
          width={16}
          height={16}
          className={cn(
            "shrink-0",
            isHighlighted && "brightness-0 invert",
            !isHighlighted && "opacity-60",
          )}
        />
        <span>{buttonLabel}</span>
      </button>
    );
  };

  const lessonDescription =
    lesson?.content?.trim() || lesson?.briefContent?.trim() || "";

  const heroTitle =
    lesson?.lessonNumber && lesson?.title
      ? `${lesson.lessonNumber}: ${lesson.title}`
      : (lesson?.title ?? "");

  /** Unlock state comes from API (`can_access_video` / `is_locked`). */
  const isVideoUnlocked = (video: StudyLessonVideo) =>
    video.canAccessVideo && !video.isLocked;

  if (invalidId) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-lg mainColor font-medium mb-4">{t?.notFound}</p>
        <Link
          href={subjectContentHref}
          className="text-sm scoundColor hover:underline"
        >
          {t?.back}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero stays mounted on refresh — same pattern as StudyTerms */}
      <SmallHeroSection
        title={
          <div className="text-center mt-20">
            <Link
              href={subjectContentHref}
              className="text-sm scoundColor hover:underline inline-block mb-2"
            >
              {t?.back}
            </Link>
            {showSkeleton ? (
              <SingleLessonHeroTitleSkeleton />
            ) : (
              <h1 className="text-2xl font-semibold mt-2 mb-1 mainColor">
                {heroTitle}
              </h1>
            )}
          </div>
        }
      />

      {showSkeleton && <SingleLessonContentSkeleton />}

      {showError && (
        <div className="container mx-auto flex min-h-[40vh] w-[90%] flex-col items-center justify-center bg-[#F6F6F6] py-16 text-center">
          {lessonAccessDenied ? (
            <>
              <Link
                href={subjectContentHref}
                className="text-sm scoundColor hover:underline"
              >
                {t?.back}
              </Link>
              <InfoModal
                open={accessDeniedOpen}
                onOpenChange={setAccessDeniedOpen}
                variant="info"
                title={subjectT?.lessonLockedTitle ?? ""}
                description={lessonAccessDeniedMessage}
                primaryLabel={subjectT?.close ?? ""}
                onPrimaryClick={() => setAccessDeniedOpen(false)}
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
                  href={subjectContentHref}
                  className="text-sm scoundColor hover:underline self-center"
                >
                  {t?.back}
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {!showSkeleton && !showError && lesson && (
        <>
          {/* Subject title + instructor */}
          <div className="bg-white container w-[90%] mx-auto py-10">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/arrowLeft.svg"
                alt=""
                width={20}
                height={20}
              />
              <h1 className="text-xl font-semibold mainColor">
                {lesson.subjectName ?? lesson.title}
              </h1>
            </div>
            {lesson.doctorName ? (
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#efe7d8]">
                  <Image
                    src={lesson.doctorImage ?? DefaultDoctorAvatar}
                    alt={lesson.doctorName}
                    fill
                    className="object-cover"
                    sizes="44px"
                    unoptimized={Boolean(lesson.doctorImage)}
                  />
                </div>
                <h2 className="text-sm font-semibold descriptionColor">
                  {lesson.doctorName}
                </h2>
              </div>
            ) : null}
          </div>

          <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-14 md:pb-24">
            <div className="container mx-auto w-[90%] grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Main player */}
              <div className="order-1 lg:order-0 lg:col-span-8 lg:row-start-1">
                <div className="bg-white rounded-2xl p-4 md:p-5 shadow-r-sm">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center justify-between mb-4 w-full">
                      <h2 className="text-lg font-semibold">{lesson.title}</h2>

                      {/* watch complete + final lesson exam */}
                      {activeVideo && activePlayback ? (
                        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                          {!activeVideoWatchCompleted ? (
                            <button
                              type="button"
                              disabled={completingWatch}
                              onClick={() => void handleWatchComplete()}
                              className="text-[13px] text-white bkMainColor px-4 py-2 mt-2.5 rounded-md
                             font-medium flex items-center gap-1 cursor-pointer disabled:opacity-60"
                            >
                              <span>{t?.watchComplete}</span>
                              <Check size={16} />
                            </button>
                          ) : null}
                          {/* Final lesson exam — extra classes: LESSON_FINAL_EXAM_BUTTON_CLASS (~line 137) */}
                          {renderLessonFinalExamButton()}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {activePlayback ? (
                    <div className="relative w-full overflow-hidden rounded-xl bg-black">
                      {activePlayback.kind === "youtube" ? (
                        <iframe
                          key={activeVideo?.id}
                          className="w-full aspect-video"
                          src={activePlayback.src}
                          title={activeVideo?.title ?? "lesson video"}
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      ) : (
                        <video
                          key={activeVideo?.id}
                          className="w-full aspect-video bg-black"
                          src={activePlayback.src}
                          controls
                          playsInline
                        />
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-600 py-12">
                      {t?.noVideos}
                    </p>
                  )}
                </div>
              </div>

              {/* Video playlist + progress */}
              <div className="order-2 lg:order-0 lg:col-span-4 lg:row-span-2 lg:row-start-1 lg:col-start-9 rounded-2xl shadow-r-sm overflow-hidden h-fit">
                <div className="px-4 py-4 mb-4 bg-[#faf7f1]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold mainColor">
                      {t?.overallProgress}
                    </h3>
                    <span className="text-xs scoundColor font-semibold">
                      {videosProgress.completed}/{videosProgress.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#ece7db] rounded-full overflow-hidden">
                    <div
                      className="h-full scoundBgColor transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="max-h-[560px] overflow-x-hidden overflow-y-auto">
                  {videos.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-gray-600">
                      {t?.noVideos}
                    </p>
                  ) : (
                    videos.map((video, index) => {
                      const videoKey = String(video.id);
                      const unlocked = isVideoUnlocked(video);
                      const isActive = activeVideoId === videoKey;
                      const isDone = video.isCompleted;
                      const listTitle =
                        video.title ||
                        formatVideoListLabel(t?.videoNumber, index);

                      return (
                        <div
                          key={videoKey}
                          role={unlocked ? "button" : undefined}
                          tabIndex={unlocked ? 0 : -1}
                          onClick={() => unlocked && setActiveVideoId(videoKey)}
                          onKeyDown={(event) => {
                            if (!unlocked) return;
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setActiveVideoId(videoKey);
                            }
                          }}
                          aria-disabled={!unlocked}
                          className={`w-full text-right px-4 py-3 transition-all duration-300 ease-in-out rounded-md
                      bg-white my-1 shadow-sm border
                      ${
                        isDone
                          ? "border-emerald-200"
                          : isActive
                            ? " border-[#9F854E]/30"
                            : "border-transparent"
                      }
                       ${unlocked ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex shrink-0 items-center">
                              <span className="shrink-0 text-sm font-semibold tabular-nums me-4">
                                {index + 1}
                              </span>
                              {!unlocked ? (
                                <Image
                                  src="/assets/images/lock.svg"
                                  alt=""
                                  width={45}
                                  height={45}
                                  className="lightBgColor rounded-full"
                                />
                              ) : isDone ? (
                                <Image
                                  src="/assets/images/done.svg"
                                  alt=""
                                  width={45}
                                  height={45}
                                  className="lightBgColor rounded-full"
                                />
                              ) : (
                                <Image
                                  src="/assets/images/video-list.svg"
                                  alt=""
                                  width={45}
                                  height={45}
                                  className="lightBgColor rounded-full p-2.5"
                                />
                              )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-start">
                              {video.youtubeId ? (
                                <Image
                                  className="w-full shrink-0 lg:w-[150px] xl:w-[90px]"
                                  width={90}
                                  height={50}
                                  src={`https://img.youtube.com/vi/${stripYoutubeVideoId(video.youtubeId)}/mqdefault.jpg`}
                                  alt=""
                                />
                              ) : (
                                <Image
                                  src="/assets/images/video-list.svg"
                                  alt=""
                                  width={45}
                                  height={45}
                                  className="lightBgColor  shrink-0 rounded-full p-2.5 "
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`mt-3 text-sm font-medium leading-snug wrap-break-word md:mt-0 
                                    ${isActive ? "mainColor" : "text-gray-600"}`}
                                >
                                  {listTitle}
                                </p>
                                {/* if there video test */}
                                <div className="flex items-center justify-between gap-2">
                                  {renderVideoExamButton(video, {
                                    stopPropagation: true,
                                    className: "px-2 py-1",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Description / attachments tabs */}
              <div className="order-3 lg:order-0 lg:col-span-8 lg:row-start-2 rounded-2xl shadow-r-sm">
                <div className="mb-4 border-b border-[#efe7d8]">
                  <div className="items-center grid grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setActiveLessonTab("description")}
                      className={`pb-2 text-md font-semibold transition-colors px-4 py-4 cursor-pointer ${
                        activeLessonTab === "description"
                          ? "scoundColor border-b-2 border-[#9F854E] lightBgColor"
                          : "text-black bg-white"
                      }`}
                    >
                      {t?.descriptionTab}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLessonTab("files")}
                      className={`pb-2 text-md font-semibold transition-colors px-4 py-4 cursor-pointer ${
                        activeLessonTab === "files"
                          ? "scoundColor border-b-2 border-[#9F854E] lightBgColor"
                          : "text-black bg-white"
                      }`}
                    >
                      {t?.filesTab}
                    </button>
                  </div>
                </div>

                <div>
                  {activeLessonTab === "description" ? (
                    <p className="py-4 px-4 bg-white rounded-lg">
                      {lessonDescription || t?.noDescription}
                    </p>
                  ) : attachments.length === 0 ? (
                    <p className="py-4 px-4 bg-white rounded-lg text-sm text-gray-600">
                      {t?.noFiles}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {attachments.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between rounded-lg bg-white shadow-r-sm px-3 py-3"
                        >
                          <div className="flex items-center gap-1">
                            <Image
                              src="/assets/images/pdf.svg"
                              alt=""
                              width={40}
                              height={40}
                              className="lightBgColor rounded-md p-1.5"
                            />
                            <span className="text-sm">{resource.title}</span>
                          </div>

                          {resource.url ? (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                              download
                            >
                              <Image
                                src="/assets/images/download.svg"
                                alt=""
                                width={35}
                                height={35}
                                className="rounded-md p-1.5 border border-gray-200"
                              />
                            </a>
                          ) : (
                            <span className="cursor-default opacity-50">
                              <Image
                                src="/assets/images/download.svg"
                                alt=""
                                width={35}
                                height={35}
                                className="rounded-md p-1.5 border border-gray-200"
                              />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ExamModal
            open={examOpen}
            onOpenChange={(open) => {
              if (!open) resetExamState();
              else setExamOpen(true);
            }}
            exam={examData}
            loading={loadingExam}
            submitting={submittingExam}
            result={examResult}
            dir={dir}
            labels={examModalLabels}
            onSubmit={handleSubmitExam}
            onRetake={handleRetakeExam}
            onCloseResult={resetExamState}
          />
        </>
      )}
    </div>
  );
};

export default SingleLessonContent;
