import type { StudyTerm } from "@/types/studyTerm";

/** Local placeholder until the API is wired. Replace with `getStudyTopicById` from services. */
export const studyTerms: StudyTerm[] = [];



export function getStudyTermById(id: number): StudyTerm | undefined {
  return studyTerms.find((t) => t.id === id);
}



export function isTermLockedByIndex(
  items: { progress: number }[],
  index: number,
): boolean {
  if (index === 0) return false;
  return items[index - 1].progress < 100;
}
