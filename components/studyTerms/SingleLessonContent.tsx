"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";

type LessonVideo = {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
};

type LessonData = {
  id: number;
  title: string;
  subtitle: string;
  description: string;

  videos: LessonVideo[];
  resources: string[];
};

/** YouTube IDs in data may include `?si=...`; embed/thumbnail URLs need the bare 11-char id. */
const stripYoutubeVideoId = (youtubeId: string) => youtubeId.split("?")[0];

const mockLessons: LessonData[] = [
  {
    id: 1,
    title: "الدرس الأول: أحكام السنة والظنون",
    subtitle: "تعرف على المفاهيم الأساسية وطرق الاستدلال",
    description:
      "في هذا الدرس سنتعرف على أهم مفاهيم السنة والظنون، وكيفية التعامل مع الاعتراضات المرتبطة بحجية السنة النبوية من خلال أمثلة تطبيقية وشرح مبسط يساعد على ترسيخ الفهم.",
    videos: [
      {
        id: "v1",
        title: "الفيديو الاول -أحكام السنة أحكام السنة والظنون",
        youtubeId: "hV2KTrcAuXo?si",
        duration: "15:30",
      },
      {
        id: "v2",
        title: "الفيديو الثانى",
        youtubeId: "nP8oxHZfcAI?si",
        duration: "12:45",
      },
      {
        id: "v3",
        title: "الفيديو الثالث",
        youtubeId: "UGKM8mqd1Uc?si",
        duration: "18:10",
      },
    ],
    resources: ["ملف PDF - ملخص الدرس", "ورقة عمل", "اختبار قصير"],
  },
  
];

const SingleLessonContent = () => {
  const { lang, termId, contentId, lessonId } = useParams<{ 
    lang: string;
    termId: string;
    contentId: string;
    lessonId: string;
  }>();

  const lesson = useMemo(() => {
    const parsedId = Number(lessonId);
    if (Number.isNaN(parsedId)) return mockLessons[0];
    return mockLessons.find((item) => item.id === parsedId) ?? mockLessons[0];
  }, [lessonId]);

  const [activeVideoId, setActiveVideoId] = useState(lesson.videos[0].id);
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [activeLessonTab, setActiveLessonTab] = useState<
    "description" | "files"
  >("description");

  useEffect(() => {
    setActiveVideoId(lesson.videos[0]?.id ?? "");
    setCompletedVideoIds([]);
  }, [lesson.id]);

  const activeVideo =
    lesson.videos.find((video) => video.id === activeVideoId) ??
    lesson.videos[0];
  const progressPercent = Math.round(
    (completedVideoIds.length / lesson.videos.length) * 100,
  );

  const activeVideoCompleted = completedVideoIds.includes(activeVideo.id);

  const isVideoUnlocked = (index: number) => {
    if (index === 0) return true;
    const previousVideo = lesson.videos[index - 1];
    return completedVideoIds.includes(previousVideo.id);
  };

  const handleWatchComplete = (videoId: string) => {
    setCompletedVideoIds((prev) => {
      if (prev.includes(videoId)) return prev;
      return [...prev, videoId];
    });

    const currentIndex = lesson.videos.findIndex((v) => v.id === videoId);
    const next = lesson.videos[currentIndex + 1];
    if (next) {
      setActiveVideoId(next.id);
    }
  };

  return (
    <div>
      <SmallHeroSection
        title={
          <div className="text-center mt-20">
            <Link
              href={`/${lang}/study-terms/${termId}/content/${contentId}`}
              className="text-sm scoundColor hover:underline inline-block mb-2"
            >
              ← رجوع إلى محتوى المادة
            </Link>
            <h1 className="text-2xl font-semibold mt-2 mb-1 mainColor">
              {lesson.title}
            </h1>
          </div>
        }
      />

      {/* head lessson  */}

      <div className="bg-white container w-[90%] mx-auto py-10">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/arrowLeft.svg"
            alt=""
            width={20}
            height={20}
          />
          <h1 className="text-xl font-semibold mainColor">
            نقض الاعتراضات بحجية السُّنَّة النبوية
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold descriptionColor mt-2">
            فضيلة الشيخ الدكتور راشد بن صليهم الهاجرى{" "}
          </h2>
        </div>
      </div>

      {/* lesson content */}

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-14 md:pb-24">
        <div className="container mx-auto w-[90%] grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* video screen — on small screens stacks above playlist, then tabs below */}
          <div className="order-1 lg:order-0 lg:col-span-8 lg:row-start-1">
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-r-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center justify-between mb-4 w-full">
                  <h2 className="text-lg font-semibold">{lesson.title}</h2>
                  <p
                    className={`text-xs font-semibold ${
                      activeVideoCompleted ? "scoundColor" : "text-gray-500"
                    }`}
                  >
                    {activeVideoCompleted ? "مكتمل" : "غير مكتمل"}
                  </p>
                </div>
              </div>

              <div className="relative w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  key={activeVideo.id}
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${stripYoutubeVideoId(activeVideo.youtubeId)}?rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              {!activeVideoCompleted && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    اذا اتممت مشاهدة الدرس اضغط علي زر اتممت المشاهدة للانتقال
                    الي الدرس التالي
                  </p>
                  <button
                    type="button"
                    onClick={() => handleWatchComplete(activeVideo.id)}
                    className="text-[13px] text-white bkMainColor px-4 py-2 mt-2.5 rounded-md font-medium
                   flex items-center gap-1"
                  >
                    <span>اتممت المشاهدة</span>
                    <Check size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* video list */}
          <div className="order-2 lg:order-0 lg:col-span-4 lg:row-span-2 lg:row-start-1 lg:col-start-9 rounded-2xl shadow-r-sm overflow-hidden h-fit">
            <div className="px-4 py-4 mb-4 bg-[#faf7f1]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold mainColor">
                  التقدم الكلي
                </h3>
                <span className="text-xs scoundColor font-semibold">
                  {completedVideoIds.length}/{lesson.videos.length}
                </span>
              </div>
              <div className="w-full h-2 bg-[#ece7db] rounded-full overflow-hidden">
                <div
                  className="h-full scoundBgColor transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="max-h-[560px] overflow-y-auto">
              {lesson.videos.map((video, index) => {
                const unlocked = isVideoUnlocked(index);
                const isActive = activeVideoId === video.id;
                const isDone = completedVideoIds.includes(video.id);

                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => unlocked && setActiveVideoId(video.id)}
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
                    <div className="flex items-center gap-3">
                      <div className="flex items-center ">
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
                      <div className="block md:flex items-center gap-2">
                        <Image
                          className="w-full  lg:w-[150px] xl:w-[90px]"
                          width={90}
                          height={50}
                          src={`https://img.youtube.com/vi/${stripYoutubeVideoId(video.youtubeId)}/mqdefault.jpg`}
                          alt=""
                        />
                        <div>
                          <p className="text-sm mt-3 md:mt-0 font-medium flex items-center gap-2 min-w-0">
                            <span
                              className={`truncate ${
                                isActive ? "mainColor" : "text-gray-600"
                              }`}
                            >
                              {video.title}
                            </span>
                          </p>
                          <span className="text-xs text-gray-500">
                            description
                          </span>
                        </div>
                      </div>

                      {/* <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`h-5 w-5 rounded border flex items-center justify-center text-[11px] shrink-0 ${
                            isDone
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-[#9F854E] text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </div> */}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* lesson description and files */}
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
                  وصف الدرس
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
                  الملفات المرفقة
                </button>
              </div>
            </div>

            <div>
              {activeLessonTab === "description" ? (
                <p className="py-4 px-4 bg-white rounded-lg">
                  {lesson.description}
                </p>
              ) : (
                <div className="space-y-2">
                  {lesson.resources.map((resource) => (
                    <div
                      key={resource}
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
                        <span className="text-sm">{resource}</span>
                      </div>

                      <span className="cursor-pointer">
                        <Image
                          src="/assets/images/download.svg"
                          alt=""
                          width={35}
                          height={35}
                          className="rounded-md p-1.5 border border-gray-200"
                        />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleLessonContent;
