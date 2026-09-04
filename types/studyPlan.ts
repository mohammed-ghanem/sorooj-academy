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

export type StudyProgramLesson = {
  id: number;
  title: string;
};

export type StudyProgramSubject = {
  id: number;
  name: string;
  orderIndex: number;
  lessonsCount: number;
  videosCount: number;
  lessons: StudyProgramLesson[];
};

export type StudyProgramTerm = {
  id: number;
  name: string;
  subjectsCount: number;
  lessonsCount: number;
  subjects: StudyProgramSubject[];
};

export type StudyProgramYear = {
  id: number;
  name: string;
  programSequence: number;
  terms: StudyProgramTerm[];
};
