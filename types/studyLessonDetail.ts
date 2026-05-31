/** Progress summary — maps GET `/lessons/{id}` → `data.lesson.videos_progress`. */
export type StudyLessonVideosProgress = {
  completed: number;
  total: number;
  percentage: number;
};

/** Video inside a lesson — maps GET `/lessons/{id}` → `data.lesson.videos`. */
export type StudyLessonVideo = {
  id: number;
  title: string;
  youtubeId: string;
  embedUrl?: string;
  streamUrl?: string;
  duration: string;
  briefContent?: string;
  isWatchCompleted: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  canAccessVideo: boolean;
  hasActiveVideoExam: boolean;
  studentHasPassedVideoExam: boolean;
  canAccessVideoExam: boolean;
  orderIndex: number;
};

export type StudyLessonAttachment = {
  id: number;
  title: string;
  url?: string;
};

/** Lesson detail — maps GET `/lessons/{id}` → `data.lesson`. */
export type StudyLessonDetail = {
  id: number;
  lessonNumber: string;
  title: string;
  content: string;
  briefContent: string;
  subjectId?: number;
  subjectName?: string;
  doctorName?: string;
  doctorImage?: string;
  videosCount: number;
  attachmentsCount: number;
  isWatchCompleted: boolean;
  hasActiveLessonExam: boolean;
  canAccessLessonExam: boolean;
  /** Latest attempt status from API (`submitted`, `graded`, …). */
  lessonExamStatus: string | null;
  /** Latest attempt pass flag — `null` means pending manual grading. */
  lessonExamIsPassed?: boolean | null;
  isLessonExamUnderReview: boolean;
  canRetakeLessonExam: boolean;
  /** Whether the student may open the final lesson exam modal. */
  canOpenLessonFinalExam: boolean;
  allVideosCompleted: boolean;
  studentHasPassedLessonExam: boolean;
  videosProgress: StudyLessonVideosProgress;
  videos: StudyLessonVideo[];
  attachments: StudyLessonAttachment[];
};
