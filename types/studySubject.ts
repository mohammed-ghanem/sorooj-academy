export type StudySubjectLessonsProgress = {
  completed: number;
  total: number;
  percentage: number;
};

/** Subject (material) inside a study term — maps GET `/study-terms/{id}/subjects`. */
export type StudySubject = {
  id: number;
  title: string;
  description: string;
  cover?: string;
  lessonsCount: number;
  progress: number;
  lessonsProgress: StudySubjectLessonsProgress;
  orderIndex: number;
  isActive: boolean;
  isLocked: boolean;
  canAccessSubject: boolean;
};

export type StudyTermDetail = {
  id: number;
  title: string;
  progress: number;
  materialsCount: number;
  lessonsCount: number;
  shortDescription: string;
  description: string;
  isActive?: boolean;
  isCurrent?: boolean;
  academicYearLabel?: string;
  subjects: StudySubject[];
};
