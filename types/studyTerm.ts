/** Study topic (axis) — list + detail. Maps GET `/study-terms` items. */
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
  /** Localized label from `academic_year` when present. */
  academicYearLabel?: string;
};

export type StudyTermListItem = Pick<
  StudyTerm,
  "id" | "title" | "progress" | "materialsCount" | "lessonsCount" | "shortDescription"
>;
