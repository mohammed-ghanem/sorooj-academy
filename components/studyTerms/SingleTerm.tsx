"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import TranslateHook from "@/translate/TranslateHook";
import { getStudyTermById } from "@/lib/studyTerms/studyTermsData";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import card from "@/public/assets/images/card.jpg";

const SingleTerm = () => {
  const translate = TranslateHook();
  const { lang, termId } = useParams<{
    lang: string;
    termId: string;
  }>();

  const idNum = useMemo(
    () => (termId && !Number.isNaN(Number(termId)) ? Number(termId) : NaN),
    [termId],
  );
  const term = useMemo(
    () => (Number.isFinite(idNum) ? getStudyTermById(idNum) : undefined),
    [idNum],
  );

  const t = translate?.pages?.studyTermDetail;

  if (!term) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-lg mainColor font-medium mb-4">{t?.notFound}</p>
        <Link
          href={`/${lang}/study-terms`}
          className="text-sm scoundColor hover:underline"
        >
          {t?.back}
        </Link>
      </div>
    );
  }

  const topicCards = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    title: `${term.title} ${index + 1}`,
    description: term.description,
    materialsCount: term.materialsCount,
    lessonsCount: term.lessonsCount,
    progress: term.progress,
  }));

  return (
    <div>
      <div>
        <SmallHeroSection
          title={
            <div className="text-center w-full max-w-3xl">
              <Link
                href={`/${lang}/study-terms`}
                className="text-sm scoundColor hover:underline inline-block mb-2"
              >
                ← {t?.back}
              </Link>
              <h1 className="text-2xl font-semibold mt-2 mb-4">
                <span className="mainColor">
                  {String(term.id).padStart(2, "0")}.{" "}
                </span>
                <span className="scoundColor">{term.title}</span>
              </h1>
            </div>
          }
        />
      </div>

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-24">
        <div className="container mx-auto py-4 md:py-20 w-[80%] grid grid-cols-1 md:grid-cols-4 gap-6">
          {topicCards.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl sm:rounded-2xl  shadow-r-sm text-center sm:text-right 
              overflow-hidden pb-4"
            >
              <div className="mb-4 w-full h-40 relative">
                <Image
                  src={card.src}
                  fill
                  alt="test"
                  className="p-2.5 rounded-3xl"
                />
              </div>

              <div className="mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-md font-semibold mainColor">
                    نقض الاعتراضات بحجية السُّنَّة النبوية
                  </h2>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  تتناول المفاهيم الأساسية المتعلقة بحقيقة الإيمان وأركانه وأثره
                  في حياة المسلم.
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-1 mb-1">
                  <div className="flex items-center">
                    <Image src={lessons.src} width={20} height={20} alt="" />
                    <p className="me-2 ms-2 descriptionColor">
                      <span className="me-0.5">{item.lessonsCount}</span>
                      <span>درس</span>
                    </p>
                  </div>
                </div>
                <div className="m2-4 flex items-center justify-between">
                  <p className="text-sm mainColor font-semibold">التقدم</p>
                  <p className="text-xs text-gray-500">{item.progress}%</p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="h-full scoundBgColor transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <hr className="my-2" />
                <div className="text-end mt-4">
                  <Link
                    href={`/${lang}/study-terms/${termId}/content/${item.id}`}
                    className="text-sm text-white bkMainColor px-4 py-2 rounded-md font-medium "
                  >
                    ابدأ الدراسة
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleTerm;
