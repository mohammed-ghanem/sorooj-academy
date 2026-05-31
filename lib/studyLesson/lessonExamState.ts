/** Snapshot of the latest lesson exam attempt from API payloads. */
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
    readStatus(obj.lesson_exam_attempt_status);

  const directIsPassed =
    readIsPassed(obj.lesson_exam_is_passed) ??
    readIsPassed(obj.student_lesson_exam_is_passed);

  if (directStatus || directIsPassed !== undefined) {
    snapshot = mergeAttempts(snapshot, {
      status: directStatus,
      isPassed: directIsPassed,
    });
  }

  if (obj.is_lesson_exam_under_review === true) {
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

export function isLessonExamUnderReview(
  attempt: Pick<LessonExamAttemptSnapshot, "status" | "isPassed">,
): boolean {
  const status = attempt.status?.trim().toLowerCase() ?? null;
  if (status === "submitted") return true;
  if (attempt.isPassed === null) return true;
  return false;
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

export function isLessonExamNoMoreAttemptsMessage(message: string): boolean {
  return /لا يمكنك إجراء المزيد من محاولات|no more attempts|maximum attempts/i.test(
    message,
  );
}
