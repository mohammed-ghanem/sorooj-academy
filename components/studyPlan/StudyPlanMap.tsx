"use client";

import React from "react";
import Image from "next/image";
import bookPlan from "@/public/assets/images/bookPlan.svg";
import videoPlan from "@/public/assets/images/videoPlan.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StudyPlanMapSkeleton } from "@/components/skeletons/StudyPlanSkeleton";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import { useGetStudyProgramQuery } from "@/store/studyPlan/studyPlanApi";
import type { StudyProgramTerm } from "@/types/studyPlan";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

function StudyAxisCard({ axis }: { axis: StudyProgramTerm }) {
  return (
    <AccordionItem
      value={`axis-${axis.id}`}
      className="overflow-hidden rounded-2xl border-none bg-white p-5 shadow-sm sm:p-6"
    >
      <AccordionTrigger className="flex w-full items-start justify-between gap-3 py-0 text-start hover:no-underline [&>svg]:mt-1 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[#9F854E]">
        <div className="min-w-0 flex-1 text-start">
          <h3 className="text-xl font-bold mainColor">
            {axis.id}. {axis.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center justify-start gap-4">
            <div className="flex items-center gap-1.5">
              <Image src={bookPlan} width={20} height={20} alt="" />
              <span className="text-sm font-semibold scoundColor">
                {axis.subjectsCount} مواد
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Image src={videoPlan} width={20} height={20} alt="" />
              <span className="text-sm font-semibold scoundColor">
                {axis.lessonsCount} درس
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-0 pb-0">
        <hr className="my-5 border-[#efefef]" />
        <div className="divide-y divide-[#f0f0f0]">
          {axis.subjects.map((topic) => (
            <div
              key={topic.id}
              className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1 text-start">
                <p className="text-sm font-bold sm:text-base">
                  {topic.orderIndex} . {topic.name}
                </p>
                <ul className="mt-2 grid grid-cols-2 w-[80%] gap-y-1 text-start">
                  {topic.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="text-xs font-semibold descriptionColor before:ms-1 before:text-[#d4d4d4]"
                    >
                      <span className="text-xs font-semibold scoundColor before:ms-1 before:text-[#d4d4d4]">
                        •{" "}
                      </span>
                      <span className="text-xs font-semibold descriptionColor">
                        {lesson.title}{" "}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <span
                className="shrink-0 rounded-full bgTitleColor px-3 py-1.5 text-[11px]
               font-semibold scoundColor"
              >
                {topic.lessonsCount} درس
              </span>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

const StudyPlanMap = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const locale = lang === "en" ? "en" : "ar";
  const dir = locale === "en" ? "ltr" : "rtl";
  const labels = translate?.pages?.studyPlanPage;

  const {
    data: academicYears = [],
    isLoading,
    isUninitialized,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetStudyProgramQuery({ lang: locale });

  const showSkeleton =
    isUninitialized || isLoading || (isFetching && academicYears.length === 0);

  if (showSkeleton) {
    return <StudyPlanMapSkeleton dir={dir} />;
  }

  if (isError) {
    return (
      <div className="bg-[#F6F6F6] px-4 py-16 text-center">
        <p className="mb-4 text-lg font-medium mainColor">
          {extractApiErrorMessage(error, labels?.loadFailed ?? "")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="scoundBgColor rounded-lg px-4 py-2 text-sm text-white"
        >
          {labels?.retry ?? "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] pb-16 pt-8 md:pb-24 md:pt-12">
      {/* study plan map title */}
      <div>
        <h2 className="container mx-auto w-[92%] max-w-7xl px-2 pt-2 text-center text-3xl font-bold">
          <span className="mainColor">ماذا ستدرس </span>
          <span className="scoundColor">خلال البرنامج؟</span>
        </h2>
        <p className="descriptionColor mx-auto mt-4 max-w-3xl text-center text-base font-semibold">
          استكشف المحاور التعليمية والمواد التي تم إعدادها بعناية لتقديم تجربة
          تعليمية متكاملة.
        </p>
      </div>
      {/* study plan map content & subjects */}
      <div
        dir="rtl"
        className="container mx-auto mt-10 w-[92%] max-w-7xl px-2 md:mt-14"
      >
        <Accordion
          type="multiple"
          defaultValue={academicYears.map((year) => `year-${year.id}`)}
          className="space-y-6"
        >
          {academicYears.map((year) => (
            <AccordionItem
              key={year.id}
              value={`year-${year.id}`}
              className="border-none"
            >
              <AccordionTrigger
                className="justify-center gap-2 py-3 text-center text-xl font-bold
               hover:no-underline [&>svg]:size-5 [&>svg]:text-[#9F854E]"
              >
                <span>
                  <span className="text-xl scoundColor"> • </span>
                  <span className="text-xl"> {year.name} </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Accordion
                  type="multiple"
                  defaultValue={year.terms.map((axis) => `axis-${axis.id}`)}
                  className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
                >
                  {year.terms.map((axis) => (
                    <StudyAxisCard key={axis.id} axis={axis} />
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default StudyPlanMap;
