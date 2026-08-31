"use client";

import StudyPlanDate from "./StudyPlanDate";
import StudyPlanMap from "./StudyPlanMap";
import StudyCertificate from "./StudyCertificate";
import StudyPlanSkeleton from "@/components/skeletons/StudyPlanSkeleton";
import { useGetStudyPlanQuery } from "@/store/studyPlan/studyPlanApi";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

const StudyPlan = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const dir = lang === "en" ? "ltr" : "rtl";
  const locale = lang === "en" ? "en" : "ar";
  const labels = translate?.pages?.studyPlanPage;

  const {
    data: studyPlan,
    isLoading,
    isFetching,
    isUninitialized,
    isError,
    error,
    refetch,
  } = useGetStudyPlanQuery(
    { lang: locale },
    { refetchOnMountOrArgChange: true },
  );

  const showSkeleton =
    !translate ||
    isUninitialized ||
    isLoading ||
    (isFetching && !studyPlan);

  if (showSkeleton) {
    return (
      <div dir={dir}>
        <StudyPlanSkeleton dir={dir} />
      </div>
    );
  }

  if (isError || !studyPlan) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
        dir={dir}
      >
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
    <div dir={dir}>
      <StudyPlanDate studyPlan={studyPlan} locale={locale} labels={labels} />
      <StudyPlanMap />
      <StudyCertificate />
    </div>
  );
};

export default StudyPlan;
