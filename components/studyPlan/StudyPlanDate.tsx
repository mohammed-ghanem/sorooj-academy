import React from "react";
import Image from "next/image";
import arrowPlan from "@/public/assets/images/arrowPlan.svg";
import calendar from "@/public/assets/images/calender.svg";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection";

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

const studyPlanCards: StudyPlanCardData[] = [
  {
    id: 1,
    step: "٠١",
    title: "فترة الالتحاق بالبرنامج",
    description:
      "ابدأ رحلتك التعليمية بإتمام التسجيل والانضمام للموسم الدراسي الجديد.",
    columns: [
      {
        label: "فترة التسجيل",
        dates: [
          { hijri: "٢٧ ذو القعدة ١٤٤٧ هـ", gregorian: "14 مايو 2026" },
          { hijri: "٢٩ ربيع الأول ١٤٤٨ هـ", gregorian: "10 سبتمبر 2026" },
        ],
      },
    ],
  },
  {
    id: 2,
    step: "٠٢",
    title: "فترة التعلّم الأكاديمي",
    description:
      "خلال هذه المرحلة تتم دراسة المواد العلمية وحضور المحتوى التعليمي والأنشطة التفاعلية.",
    columns: [
      {
        label: "العام الأول",
        dates: [
          { hijri: "١ ربيع الآخر ١٤٤٨ هـ", gregorian: "12 سبتمبر 2026" },
          { hijri: "٢٥ ذو الحجة ١٤٤٨ هـ", gregorian: "31 مايو 2027" },
        ],
      },
      {
        label: "العام الثاني",
        dates: [
          { hijri: "١١ ربيع الآخر ١٤٤٩", gregorian: "11 سبتمبر 2027" },
          { hijri: "٧ محرم ١٤٥٠", gregorian: "31 مايو 2028" },
        ],
      },
    ],
  },
  {
    id: 3,
    step: "٠٣",
    title: "امتحانات الدور الثاني",
    description:
      "فرصة نهائية تتيح للطالب إعادة الاختبار النهائي في حال عدم اجتيازه في المرة الأولى، وفق ضوابط محددة.",
    columns: [
      {
        label: "العام الأول",
        dates: [
          { hijri: "٢٧ محرم ١٤٤٩ هـ", gregorian: "1 يوليو 2027" },
          { hijri: "٢٧ صفر ١٤٤٩ هـ", gregorian: "31 يوليو 2027" },
        ],
      },
      {
        label: "العام الثاني",
        dates: [
          { hijri: "٩ صفر ١٤٥٠ هـ", gregorian: "1 يوليو 2028" },
          { hijri: "٩ ربيع الأول ١٤٥٠ هـ", gregorian: "31 يوليو 2028" },
        ],
      },
    ],
  },
];

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
        {dates.map((date) => (
          <div key={date.hijri} className="py-2 first:pt-0 last:pb-0">
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

      {card.columns ? (
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

const StudyPlanDate = () => {
  return (
    <div>
      <SmallHeroSection
        title={
          <h1 className="mb-4 mt-28 text-2xl font-semibold">
            <span className="mainColor">الخطة </span>
            <span className="scoundColor"> الدراسية</span>
          </h1>
        }
      />
      <div className="container mx-auto mt-5 w-[92%] max-w-7xl px-2 pt-4 pb-8 md:pt-6 md:pb-10">
        <h1 className="text-center text-2xl font-bold">
          <span className="mainColor">رحلتك العلمية تبدأ</span>
          <span className="scoundColor"> بخطوات واضحة </span>
        </h1>
        <p className="descriptionColor mt-4 text-center text-base font-semibold">
          برنامج أكاديمي متدرّج يمتد عبر أربعة فصول دراسية، يجمع بين التأصيل
          الشرعي والتعلّم التفاعلي ضمن مسار واضح ومنظم.
        </p>
      </div>
      <div className="container mx-auto w-[92%] max-w-7xl px-2 pb-16 md:pb-20">
        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:gap-5 xl:gap-6">
          {studyPlanCards.map((card, index) => (
            <StudyPlanStep key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanDate;
