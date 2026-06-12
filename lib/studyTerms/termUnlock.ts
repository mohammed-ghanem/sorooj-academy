import type { StudyTerm } from "@/types/studyTerm";

export function isStudyTermCompleted(term: StudyTerm): boolean {
  if (term.isCompleted) return true;
  return term.progress >= 100;
}

/** Term is accessible when study is open and every earlier term is complete. */
export function isStudyTermUnlocked(
  index: number,
  term: StudyTerm,
  terms: StudyTerm[],
  studyAccessActive: boolean,
): boolean {
  if (!studyAccessActive) return false;

  if (term.canAccessStudyTerm !== undefined) {
    return term.canAccessStudyTerm === true && term.isLocked !== true;
  }

  for (let i = 0; i < index; i++) {
    if (!isStudyTermCompleted(terms[i])) return false;
  }
  return true;
}
