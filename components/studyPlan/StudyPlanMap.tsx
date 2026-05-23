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

type StudyTopic = {
  id: number;
  title: string;
  lessons: number;
  subtopics: [string, string];
};

type StudyAxis = {
  id: number;
  title: string;
  materialsCount: number;
  lessonsCount: number;
  topics: StudyTopic[];
};

type AcademicYear = {
  id: number;
  label: string;
  axes: StudyAxis[];
};

const axisTopics: StudyTopic[] = [
  {
    id: 1,
    title: "العقيدة الإسلامية",
    lessons: 2,
    subtopics: ["مدخل إلى العقيدة", "أنواع التوحيد"],
  },
  {
    id: 2,
    title: "التفسير وعلوم القرآن",
    lessons: 2,
    subtopics: ["مقدمة في التفسير", "أصول التفسير"],
  },
  {
    id: 3,
    title: "السيرة النبوية",
    lessons: 2,
    subtopics: ["مقدمة في السيرة", "مراحل الدعوة"],
  },
  {
    id: 4,
    title: "الفقه وأصوله",
    lessons: 2,
    subtopics: ["مقدمة في الفقه", "أصول الفقه"],
  },
  {
    id: 5,
    title: "الحديث وعلومه",
    lessons: 2,
    subtopics: ["مقدمة في الحديث", "علوم الحديث"],
  },
  {
    id: 6,
    title: "اللغة العربية",
    lessons: 2,
    subtopics: ["النحو والصرف", "البلاغة"],
  },
];

const academicYears: AcademicYear[] = [
  {
    id: 1,
    label: "العام الدراسي الأول",
    axes: [
      {
        id: 1,
        title: "المحور الأول",
        materialsCount: 8,
        lessonsCount: 40,
        topics: axisTopics,
      },
      {
        id: 2,
        title: "المحور الثاني",
        materialsCount: 8,
        lessonsCount: 40,
        topics: axisTopics,
      },
    ],
  },
  {
    id: 2,
    label: "العام الدراسي الثاني",
    axes: [
      {
        id: 3,
        title: "المحور الثالث",
        materialsCount: 8,
        lessonsCount: 40,
        topics: axisTopics,
      },
      {
        id: 4,
        title: "المحور الرابع",
        materialsCount: 8,
        lessonsCount: 40,
        topics: axisTopics,
      },
    ],
  },
];

function StudyAxisCard({ axis }: { axis: StudyAxis }) {
  return (
    <AccordionItem
      value={`axis-${axis.id}`}
      className="overflow-hidden rounded-2xl border-none bg-white p-5 shadow-sm sm:p-6"
    >
      <AccordionTrigger className="flex w-full items-start justify-between gap-3 py-0 text-start hover:no-underline [&>svg]:mt-1 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-[#9F854E]">
        <div className="min-w-0 flex-1 text-start">
          <h3 className="text-xl font-bold mainColor">
            {axis.id}. {axis.title}
          </h3>
          <div className="mt-3 flex flex-wrap items-center justify-start gap-4">
            <div className="flex items-center gap-1.5">
              <Image src={bookPlan} width={20} height={20} alt="" />
              <span className="text-sm font-semibold scoundColor">
                {axis.materialsCount} مواد
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
          {axis.topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1 text-start">
                <p className="text-sm font-bold sm:text-base">
                  {topic.id} . {topic.title}
                </p>
                <ul className="mt-2 grid grid-cols-2 w-[50%] gap-y-1 text-start">
                  {topic.subtopics.map((sub) => (
                    <li
                      key={sub}
                      className="text-xs font-semibold descriptionColor before:ms-1 before:text-[#d4d4d4]"
                    >
                      <span className="text-xs font-semibold scoundColor before:ms-1 before:text-[#d4d4d4]">
                        •{" "}
                      </span>
                      <span className="text-xs font-semibold descriptionColor">
                        {sub}{" "}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <span
                className="shrink-0 rounded-full bgTitleColor px-3 py-1.5 text-[11px]
               font-semibold scoundColor"
              >
                {topic.lessons} درس
              </span>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

const StudyPlanMap = () => {
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
          defaultValue={["year-1", "year-2"]}
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
                  <span className="text-xl"> {year.label} </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Accordion
                  type="multiple"
                  defaultValue={year.axes.map((axis) => `axis-${axis.id}`)}
                  className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
                >
                  {year.axes.map((axis) => (
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
