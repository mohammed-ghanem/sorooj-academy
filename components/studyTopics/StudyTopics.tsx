"use client";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection";
import TranslateHook from "@/translate/TranslateHook";
import book from "@/public/assets/images/book.svg";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";

const studyTopicCards = [
  {
    id: 1,
    title: "المحور الاول",
    progress: 100,
  },
  {
    id: 2,
    title: "المحور الثانى",
    progress: 40,
  },
  {
    id: 3,
    title: "المحور الثالث",
    progress: 0,
  },
  {
    id: 4,
    title: "المحور الرابع",
    progress: 0,
  },
];

const StudyTopics = () => {
  const translate = TranslateHook();

  const isLocked = (index: number) => {
    if (index === 0) return false;
    return studyTopicCards[index - 1].progress < 100;
  };

  return (
    <div>
      <div>
        <SmallHeroSection
          title={
            <h1 className="text-2xl font-semibold mt-28 mb-4">
              <span className="mainColor">
                {translate?.pages?.studyTopics?.title}
              </span>
              <span className="scoundColor">
                {translate?.pages?.studyTopics?.titleSpan}
              </span>
            </h1>
          }
        />
      </div>

      <div className=" bg-[#F6F6F6] px-2 pt-4 pb-16  md:pt-6 md:pb-20">
        {/* Cards */}

        <div
          className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-10 mt-20
            lg:grid-cols-4 gap-y-20 md:gap-y-16 lg:gap-y-8"
        >
          {studyTopicCards.map((item, index) => {
            const locked = isLocked(index);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 
      shadow-sm transition duration-300 text-center sm:text-right
      ${locked ? "opacity-50 pointer-events-none" : "hover:shadow-md"}`}
              >
                {/* Title + Number */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-l font-semibold mainColor">
                    {item.title}
                  </h2>
                  <span className="text-sm text-gray-400">0{item.id}</span>
                </div>

                {/* statistic */}
                <div className="flex justify-start">
                  <div className="flex">
                    <Image  src={book.src} width={18} height={18} alt="book" />
                    <p className="me-2 ms-2 descriptionColor">
                      <span className="me-0.5"> 
                        6 
                      </span>
                      <span>
                        مواد تعليمية
                      </span>
                    </p>
                  </div>
                  <div className="flex ms-1"> 
                    <Image src={lessons.src} width={18} height={18} alt="lessonscreen" />
                    <p className="me-2 ms-2 descriptionColor"> 
                      <span className="me-0.5"> 
                        32 
                      </span>
                      <span>
                         دروس
                      </span>
                    </p>
                  </div>
                </div>

                {/* description */}

                <p className="text-xs mt-2">
                  يعنى بدراسة مسائل الإيمان وأصول الاعتقاد وفق المنهج الصحيح.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 mt-3 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="h-full scoundBgColor transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                {/* Progress Text */}
                <div className="text-xs text-gray-500 mb-4">
                  {item.progress === 100
                    ? "مكتمل"
                    : item.progress > 0
                    ? ` انهيت ${item.progress} % من المحور`
                    : locked
                    ? "مغلق"
                    : "لم يبدأ"}
                </div>

                {/* Button */}
                <button
                    className={`text-sm font-medium ${
                    locked
                      ? "scoundColor cursor-not-allowed"
                      : "scoundColor hover:underline"
                    }`}
                    >
                    {locked
                    ? "مغلق"
                    : item.progress === 100
                    ? "مشاهدة ومراجعة"
                    : "ابدأ الدراسة ←"}
                    </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyTopics;
