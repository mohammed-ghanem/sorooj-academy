/** Lesson inside a subject — maps GET `/subjects/{id}` → `data.Subject.lessons`. */
export type StudyLesson = {
  id: number;
  lessonNumber: string;
  title: string;
  briefContent: string;
  videosCount: number;
  attachmentsCount: number;
  isWatchCompleted: boolean;
  orderIndex: number;
  doctorName?: string;
};

export type StudySubjectDoctor = {
  id: number;
  name: string;
};

/** Subject detail with lessons — maps GET `/subjects/{id}` → `data.Subject`. */
export type StudySubjectDetail = {
  id: number;
  title: string;
  description: string;
  cover?: string;
  lessonsCount: number;
  lessonExamsCount: number;
  progress: number;
  isSubjectWatchCompleted: boolean;
  studyTermId?: number;
  studyTermName?: string;
  doctors: StudySubjectDoctor[];
  lessons: StudyLesson[];
};
