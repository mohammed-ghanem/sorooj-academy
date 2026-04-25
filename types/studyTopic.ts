/** Study topic (axis) — list + detail. Aligns with future API response. */
export type StudyTopic = {
  id: number;
  title: string;
  /** 0–100 */
  progress: number;
  materialsCount: number;
  lessonsCount: number;
  /** Short blurb for cards */
  shortDescription: string;
  /** Longer copy for the detail page (optional until API provides it) */
  description: string;
};

export type StudyTopicListItem = Pick<
  StudyTopic,
  "id" | "title" | "progress" | "materialsCount" | "lessonsCount" | "shortDescription"
>;
