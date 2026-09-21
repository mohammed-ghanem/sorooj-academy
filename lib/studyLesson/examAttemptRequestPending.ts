import {
  extractApiErrorMessage,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";

export type ExamAttemptRequestScope = "subject" | "lesson" | "video";

const STORAGE_PREFIX = "sorooj:exam-attempt-request-pending:";

function storageKey(
  scope: ExamAttemptRequestScope,
  id: string | number,
): string {
  return `${STORAGE_PREFIX}${scope}:${id}`;
}

/** True when the student already submitted an attempt-reopen request. */
export function isExamAttemptRequestPending(
  scope: ExamAttemptRequestScope,
  id: string | number,
): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(storageKey(scope, id)) === "1";
  } catch {
    return false;
  }
}

export function markExamAttemptRequestPending(
  scope: ExamAttemptRequestScope,
  id: string | number,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(scope, id), "1");
  } catch {
    // Ignore quota / private-mode failures; in-memory UI still covers this session.
  }
}

export function clearExamAttemptRequestPending(
  scope: ExamAttemptRequestScope,
  id: string | number,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey(scope, id));
  } catch {
    // Ignore storage failures.
  }
}

/** Backend boolean-ish flags that mean a reopen request is awaiting admin review. */
export function readHasPendingExamAttemptRequest(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

/** Duplicate / already-pending errors from POST attempt-request. */
export function isExamAttemptRequestAlreadyPendingError(
  error: unknown,
): boolean {
  const status = readRtkQueryHttpStatus(error);
  const message = extractApiErrorMessage(error, "").toLowerCase();

  if (!message) {
    return status === 409;
  }

  return (
    message.includes("pending") ||
    message.includes("already") ||
    message.includes("await") ||
    message.includes("قيد المراجعة") ||
    message.includes("في انتظار") ||
    message.includes("تم إرسال") ||
    message.includes("سبق") ||
    message.includes("موجود") ||
    message.includes("مسبق")
  );
}
