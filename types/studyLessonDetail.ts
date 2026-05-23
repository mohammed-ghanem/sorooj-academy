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
  videos: StudyLessonVideo[];
  attachments: StudyLessonAttachment[];
};
