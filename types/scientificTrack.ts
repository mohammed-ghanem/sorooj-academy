/** Scientific track category — maps GET `/scientific-track-categories` → `data.Categories[]`. */
export type ScientificTrackCategory = {
  id: number;
  name: string;
  aboutCategory: string;
  subjectsCount: number;
  isActive: boolean;
};

export type ScientificTrackLessonsProgress = {
  completed: number;
  total: number;
  percentage: number;
};

export type ScientificTrackVideosProgress = {
  completed: number;
  total: number;
  percentage: number;
};

/** Lesson inside a scientific track subject — maps `Subject.lessons[]`. */
export type ScientificTrackLesson = {
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
  videosProgress: ScientificTrackVideosProgress;
  orderIndex: number;
  isLocked: boolean;
  canAccessLesson: boolean;
  doctorName?: string;
};

/** Subject inside a scientific track category — maps GET `/scientific-track-categories/{id}/subjects`. */
export type ScientificTrackSubject = {
  id: number;
  title: string;
  description: string;
  cover?: string;
  lessonsCount: number;
  progress: number;
  lessonsProgress: ScientificTrackLessonsProgress;
  orderIndex: number;
  isActive: boolean;
  categoryId?: number;
  categoryName?: string;
  hasActiveSubjectExam: boolean;
  allLessonsCompleted: boolean;
  canAccessSubjectExam: boolean;
  studentHasPassedSubjectExam: boolean;
};

/** Normalized payload for category subjects page. */
export type ScientificTrackCategorySubjects = {
  categoryId: number;
  categoryName: string;
  subjects: ScientificTrackSubject[];
};

/** Subject detail with lessons — maps GET `/scientific-track-subjects/{id}` → `data.Subject`. */
export type ScientificTrackSubjectDetail = {
  id: number;
  title: string;
  description: string;
  cover?: string;
  lessonsCount: number;
  lessonExamsCount: number;
  progress: number;
  lessonsProgress: ScientificTrackLessonsProgress;
  isLocked: boolean;
  canAccessSubject: boolean;
  hasActiveSubjectExam: boolean;
  canAccessSubjectExam: boolean;
  studentHasPassedSubjectExam: boolean;
  allLessonsCompleted: boolean;
  categoryId?: number;
  categoryName?: string;
  lessons: ScientificTrackLesson[];
};
