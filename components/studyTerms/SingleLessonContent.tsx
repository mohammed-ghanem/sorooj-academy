"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SingleLessonContentSkeleton, {
  SingleLessonHeroTitleSkeleton,
} from "@/components/skeletons/SingleLessonContentSkeleton";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import { useGetLessonDetailQuery } from "@/store/lessons/lessonsApi";
import type { StudyLessonVideo } from "@/types/studyLessonDetail";
import TranslateHook from "@/translate/TranslateHook";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";

const FALLBACK_DOCTOR_AVATAR = "/assets/images/dd.png";

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

const SingleLessonContent = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.lessonDetail;

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
    isLoading,
    isFetching,
    isError,
    isUninitialized,
    refetch,
  } = useGetLessonDetailQuery(
    { id: lessonId ?? "", lang: lang ?? "ar" },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const showSkeleton =
    !invalidId &&
    (!apiReady ||
      isUninitialized ||
      isLoading ||
      isFetching ||
      (!lesson && !isError));
  const showError = !invalidId && !showSkeleton && (isError || !lesson);

  const [activeVideoId, setActiveVideoId] = useState("");
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [activeLessonTab, setActiveLessonTab] = useState<
    "description" | "files"
  >("description");

  // Sync playlist selection when lesson payload arrives
  useEffect(() => {
    if (!lesson) return;
    const list = lesson.videos;
    const firstId = list[0] ? String(list[0].id) : "";
    setActiveVideoId(firstId);
    setCompletedVideoIds(
      list.filter((v) => v.isWatchCompleted).map((v) => String(v.id)),
    );
  }, [lesson]);

  const videos = lesson?.videos ?? [];
  const attachments = lesson?.attachments ?? [];
  const activeVideo =
    videos.find((video) => String(video.id) === activeVideoId) ?? videos[0];
  const activePlayback = getVideoPlayback(activeVideo);
  const progressPercent =
    videos.length > 0
      ? Math.round((completedVideoIds.length / videos.length) * 100)
      : 0;
  const activeVideoCompleted = activeVideo
    ? completedVideoIds.includes(String(activeVideo.id))
    : false;

  const lessonDescription =
    lesson?.content?.trim() || lesson?.briefContent?.trim() || "";

  const heroTitle =
    lesson?.lessonNumber && lesson?.title
      ? `${lesson.lessonNumber}: ${lesson.title}`
      : (lesson?.title ?? "");

  /** Sequential unlock: next video opens after marking previous complete. */
  const isVideoUnlocked = (index: number) => {
    if (index === 0) return true;
    const previousVideo = videos[index - 1];
    return completedVideoIds.includes(String(previousVideo.id));
  };

  const handleWatchComplete = (videoId: string) => {
    setCompletedVideoIds((prev) =>
      prev.includes(videoId) ? prev : [...prev, videoId],
    );
    const currentIndex = videos.findIndex((v) => String(v.id) === videoId);
    const next = videos[currentIndex + 1];
    if (next) setActiveVideoId(String(next.id));
  };

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
              href={subjectContentHref}
              className="text-sm scoundColor hover:underline self-center"
            >
              {t?.back}
            </Link>
          </div>
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
                    src={lesson.doctorImage || FALLBACK_DOCTOR_AVATAR}
                    alt={lesson.doctorName}
                    fill
                    className="object-cover"
                    sizes="44px"
                    unoptimized={Boolean(
                      lesson.doctorImage &&
                        lesson.doctorImage !== FALLBACK_DOCTOR_AVATAR,
                    )}
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
                      {activeVideo ? (
                        <p
                          className={`text-xs font-semibold ${
                            activeVideoCompleted
                              ? "scoundColor"
                              : "text-gray-500"
                          }`}
                        >
                          {activeVideoCompleted
                            ? t?.completed
                            : t?.notCompleted}
                        </p>
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

                  {activeVideo && !activeVideoCompleted && activePlayback ? (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">
                        {t?.watchCompleteHint}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleWatchComplete(String(activeVideo.id))
                        }
                        className="text-[13px] text-white bkMainColor px-4 py-2 mt-2.5 rounded-md font-medium flex items-center gap-1"
                      >
                        <span>{t?.watchComplete}</span>
                        <Check size={16} />
                      </button>
                    </div>
                  ) : null}
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
                      {completedVideoIds.length}/{videos.length}
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
                      const unlocked = isVideoUnlocked(index);
                      const isActive = activeVideoId === videoKey;
                      const isDone = completedVideoIds.includes(videoKey);
                      const listTitle =
                        video.title ||
                        formatVideoListLabel(t?.videoNumber, index);

                      return (
                        <button
                          key={videoKey}
                          type="button"
                          onClick={() => unlocked && setActiveVideoId(videoKey)}
                          disabled={!unlocked}
                          className={`w-full text-right px-4 py-3 transition-all duration-300 ease-in-out rounded-md
                      bg-white my-1 shadow-sm border
                      ${
                        isDone
                          ? "border-emerald-200"
                          : isActive
                            ? " border-[#9F854E]/30"
                            : "border-transparent"
                      }
                       ${!unlocked ? "opacity-60 cursor-not-allowed" : ""}`}
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
                                  className="lightBgColor w-full shrink-0 rounded-full p-2.5 lg:w-[90px]"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`mt-3 text-sm font-medium leading-snug wrap-break-word md:mt-0 ${
                                    isActive ? "mainColor" : "text-gray-600"
                                  }`}
                                >
                                  {listTitle}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {video.briefContent ||
                                    video.duration ||
                                    t?.videoFallback}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
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
        </>
      )}
    </div>
  );
};

export default SingleLessonContent;
