import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import type { LessonFinalExamPhase } from "@/lib/studyLesson/lessonExamState";

/** `can_start_new_*_exam` is false when the student has no remaining attempts. */
export function readCanStartNewExamFlag(value: unknown): boolean {
  return value !== false && value !== 0 && value !== "0";
}

export function isExamAttemptsExhausted(
  canStartNew: boolean,
  phase: LessonFinalExamPhase,
): boolean {
  if (canStartNew) return false;
  return phase !== "passed" && phase !== "under_review";
}

export async function fetchExamBlockedBackendMessage(
  fetchExam: () => Promise<unknown>,
  options: {
    cachedMessage?: string;
    fallbackMessage: string;
  },
): Promise<string> {
  if (options.cachedMessage?.trim()) {
    return options.cachedMessage.trim();
  }

  try {
    await fetchExam();
    return options.fallbackMessage;
  } catch (err) {
    return extractApiErrorMessage(err, options.fallbackMessage);
  }
}

export function buildExamAccessBlockedDescription(
  backendMessage: string,
  contactHint?: string,
): string {
  const parts = [backendMessage.trim()];
  if (contactHint?.trim()) {
    parts.push(contactHint.trim());
  }
  return parts.join("\n\n");
}
