/** Study topic (axis) — list + detail. Aligns with future API response. */
export type StudyTerm = {
  id: number;
  title: string;
  /** 0–100 (from API later; placeholder when listing from backend) */
  progress: number;
  materialsCount: number;
  lessonsCount: number;
  /** Short blurb for cards */
  shortDescription: string;
  /** Longer copy for the detail page (optional until API provides it) */
  description: string;
  /** From API `is_active`; inactive terms render as locked. */
  isActive?: boolean;
};

export type StudyTermListItem = Pick<
  StudyTerm,
  "id" | "title" | "progress" | "materialsCount" | "lessonsCount" | "shortDescription"
>;
