/** Study topic (axis) — list + detail. Maps GET `/study-terms` or `/public-study-terms`. */
export type StudyTerm = {
  id: number;
  title: string;
  /** Term progress 0–100 from student-api when available. */
  progress: number;
  materialsCount: number;
  lessonsCount: number;
  /** Short blurb for cards */
  shortDescription: string;
  /** Longer copy for the detail page (optional until API provides it) */
  description: string;
  /** From API `is_active`; inactive terms render as locked. */
  isActive?: boolean;
  /** From API `is_current` (1 = current term). */
  isCurrent?: boolean;
  /** True when backend marks the term complete or progress is 100%. */
  isCompleted?: boolean;
  /** From GET `/study-terms` — term locked for this student. */
  isLocked?: boolean;
  /** From GET `/study-terms` — student may open this term. */
  canAccessStudyTerm?: boolean;
  /** Localized label from `academic_year` when present. */
  academicYearLabel?: string;
};

export type StudyTermListItem = Pick<
  StudyTerm,
  "id" | "title" | "progress" | "materialsCount" | "lessonsCount" | "shortDescription"
>;
