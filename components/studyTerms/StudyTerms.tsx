"use client";

import { useState, type MouseEvent } from "react";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection";
import TranslateHook from "@/translate/TranslateHook";
import book from "@/public/assets/images/book.svg";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetStudyTermsQuery } from "@/store/studyTerms/studyTermsApi";
import StudyTermsCardsSkeleton from "@/components/skeletons/StudyTermsCardsSkeleton";
import InfoModal from "@/components/modals/InfoModal";
import {
  hasAccessToken,
  isStudentEnrolledFromCookie,
} from "@/lib/auth/studentGate";

const StudyTerms = () => {
  const translate = TranslateHook();
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = langParam ?? "ar";

  const {
    data: studyTerms = [],
    isLoading,
    isError,
    refetch,
  } = useGetStudyTermsQuery({ lang });

  const td = translate?.pages?.studyTermDetail;
  const st = translate?.pages?.studyTerms;

  const lockedLabel = lang === "en" ? "Locked" : "مغلق";
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [gate, setGate] = useState<"login" | "enroll" | null>(null);

  function handleTermCardClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!hasAccessToken()) {
      e.preventDefault();
      setGate("login");
      return;
    }
    if (!isStudentEnrolledFromCookie()) {
      e.preventDefault();
      setGate("enroll");
      return;
    }
  }

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
        <div className="container mx-auto w-[90%] mt-20">
          {isLoading && <StudyTermsCardsSkeleton />}

          {!isLoading && isError && (
            <div
              className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-center text-sm text-red-800"
              role="alert"
            >
              <p className="mb-4 font-semibold">
                {translate?.pages?.signUp?.requestFailed}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="scoundBgColor rounded-lg px-4 py-2 text-white"
              >
                {lang === "ar" ? "إعادة المحاولة" : "Try again"}
              </button>
            </div>
          )}

          {!isLoading && !isError && studyTerms.length === 0 && (
            <p className="text-center text-sm text-gray-600">
              {lang === "ar"
                ? "لا توجد محاور متاحة حالياً."
                : "No study terms are available at the moment."}
            </p>
          )}

          {!isLoading && !isError && studyTerms.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 lg:grid-cols-4 gap-y-20 md:gap-y-16 lg:gap-y-8">
                {studyTerms.map((item) => {
                  const href = `/${lang}/study-terms/${item.id}`;
                  const cardClass = `block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 relative
      opacity-50 shadow-r-sm transition-shadow duration-300 text-center sm:text-right
      hover:shadow-md`;

                  const cta = (
                    <span className="text-sm font-medium scoundColor cursor-not-allowed">
                      {lockedLabel}
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
                          <Image
                            src={book.src}
                            width={18}
                            height={18}
                            alt="book"
                          />
                          <p className="me-2 ms-2 descriptionColor">
                            <span className="me-0.5">
                              {item.materialsCount}
                            </span>
                            <span>{td?.materials ?? "مواد تعليمية"}</span>
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
                            <span>{td?.lessons ?? "دروس"}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs mt-2">{item.shortDescription}</p>

                      <div className="w-full bg-gray-200 mt-3 rounded-full h-2 mb-3 overflow-hidden">
                        <div
                          className="h-full scoundBgColor transition-all duration-500"
                          style={{ width: "0%" }}
                        />
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        {lockedLabel}
                      </div>

                      {cta}
                    </>
                  );

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      onClick={handleTermCardClick}
                      className={`${cardClass} group`}
                      aria-label={item.title}
                    >
                      {body}
                    </Link>
                  );
                })}
              </div>

              <InfoModal
                open={gate === "login"}
                onOpenChange={(open) => {
                  if (!open) setGate(null);
                }}
                title={st?.gateLoginTitle ?? ""}
                description={st?.gateLoginDescription}
                primaryLabel={st?.gateLoginAction ?? ""}
                primaryHref={`/${lang}/login`}
                secondaryLabel={st?.gateClose ?? ""}
                dir={dir}
              />

              <InfoModal
                open={gate === "enroll"}
                onOpenChange={(open) => {
                  if (!open) setGate(null);
                }}
                title={st?.gateEnrollTitle ?? ""}
                description={st?.gateEnrollDescription}
                primaryLabel={st?.gateEnrollAction ?? ""}
                primaryHref={`/${lang}/contact-us`}
                secondaryLabel={st?.gateClose ?? ""}
                dir={dir}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTerms;
