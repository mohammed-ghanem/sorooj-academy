"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import card from "@/public/assets/images/card.jpg";
import exams from "@/public/assets/images/exam.svg";
import level from "@/public/assets/images/level.svg";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const testLessons = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: `الدرس ${index + 1}`,
  duration: "45 دقيقة",
  status: index < 2 ? "مكتمل" : "لم يبدأ",
}));

const TopicContent = () => {
  const { lang, topicId, contentId } = useParams<{
    lang: string;
    topicId: string;
    contentId: string;
  }>();

  return (
    <div>
      <SmallHeroSection
        title={
          <div className="text-center mt-20">
            <Link
              href={`/${lang}/study-topics/${topicId}`}
              className="text-sm scoundColor hover:underline inline-block mb-2"
            >
              ← رجوع لتفاصيل المحور
            </Link>
            <h1 className="text-2xl font-semibold mt-2 mb-4">
              <span className="mainColor">محتوى المادة </span>
              <span className="scoundColor">#{contentId}</span>
            </h1>
          </div>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-24">
        <div className="container mx-auto w-[90%] grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-6 shadow-r-sm">
            <div className=" mb-4">
              <h3 className="text-lg font-semibold mainColor">
                نقض الاعتراضات بحجية السُّنَّة النبوية
              </h3>
              <p className="text-sm text-gray-500 w-[80%] my-4">
                تتناول هذه المادة بشكل موسع المفاهيم الأساسية المتعلقة بحقيقة
                الإيمان وأركانه، كما تستعرض تأثيره العميق في حياة المسلم
                اليومية. سنناقش كيف يساهم الإيمان في تشكيل القيم والسلوكيات،
                ويعزز من الروابط الاجتماعية والأخلاقية بين الأفراد.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {testLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-xl border border-gray-100 bg-[#fafafa] p-4"
                >
                  <div className="flex items-center justify-between mb-2 ">
                    <div className="relative">
                      <span className="text-xl py-2 px-3 scoundColor font-semibold bg-[#efece7] rounded-md">
                        {String(lesson.id).padStart(2, "0")}
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
                        الدرس الأول
                      </h4>
                      <span className="text-[10px] px-3 py-1.5  scoundColor  bg-[#efece7] rounded-3xl">
                        مكتمل
                      </span>
                    </div>
                    <h5 className="text-xs text-gray-500 mb-3">
                      عنوان الدرس الاول
                    </h5>
                  </div>
                  <hr className="my-3" />
                  <div className="flex  justify-between items-center">
                    <div className="flex items-center border-b border-[#9f854e] pb-2">
                      <button className="text-xs font-semibold scoundColor rounded-md">
                        ابدأ الدراسة
                      </button>
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
                          <span className="me-0.5">8</span>
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
                          <span className="me-0.5">8</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Image
                          src="/assets/images/audio.svg"
                          width={16}
                          height={16}
                          alt=""
                        />
                        <p className="mx-1 descriptionColor">
                          <span className="me-0.5">8</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* details of the topic */}

          <div className="lg:col-span-4 w-[95%] mx-auto bg-white rounded-2xl p-4 shadow-r-sm h-fit">
            <div className="relative w-full h-56 mb-4">
              <Image
                src={card.src}
                alt="topic-cover"
                fill
                className="rounded-xl"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mainColor mb-2">
                تفاصيل المادة
              </h2>
              <hr className="my-2" />
            </div>

            <h3 className="text-lg font-semibold mainColor mb-2">
              نقض الاعتراضات بحجية السُّنَّة النبوية
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src={lessons.src} width={18} height={18} alt="" />
                  <span className="descriptionColor">عدد الدروس</span>
                </div>
                <span className="mainColor font-semibold">
                  {testLessons.length}
                </span>
              </div>
              <div className="flex items-center justify-between my-4">
                <div className="flex items-center gap-2">
                  <Image src={exams.src} width={18} height={18} alt="" />
                  <span className="descriptionColor">عدد الاختبارات</span>
                </div>
                <span className="mainColor font-semibold">6</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src={level.src} width={18} height={18} alt="" />
                  <span className="descriptionColor">التقدم</span>
                </div>
                <span className="mainColor font-semibold">
                  <span className="me-0.5">40%</span>
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-3">
              <div
                className="h-full scoundBgColor transition-all duration-500"
                style={{ width: "40%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicContent;
