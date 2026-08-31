import React from "react";
import Image from "next/image";
import arrowPlan from "@/public/assets/images/arrowPlan.svg";
import calendar from "@/public/assets/images/calender.svg";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection";
import {
  formatGregorianDate,
  formatHijriDate,
  type StudyPlanLocale,
} from "@/lib/studyPlan/formatStudyPlanDates";
import type {
  StudyPlan,
  StudyPlanDateRange,
} from "@/types/studyPlan";

type DateEntry = {
  hijri: string;
  gregorian: string;
};

type TimelineColumn = {
  label: string;
  dates: DateEntry[];
};

type StudyPlanCardData = {
  id: number;
  step: string;
  title: string;
  description: string;
  columns?: TimelineColumn[];
};

type StudyPlanLabels = {
  heroTitle?: string;
  heroTitleSpan?: string;
  heading?: string;
  headingSpan?: string;
  intro?: string;
  enrollmentTitle?: string;
  enrollmentDescription?: string;
  enrollmentLabel?: string;
  academicTitle?: string;
  academicDescription?: string;
  makeupTitle?: string;
  makeupDescription?: string;
  yearOne?: string;
  yearTwo?: string;
  yearN?: string;
};

type StudyPlanDateProps = {
  studyPlan: StudyPlan;
  locale?: StudyPlanLocale;
  labels?: StudyPlanLabels;
};

function rangeToDates(
  range: StudyPlanDateRange | null | undefined,
  locale: StudyPlanLocale,
): DateEntry[] {
  if (!range) return [];

  const start: DateEntry = {
    gregorian: range.startDate
      ? formatGregorianDate(range.startDate, locale)
      : "",
    hijri: range.startDateHijri
      ? formatHijriDate(range.startDateHijri, locale)
      : "",
  };
  const end: DateEntry = {
    gregorian: range.endDate ? formatGregorianDate(range.endDate, locale) : "",
    hijri: range.endDateHijri ? formatHijriDate(range.endDateHijri, locale) : "",
  };

  return [start, end].filter((item) => item.gregorian || item.hijri);
}

function yearLabel(n: number, labels?: StudyPlanLabels): string {
  if (n === 1) return labels?.yearOne ?? "العام الأول";
  if (n === 2) return labels?.yearTwo ?? "العام الثاني";
  return (labels?.yearN ?? "العام {n}").replace("{n}", String(n));
}

function buildStudyPlanCards(
  studyPlan: StudyPlan,
  locale: StudyPlanLocale,
  labels?: StudyPlanLabels,
): StudyPlanCardData[] {
  return [
    {
      id: 1,
      step: "٠١",
      title: labels?.enrollmentTitle ?? "فترة الالتحاق بالبرنامج",
      description:
        labels?.enrollmentDescription ??
        "ابدأ رحلتك التعليمية بإتمام التسجيل والانضمام للموسم الدراسي الجديد.",
      columns: [
        {
          label: labels?.enrollmentLabel ?? "فترة التسجيل",
          dates: rangeToDates(studyPlan.enrollment, locale),
        },
      ],
    },
    {
      id: 2,
      step: "٠٢",
      title: labels?.academicTitle ?? "فترة التعلّم الأكاديمي",
      description:
        labels?.academicDescription ??
        "خلال هذه المرحلة تتم دراسة المواد العلمية وحضور المحتوى التعليمي والأنشطة التفاعلية.",
      columns: studyPlan.academicYears.map((year) => ({
        label: yearLabel(year.sequence, labels),
        dates: rangeToDates(year, locale),
      })),
    },
    {
      id: 3,
      step: "٠٣",
      title: labels?.makeupTitle ?? "امتحانات الدور الثاني",
      description:
        labels?.makeupDescription ??
        "فرصة نهائية تتيح للطالب إعادة الاختبار النهائي في حال عدم اجتيازه في المرة الأولى، وفق ضوابط محددة.",
      columns: studyPlan.makeupExamPeriods.map((period) => ({
        label: yearLabel(period.programYear, labels),
        dates: rangeToDates(period, locale),
      })),
    },
  ];
}

function stepStaggerClass(index: number) {
  if (index === 1) return "xl:mt-3";
  if (index === 2) return "xl:mt-18";
  return "";
}

function DateTimeline({ dates }: { dates: DateEntry[] }) {
  return (
    <div className="flex  items-stretch gap-3">
      <div className="flex shrink-0 flex-col items-center">
        {dates.map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(66,76,97,0.08)]">
              <Image src={calendar} alt="calendar" width={20} height={20} />
            </div>
            {index < dates.length - 1 && (
              <div className="min-h-10 w-px border-r border-dashed border-[#d4d4d4]" />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-between py-0.5 ">
        {dates.map((date, index) => (
          <div
            key={`${date.gregorian}-${date.hijri}-${index}`}
            className="py-2 first:pt-0 last:pb-0"
          >
            <p className="mt-0.5 text-base font-semibold mainColor">
              {date.gregorian}
            </p>
            <p className="text-xs font-semibold leading-snug descriptionColor">
              {date.hijri}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudyPlanArrow() {
  return (
    <div
      className="pointer-events-none mb-2 hidden min-h-9 w-full shrink-0 items-end justify-start lg:flex"
      aria-hidden
    >
      <Image
        src={arrowPlan}
        alt=""
        width={201}
        height={36}
        className="h-9 w-auto max-w-full object-contain object-right"
      />
    </div>
  );
}

function StudyPlanCard({ card }: { card: StudyPlanCardData }) {
  return (
    <article className="lightBgColor flex min-w-0 flex-1 flex-col rounded-2xl p-5 shadow-sm sm:p-6">
      <div className="relative mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold leading-snug mainColor sm:text-lg">
          {card.title}
        </h3>
        <span className="text-3xl font-semibold scoundColor opacity-90">
          {card.step}
        </span>
      </div>

      <p className="text-xs font-semibold leading-relaxed descriptionColor sm:text-sm">
        {card.description}
      </p>

      {card.columns && card.columns.length > 0 ? (
        <div
          className={`mt-5 grid gap-4 border-t border-[#e8e4dc]/80 pt-5 sm:gap-6 ${
            card.columns.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {card.columns.map((column) => (
            <div key={column.label}>
              <p className="mb-3 text-xs font-bold scoundColor">
                {column.label}
              </p>
              <DateTimeline dates={column.dates} />
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function StudyPlanStep({
  card,
  index,
}: {
  card: StudyPlanCardData;
  index: number;
}) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col ${stepStaggerClass(index)}`}>
      {index > 0 ? <StudyPlanArrow /> : null}
      <StudyPlanCard card={card} />
    </div>
  );
}

const StudyPlanDate = ({
  studyPlan,
  locale = "ar",
  labels,
}: StudyPlanDateProps) => {
  const cards = buildStudyPlanCards(studyPlan, locale, labels);

  return (
    <div>
      <SmallHeroSection
        title={
          <h1 className="mb-4 mt-28 text-2xl font-semibold">
            <span className="mainColor">{labels?.heroTitle ?? "الخطة "}</span>
            <span className="scoundColor">
              {labels?.heroTitleSpan ?? "الدراسية"}
            </span>
          </h1>
        }
      />
      <div className="container mx-auto mt-5 w-[92%] max-w-7xl px-2 pt-4 pb-8 md:pt-6 md:pb-10">
        <h1 className="text-center text-2xl font-bold">
          <span className="mainColor">
            {labels?.heading ?? "رحلتك العلمية تبدأ"}
          </span>
          <span className="scoundColor">
            {labels?.headingSpan ?? " بخطوات واضحة "}
          </span>
        </h1>
        <p className="descriptionColor mt-4 text-center text-base font-semibold">
          {labels?.intro ??
            "برنامج أكاديمي متدرّج يمتد عبر أربعة فصول دراسية، يجمع بين التأصيل الشرعي والتعلّم التفاعلي ضمن مسار واضح ومنظم."}
        </p>
      </div>
      <div className="container mx-auto w-[92%] max-w-7xl px-2 pb-16 md:pb-20">
        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:gap-5 xl:gap-6">
          {cards.map((card, index) => (
            <StudyPlanStep key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanDate;
