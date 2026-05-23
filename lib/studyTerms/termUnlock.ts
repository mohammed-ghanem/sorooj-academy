import type { StudyTerm } from "@/types/studyTerm";

export function isStudyTermCompleted(term: StudyTerm): boolean {
  if (term.isCompleted) return true;
  return term.progress >= 100;
}

/** Term is accessible when study is open and every earlier term is complete. */
export function isStudyTermUnlocked(
  index: number,
  terms: StudyTerm[],
  studyAccessActive: boolean,
): boolean {
  if (!studyAccessActive) return false;
  for (let i = 0; i < index; i++) {
    if (!isStudyTermCompleted(terms[i])) return false;
  }
  return true;
}
