"use client";

import StudyPlanDate from "./StudyPlanDate";
import StudyPlanMap from "./StudyPlanMap";
import StudyCertificate from "./StudyCertificate";
import StudyPlanSkeleton from "@/components/skeletons/StudyPlanSkeleton";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

const StudyPlan = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const dir = lang === "en" ? "ltr" : "rtl";

  if (!translate) {
    return (
      <div dir={dir}>
        <StudyPlanSkeleton dir={dir} />
      </div>
    );
  }

  return (
    <div dir={dir}>
      <StudyPlanDate />
      <StudyPlanMap />
      <StudyCertificate />
    </div>
  );
};

export default StudyPlan;
