export type StudyLessonVideosProgress = {
  completed: number;
  total: number;
  percentage: number;
};

/** Lesson inside a subject — maps GET `/subjects/{id}` → `data.Subject.lessons`. */
export type StudyLesson = {
  id: number;
  lessonNumber: string;
  title: string;
  briefContent: string;
  videosCount: number;
  attachmentsCount: number;
  isWatchCompleted: boolean;
  allVideosCompleted: boolean;
  studentHasPassedLessonExam: boolean;
  isCompleted: boolean;
  videosProgress: StudyLessonVideosProgress;
  orderIndex: number;
  isLocked: boolean;
  canAccessLesson: boolean;
  doctorName?: string;
};

export type StudySubjectDoctor = {
  id: number;
  name: string;
};

export type StudySubjectLessonsProgress = {
  completed: number;
  total: number;
  percentage: number;
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
  lessonsProgress: StudySubjectLessonsProgress;
  isSubjectWatchCompleted: boolean;
  isLocked: boolean;
  canAccessSubject: boolean;
  hasActiveSubjectExam: boolean;
  canAccessSubjectExam: boolean;
  studentHasPassedSubjectExam: boolean;
  subjectExamStatus: string | null;
  subjectExamIsPassed?: boolean | null;
  isSubjectExamUnderReview: boolean;
  canRetakeSubjectExam: boolean;
  canOpenSubjectExam: boolean;
  studyTermId?: number;
  studyTermName?: string;
  doctors: StudySubjectDoctor[];
  lessons: StudyLesson[];
};
