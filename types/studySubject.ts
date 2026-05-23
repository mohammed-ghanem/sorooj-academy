/** Subject (material) inside a study term — maps GET `/subjects` items. */
export type StudySubject = {
  id: number;
  title: string;
  description: string;
  cover?: string;
  lessonsCount: number;
  progress: number;
  orderIndex: number;
  isActive: boolean;
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
