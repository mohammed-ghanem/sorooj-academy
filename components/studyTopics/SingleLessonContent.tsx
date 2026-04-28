"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

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
  instructorName: string;
  videos: LessonVideo[];
  resources: string[];
};

const mockLessons: LessonData[] = [
  {
    id: 1,
    title: "الدرس الأول: أحكام السنة والظنون",
    subtitle: "تعرف على المفاهيم الأساسية وطرق الاستدلال",
    instructorName: "الأستاذ عمر الباكي",
    videos: [
      {
        id: "v1",
        title: "الفيديو الاول - أحكام السنة والظنون",
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
  {
    id: 2,
    title: "الدرس الثاني: دلالة الألفاظ",
    subtitle: "تفكيك المصطلحات وأثرها في الفهم الصحيح",
    instructorName: "الأستاذ عمر الباكي",
    videos: [
      {
        id: "v1",
        title: "مدخل الدرس",
        youtubeId: "M7lc1UVf-VE",
        duration: "11:05",
      },
      {
        id: "v2",
        title: "التقسيمات الرئيسية",
        youtubeId: "ysz5S6PUM-U",
        duration: "16:20",
      },
      {
        id: "v3",
        title: "أمثلة وتمارين",
        youtubeId: "aqz-KE-bpKQ",
        duration: "14:55",
      },
    ],
    resources: ["ملف PDF - تفريغ الدرس", "الواجب الأسبوعي"],
  },
];

const SingleLessonContent = () => {
  const { lang, topicId, contentId, lessonId } = useParams<{
    lang: string;
    topicId: string;
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

  const activeVideo =
    lesson.videos.find((video) => video.id === activeVideoId) ??
    lesson.videos[0];
  const progressPercent = Math.round(
    (completedVideoIds.length / lesson.videos.length) * 100,
  );

  const isVideoUnlocked = (index: number) => {
    if (index === 0) return true;
    const previousVideo = lesson.videos[index - 1];
    return completedVideoIds.includes(previousVideo.id);
  };

  const markAsCompleted = (videoId: string) => {
    setCompletedVideoIds((prev) => {
      if (prev.includes(videoId)) return prev;
      return [...prev, videoId];
    });
  };

  return (
    <div>
      <SmallHeroSection
        title={
          <div className="text-center mt-20">
            <Link
              href={`/${lang}/study-topics/${topicId}/content/${contentId}`}
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
            src="/assets/images/line-arrow-left.svg"
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
        <div className="container mx-auto w-[90%] grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* video screen */}
          <div className="lg:col-span-8 space-y-4 ">
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-r-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold mb-4">{lesson.title}</h2>
                </div>
              </div>

              <div className="relative w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold mainColor">
                  {activeVideo.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  علِّم الفيديو كمكتمل لفتح الفيديو التالي.
                </p>
                <button
                  type="button"
                  onClick={() => markAsCompleted(activeVideo.id)}
                  className="text-xs text-white bkMainColor px-4 py-2 rounded-md font-medium"
                >
                  تم إنهاء الفيديو
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-r-sm">
              <h4 className="text-sm font-semibold mainColor mb-3">
                مرفقات الدرس
              </h4>
              <div className="space-y-2">
                {lesson.resources.map((resource) => (
                  <div
                    key={resource}
                    className="flex items-center justify-between rounded-lg border border-[#efe7d8] px-3 py-2"
                  >
                    <span className="text-sm text-gray-600">{resource}</span>
                    <span className="text-xs scoundColor">⬇</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* video list */}
          <div className="lg:col-span-4  rounded-2xl shadow-r-sm overflow-hidden h-fit lg:order-1 order-2">
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
                      bg-white my-1 shadow-sm
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
                      <div className="flex items-center gap-2">
                        <Image
                          className="w-full lg:w-[150px] xl:w-[90px]"
                          width={90}
                          height={50}
                          src={`https://img.youtube.com/vi/${video.youtubeId.split("?")[0]}/mqdefault.jpg`}
                          alt=""
                        />
                        <div>
                          <p className="text-sm font-medium flex items-center gap-2 min-w-0">
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

                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`h-5 w-5 rounded border flex items-center justify-center text-[11px] shrink-0 ${
                            isDone
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-[#9F854E] text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleLessonContent;
