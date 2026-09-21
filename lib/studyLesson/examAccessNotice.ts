import {
  extractApiErrorMessage,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";
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

/** Detect attempt-limit errors from GET exam / submit responses. */
export function isExamAttemptsExhaustedError(error: unknown): boolean {
  const status = readRtkQueryHttpStatus(error);
  if (status !== 403 && status !== 422 && status !== 429) return false;

  const message = extractApiErrorMessage(error, "");
  if (!message) return status === 403 || status === 422;
  return isExamAttemptsExhaustedMessage(message);
}

export function isExamAttemptsExhaustedMessage(message?: string | null): boolean {
  if (!message?.trim()) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("محاول") ||
    normalized.includes("تخطيت") ||
    normalized.includes("attempt") ||
    normalized.includes("exceed") ||
    normalized.includes("limit") ||
    normalized.includes("exhausted")
  );
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

export function extractApiSuccessMessage(
  payload: unknown,
  fallback: string,
): string {
  if (!payload || typeof payload !== "object") return fallback;
  const root = payload as { message?: unknown; data?: { message?: unknown } };
  if (typeof root.message === "string" && root.message.trim()) {
    return root.message.trim();
  }
  if (typeof root.data?.message === "string" && root.data.message.trim()) {
    return root.data.message.trim();
  }
  return fallback;
}
