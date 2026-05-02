"use client";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection";
import TranslateHook from "@/translate/TranslateHook";
import {
  isTermLockedByIndex,
  studyTerms,
} from "@/lib/studyTerms/studyTermsData";
import book from "@/public/assets/images/book.svg";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const StudyTerms = () => {
  const translate = TranslateHook();
  const { lang } = useParams<{ lang: string }>();

  const isLocked = (index: number) => isTermLockedByIndex(studyTerms, index);

  return (
    <div>
      <div>
        <SmallHeroSection
          title={
            <h1 className="text-2xl font-semibold mt-28 mb-4">
              <span className="mainColor">
                {translate?.pages?.studyTerms?.title}
              </span>
              <span className="scoundColor">
                {translate?.pages?.studyTerms?.titleSpan}
              </span>
            </h1>
          }
        />
      </div>

      <div className=" bg-[#F6F6F6] px-2 pt-4 pb-16  md:pt-6 md:pb-70">
        {/* Cards */}

        <div
          className="container mx-auto w-[90%] grid grid-cols-1 sm:grid-cols-2 gap-x-10 mt-20
            lg:grid-cols-4 gap-y-20 md:gap-y-16 lg:gap-y-8"
        >
          {studyTerms.map((item, index) => {
            const locked = isLocked(index);
            const href = `/${lang}/study-terms/${item.id}`;
            const cardClass = `block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 relative
      shadow-r-sm transition duration-300 text-center sm:text-right
      ${locked ? "opacity-50 pointer-events-none" : "hover:shadow-md"}`;

            const cta = (
              <span
                className={`text-sm font-medium ${
                  locked
                    ? "scoundColor cursor-not-allowed"
                    : "scoundColor group-hover:underline"
                }`}
              >
                {locked
                  ? "مغلق"
                  : item.progress === 100
                    ? "مشاهدة ومراجعة"
                    : "ابدأ الدراسة ←"}
              </span>
            );

            const body = (
              <>
                <div className="flex justify-between items-center mb-8 md:mb-4">
                  <h2 className="text-lg md:text-l font-semibold mainColor">
                    {item.title}
                  </h2>
                  <div>
                    <span
                      className="bg-[#F6F6F6] text-[#c6a96aad] text-3xl px-6 py-4 
                  rounded-br-xl font-bold absolute top-0 left-0"
                    >
                      {String(item.id).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="flex">
                    <Image src={book.src} width={18} height={18} alt="book" />
                    <p className="me-2 ms-2 descriptionColor">
                      <span className="me-0.5">{item.materialsCount}</span>
                      <span>مواد تعليمية</span>
                    </p>
                  </div>
                  <div className="flex ms-4">
                    <Image
                      src={lessons.src}
                      width={18}
                      height={18}
                      alt="lessonscreen"
                    />
                    <p className="me-2 ms-2 descriptionColor">
                      <span className="me-0.5">{item.lessonsCount}</span>
                      <span>دروس</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs mt-2">{item.shortDescription}</p>

                <div className="w-full bg-gray-200 mt-3 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="h-full scoundBgColor transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  {item.progress === 100
                    ? "مكتمل"
                    : item.progress > 0
                      ? ` انهيت ${item.progress} % من المستوى`
                      : locked
                        ? "مغلق"
                        : "لم يبدأ"}
                </div>

                {cta}
              </>
            );

            if (locked) {
              return (
                <div key={item.id} className={cardClass}>
                  {body}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={href}
                className={`${cardClass} group`}
                aria-label={item.title}
              >
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyTerms;
