export type StudyPlanDateRange = {
  startDate: string;
  endDate: string;
  startDateHijri: string;
  endDateHijri: string;
};

export type StudyPlanAcademicYear = StudyPlanDateRange & {
  sequence: number;
};

export type StudyPlanMakeupPeriod = StudyPlanDateRange & {
  programYear: number;
};

export type StudyPlan = {
  id: number;
  name: string;
  enrollment: StudyPlanDateRange | null;
  academicYears: StudyPlanAcademicYear[];
  makeupExamPeriods: StudyPlanMakeupPeriod[];
};
