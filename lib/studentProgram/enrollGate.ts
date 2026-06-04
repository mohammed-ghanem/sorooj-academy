import {
  extractApiSuccessMessage,
  extractStudyStartFromPayload,
  readRtkQueryHttpStatus,
  studyPeriodHasStarted,
} from "@/lib/studentProgram/programErrors";
import {
  setStudiesHaveStartedInCookie,
  studiesHaveStartedFromCookie,
} from "@/lib/auth/studentGate";

export type EnrollGateSnapshot = {
  message: string;
  studyStartsAt: string | null;
  /** Mirrors API `studies_have_started` (default false). */
  studiesHaveStarted: boolean;
  /** @deprecated Use `studiesHaveStarted` — kept for modal/date fallback only. */
  studyOpen: boolean;
};

function payloadAllowsStudy(data: Record<string, unknown>): boolean {
  if (data.can_start_study === true || data.study_open === true) return true;
  if (data.can_start === true || data.study_started === true) return true;
  return false;
}

function payloadBlocksStudy(data: Record<string, unknown>): boolean {
  if (data.can_start_study === false || data.study_open === false) return true;
  if (data.can_start === false) return true;
  return false;
}

function readStudiesHaveStartedFlag(
  data: Record<string, unknown>,
): boolean | undefined {
  if (data.studies_have_started === true || data.studies_have_started === 1) {
    return true;
  }
  if (data.studies_have_started === false || data.studies_have_started === 0) {
    return false;
  }
  return undefined;
}

function collectPayloadRecords(payload: unknown): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];
  if (!payload || typeof payload !== "object") return records;
  const root = payload as Record<string, unknown>;
  records.push(root);
  const nested = root.data;
  if (nested && typeof nested === "object") {
    records.push(nested as Record<string, unknown>);
  }
  return records;
}

function resolveStudiesHaveStarted(
  records: Record<string, unknown>[],
): boolean {
  for (const rec of records) {
    const flag = readStudiesHaveStartedFlag(rec);
    if (flag === true) return true;
  }
  return false;
}

/** RTK `unwrap()` rejection shape from `axiosBaseQuery`. */
export function readEnrollApiHttpStatus(error: unknown): number | undefined {
  return readRtkQueryHttpStatus(error);
}
/**
 * `POST /enroll-in-program` returns 422 when enrollment is not allowed
 * (e.g. no open batch). Disable retry in the enroll modal for that case only.
 */
export function shouldBlockEnrollRetry(error: unknown): boolean {
  return readEnrollApiHttpStatus(error) === 422;
}

/** Re-evaluate enroll snapshot from API payload fields (no message heuristics). */
export function finalizeEnrollGate(
  snap: Pick<EnrollGateSnapshot, "message" | "studyStartsAt">,
  payload?: unknown,
): EnrollGateSnapshot {
  const records = payload ? collectPayloadRecords(payload) : [];

  let explicitAllow = false;
  let explicitBlock = false;
  for (const rec of records) {
    if (payloadAllowsStudy(rec)) explicitAllow = true;
    if (payloadBlocksStudy(rec)) explicitBlock = true;
  }

  let studiesHaveStarted = resolveStudiesHaveStarted(records);

  if (!studiesHaveStarted && payload) {
    if (explicitAllow) {
      studiesHaveStarted = true;
    } else if (snap.studyStartsAt && studyPeriodHasStarted(snap.studyStartsAt)) {
      studiesHaveStarted = true;
    }
  }

  if (!studiesHaveStarted && !payload) {
    studiesHaveStarted = studiesHaveStartedFromCookie();
  }

  let studyOpen = studiesHaveStarted;
  if (!studyOpen) {
    if (snap.studyStartsAt && studyPeriodHasStarted(snap.studyStartsAt)) {
      studyOpen = true;
    } else if (explicitAllow) {
      studyOpen = true;
    } else if (explicitBlock) {
      studyOpen = false;
    } else if (snap.studyStartsAt) {
      studyOpen = studyPeriodHasStarted(snap.studyStartsAt);
    }
  }

  return {
    message: snap.message,
    studyStartsAt: snap.studyStartsAt,
    studiesHaveStarted,
    studyOpen,
  };
}

/** Parse `POST /enroll-in-program` and sync `studies_have_started` on the user cookie. */
export function parseEnrollResponse(payload: unknown): EnrollGateSnapshot {
  const message = extractApiSuccessMessage(payload) ?? "";
  const studyStartsAt = extractStudyStartFromPayload(payload);
  const snap = finalizeEnrollGate({ message, studyStartsAt }, payload);

  if (payload && typeof payload === "object") {
    const records = collectPayloadRecords(payload);
    for (const rec of records) {
      const flag = readStudiesHaveStartedFlag(rec);
      if (flag === true) {
        setStudiesHaveStartedInCookie(true);
        break;
      }
    }
  }

  if (snap.studiesHaveStarted) {
    setStudiesHaveStartedInCookie(true);
  }

  return {
    ...snap,
    studiesHaveStarted:
      studiesHaveStartedFromCookie() || snap.studiesHaveStarted,
  };
}

export function canEnterStudyTerm(): boolean {
  return studiesHaveStartedFromCookie();
}

