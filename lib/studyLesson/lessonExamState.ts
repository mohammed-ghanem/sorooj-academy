/** Snapshot of the latest lesson exam attempt from API payloads. */
import {
  readRtkQueryErrorData,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";

export type LessonExamAttemptSnapshot = {
  status: string | null;
  /** `undefined` = field absent (no attempt yet). */
  isPassed: boolean | null | undefined;
};

export type LessonExamUiState = {
  status: string | null;
  isPassed: boolean | null | undefined;
  underReview: boolean;
  passed: boolean;
  canRetake: boolean;
  canOpenFinalExam: boolean;
};

function readStatus(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function readIsPassed(value: unknown): boolean | null | undefined {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  if (value === false || value === 0 || value === "0" || value === "false") {
    return false;
  }
  if (value === null) return null;
  return undefined;
}

function looksLikeExamAttempt(obj: Record<string, unknown>): boolean {
  return (
    "attempt_id" in obj ||
    "attempt_number" in obj ||
    ("status" in obj &&
      ("is_passed" in obj ||
        "percentage_score" in obj ||
        "submitted_at" in obj))
  );
}

function extractFromRecord(
  obj: Record<string, unknown>,
): LessonExamAttemptSnapshot | null {
  const status =
    readStatus(obj.status) ??
    readStatus(obj.exam_status) ??
    readStatus(obj.attempt_status);

  const isPassed =
    readIsPassed(obj.is_passed) ??
    readIsPassed(obj.isPassed) ??
    readIsPassed(obj.passed);

  if (status || isPassed !== undefined) {
    return { status, isPassed };
  }

  return null;
}

function mergeAttempts(
  current: LessonExamAttemptSnapshot,
  next: LessonExamAttemptSnapshot,
): LessonExamAttemptSnapshot {
  const status = next.status ?? current.status;
  const isPassed =
    next.isPassed !== undefined ? next.isPassed : current.isPassed;
  return { status, isPassed };
}

function walkForAttempt(
  value: unknown,
  depth = 0,
  seen = new Set<unknown>(),
): LessonExamAttemptSnapshot {
  if (depth > 6 || value == null || typeof value !== "object") {
    return { status: null, isPassed: undefined };
  }

  if (seen.has(value)) {
    return { status: null, isPassed: undefined };
  }
  seen.add(value);

  let snapshot: LessonExamAttemptSnapshot = {
    status: null,
    isPassed: undefined,
  };

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = walkForAttempt(item, depth + 1, seen);
      snapshot = mergeAttempts(snapshot, found);
    }
    return snapshot;
  }

  const obj = value as Record<string, unknown>;

  const directStatus =
    readStatus(obj.lesson_exam_status) ??
    readStatus(obj.student_lesson_exam_status) ??
    readStatus(obj.lesson_exam_attempt_status) ??
    readStatus(obj.subject_exam_status) ??
    readStatus(obj.student_subject_exam_status) ??
    readStatus(obj.subject_exam_attempt_status);

  const directIsPassed =
    readIsPassed(obj.lesson_exam_is_passed) ??
    readIsPassed(obj.student_lesson_exam_is_passed) ??
    readIsPassed(obj.subject_exam_is_passed) ??
    readIsPassed(obj.student_subject_exam_is_passed);

  if (directStatus || directIsPassed !== undefined) {
    snapshot = mergeAttempts(snapshot, {
      status: directStatus,
      isPassed: directIsPassed,
    });
  }

  if (
    obj.is_lesson_exam_under_review === true ||
    obj.is_subject_exam_under_review === true
  ) {
    snapshot = mergeAttempts(snapshot, {
      status: snapshot.status ?? "submitted",
      isPassed: snapshot.isPassed ?? null,
    });
  }

  const nestedKeys = [
    "result",
    "lesson_exam_attempt",
    "latest_lesson_exam_attempt",
    "student_lesson_exam",
    "lesson_exam",
    "subject_exam_attempt",
    "latest_subject_exam_attempt",
    "student_subject_exam",
    "subject_exam",
    "exam_attempt",
    "attempt",
  ] as const;

  for (const key of nestedKeys) {
    const nested = obj[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const nestedObj = nested as Record<string, unknown>;
      if (looksLikeExamAttempt(nestedObj) || key === "result") {
        const fromNested = extractFromRecord(nestedObj);
        if (fromNested) {
          snapshot = mergeAttempts(snapshot, fromNested);
        }
      }
    }
  }

  for (const child of Object.values(obj)) {
    if (child && typeof child === "object") {
      const found = walkForAttempt(child, depth + 1, seen);
      if (found.status || found.isPassed !== undefined) {
        snapshot = mergeAttempts(snapshot, found);
      }
    }
  }

  return snapshot;
}

/** Extract attempt `status` / `is_passed` from GET lesson or submit-exam payloads. */
export function extractLessonExamAttempt(
  payload: unknown,
): LessonExamAttemptSnapshot {
  return walkForAttempt(payload);
}

export function normalizeExamAttemptStatus(
  status: string | null | undefined,
): string | null {
  if (!status?.trim()) return null;
  const normalized = status.trim().toLowerCase();
  if (normalized === "submited") return "submitted";
  return normalized;
}

export function isLessonExamUnderReview(
  attempt: Pick<LessonExamAttemptSnapshot, "status" | "isPassed">,
): boolean {
  const status = normalizeExamAttemptStatus(attempt.status);
  if (status === "submitted") return true;
  if (attempt.isPassed === null) return true;
  return false;
}

export type LessonFinalExamPhase =
  | "not_started"
  | "passed"
  | "retake"
  | "under_review"
  | "hidden";

export type LessonFinalExamUiState = {
  phase: LessonFinalExamPhase;
  canOpenExam: boolean;
  showToastOnClick: boolean;
  toastVariant: "info" | "success" | null;
  /** True when `can_start_new_*_exam` is false and the student may not retry yet. */
  attemptsExhausted: boolean;
};

/** Button + click behaviour from `lesson_exam_attempt_status` and pass flag. */
export function resolveLessonFinalExamUiState(input: {
  hasActiveLessonExam: boolean;
  lessonExamAttemptStatus: string | null;
  studentHasPassedLessonExam: boolean;
  canAccessLessonExam?: boolean;
  canStartNewLessonExam?: boolean;
  canRetakeLessonExam?: boolean;
}): LessonFinalExamUiState {
  if (!input.hasActiveLessonExam) {
    return {
      phase: "hidden",
      canOpenExam: false,
      showToastOnClick: false,
      toastVariant: null,
      attemptsExhausted: false,
    };
  }

  const status = normalizeExamAttemptStatus(input.lessonExamAttemptStatus);
  const passed = input.studentHasPassedLessonExam;
  const canAccess = input.canAccessLessonExam !== false;
  const canStartNew = input.canStartNewLessonExam !== false;
  const attemptsExhausted =
    !canStartNew && !passed && status !== "submitted";

  if (status === null) {
    return {
      phase: "not_started",
      canOpenExam: canAccess && canStartNew,
      showToastOnClick: false,
      toastVariant: null,
      attemptsExhausted,
    };
  }

  if (status === "graded") {
    if (passed) {
      return {
        phase: "passed",
        canOpenExam: false,
        showToastOnClick: true,
        toastVariant: "success",
        attemptsExhausted: false,
      };
    }

    return {
      phase: "retake",
      canOpenExam: canAccess && canStartNew,
      showToastOnClick: false,
      toastVariant: null,
      attemptsExhausted,
    };
  }

  if (status === "submitted") {
    return {
      phase: "under_review",
      canOpenExam: false,
      showToastOnClick: true,
      toastVariant: "info",
      attemptsExhausted: false,
    };
  }

  return {
    phase: "not_started",
    canOpenExam: canAccess && canStartNew,
    showToastOnClick: false,
    toastVariant: null,
    attemptsExhausted,
  };
}

export function resolveLessonExamUiState(
  attempt: LessonExamAttemptSnapshot,
  options?: {
    apiPassed?: boolean;
    canAccessFromApi?: boolean;
    canRetakeFromApi?: boolean;
  },
): LessonExamUiState {
  const underReview = isLessonExamUnderReview(attempt);
  const passed = attempt.isPassed === true || options?.apiPassed === true;
  const canRetake =
    attempt.isPassed === false || options?.canRetakeFromApi === true;

  const canOpenFinalExam =
    !underReview &&
    !passed &&
    (canRetake || options?.canAccessFromApi === true);

  return {
    status: attempt.status,
    isPassed: attempt.isPassed,
    underReview,
    passed,
    canRetake,
    canOpenFinalExam,
  };
}

/**
 * GET lesson/subject exam rejects with 422 when the attempt is not available
 * (e.g. under review). Also reads structured attempt fields from the error body.
 */
export function isExamLoadUnderReviewError(error: unknown): boolean {
  if (readRtkQueryHttpStatus(error) === 422) return true;

  const payload = readRtkQueryErrorData(error);
  if (!payload) return false;

  return isLessonExamUnderReview(extractLessonExamAttempt(payload));
}

/** Same rules as lesson final exam — used for subject exam UI. */
export const resolveSubjectExamUiState = resolveLessonExamUiState;
export const resolveSubjectFinalExamUiState = resolveLessonFinalExamUiState;
export const isSubjectExamUnderReview = isLessonExamUnderReview;
export const extractSubjectExamAttempt = extractLessonExamAttempt;
