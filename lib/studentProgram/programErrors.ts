/** Normalize Laravel / student-api payloads for UI messages. */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function collectValidationLines(errors: Record<string, unknown>): string[] {
  const lines: string[] = [];
  for (const v of Object.values(errors)) {
    if (typeof v === "string" && v.trim()) lines.push(v.trim());
    else if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === "string" && item.trim()) lines.push(item.trim());
      }
    }
  }
  return lines;
}

/**
 * Collects every human-readable string from error payloads (RTK `unwrap` rejects
 * with `{ status, data }`, Laravel `message` + `errors`, nested `data`, etc.).
 */
export function extractApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const lines: string[] = [];
  const seen = new Set<string>();

  const push = (s: string) => {
    const t = s.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    lines.push(t);
  };

  const takeFromPayload = (payload: unknown, depth: number): void => {
    if (depth > 10 || payload == null) return;

    if (typeof payload === "string") {
      push(payload);
      return;
    }

    if (!isPlainObject(payload)) return;

    if (payload.errors && isPlainObject(payload.errors)) {
      collectValidationLines(payload.errors).forEach(push);
    }

    if (typeof payload.message === "string") push(payload.message);
    if (typeof payload.status_message === "string") push(payload.status_message);
    if (typeof payload.detail === "string") push(payload.detail);
    if (typeof payload.error === "string" && payload.error !== payload.message) {
      push(payload.error);
    }

    if (payload.data !== undefined && payload.data !== payload) {
      takeFromPayload(payload.data, depth + 1);
    }
  };

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (!error || typeof error !== "object") {
    return fallback;
  }

  const err = error as Record<string, unknown>;

  if (typeof err.message === "string") push(err.message);

  if ("data" in err && err.data !== undefined) {
    takeFromPayload(err.data, 0);
  }

  if (lines.length) return lines.join("\n\n");
  return fallback;
}

/** RTK `unwrap()` rejection shape from `axiosBaseQuery`. */
export function readRtkQueryHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

/** Laravel JSON body on failed RTK requests (`error.data`). */
export function readRtkQueryErrorData(error: unknown): unknown {
  if (!error || typeof error !== "object") return undefined;
  return (error as { data?: unknown }).data;
}

const API_MESSAGE_KEYS = [
  "message",
  "message_ar",
  "message_en",
  "status_message",
  "msg",
  "notice",
  "info",
] as const;

const API_NESTED_RECORD_KEYS = ["data", "user", "student", "result", "payload"] as const;

/** Reads top-level `message` first, then nested API copy. */
export function extractApiSuccessMessage(payload: unknown): string | null {
  if (payload && typeof payload === "object") {
    const root = payload as Record<string, unknown>;
    if (typeof root.message === "string" && root.message.trim()) {
      return root.message.trim();
    }
  }

  const lines: string[] = [];
  const seen = new Set<string>();

  const push = (s: string) => {
    const t = s.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    lines.push(t);
  };

  const walk = (node: unknown, depth: number): void => {
    if (depth > 12 || node == null) return;
    if (typeof node === "string") {
      push(node);
      return;
    }
    if (!isPlainObject(node)) return;

    for (const key of API_MESSAGE_KEYS) {
      const v = node[key];
      if (typeof v === "string") push(v);
    }

    for (const key of API_NESTED_RECORD_KEYS) {
      const nested: unknown = node[key];
      if (nested !== undefined && nested !== node) {
        walk(nested, depth + 1);
      }
    }
  };

  walk(payload, 0);
  return lines.length ? lines.join("\n\n") : null;
}

/** Prefer backend copy; use `fallback` only when the API sent nothing readable. */
export function messageWithBackendFallback(
  backend: string,
  fallback: string,
): string {
  const b = backend.trim();
  if (b) return b;
  return fallback.trim();
}

/** Parse API date strings (ISO, `YYYY-MM-DD`, or `DD-MM-YYYY`). */
export function parseStudyStartMs(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const iso = Date.parse(trimmed);
  if (!Number.isNaN(iso)) return iso;

  const ddmmyyyy = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (ddmmyyyy) {
    const day = Number(ddmmyyyy[1]);
    const month = Number(ddmmyyyy[2]) - 1;
    const year = Number(ddmmyyyy[3]);
    const t = new Date(year, month, day).getTime();
    return Number.isNaN(t) ? null : t;
  }

  return null;
}

export function studyPeriodHasStarted(studyStartsAt: string | null): boolean {
  if (!studyStartsAt) return false;
  const t = parseStudyStartMs(studyStartsAt);
  if (t === null) return false;
  return Date.now() >= t;
}

function pickDateString(obj: Record<string, unknown>): string | null {
  const years = obj.academic_years ?? obj.academicYears;
  if (Array.isArray(years)) {
    let earliest: string | null = null;
    let earliestMs = Number.POSITIVE_INFINITY;
    for (const item of years) {
      if (!item || typeof item !== "object") continue;
      const start = (item as Record<string, unknown>).start_date;
      if (typeof start !== "string" || !start.trim()) continue;
      const ms = parseStudyStartMs(start);
      if (ms !== null && ms < earliestMs) {
        earliestMs = ms;
        earliest = start.trim();
      }
    }
    if (earliest) return earliest;
  }

  const academicYear = obj.academic_year ?? obj.academicYear;
  if (academicYear && typeof academicYear === "object") {
    const fromAy = pickDateString(academicYear as Record<string, unknown>);
    if (fromAy) return fromAy;
  }

  const keys = [
    "study_starts_at",
    "program_starts_at",
    "starts_at",
    "start_date",
    "study_start_date",
    "batch_start_date",
    "study_start_at",
    "open_at",
    "program_start_at",
    "cohort_starts_at",
  ];
  const cohort = obj.cohort;
  if (cohort && typeof cohort === "object") {
    const fromCohort = pickDateString(cohort as Record<string, unknown>);
    if (fromCohort) return fromCohort;
  }
  const program = obj.program;
  if (program && typeof program === "object") {
    const fromProgram = pickDateString(program as Record<string, unknown>);
    if (fromProgram) return fromProgram;
  }
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Read a scheduled study-start datetime from any API JSON body. */
export function extractStudyStartFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const fromRoot = pickDateString(root);
  if (fromRoot) return fromRoot;
  const nested = root.data;
  if (nested && typeof nested === "object") {
    return pickDateString(nested as Record<string, unknown>);
  }
  return null;
}

/** If the backend signals study has not opened yet, try to read a scheduled datetime string. */
export function extractStudyStartHint(error: unknown): string | null {
  const err = error as { data?: unknown };
  return extractStudyStartFromPayload(err?.data);
}

export function formatStudyStartForLocale(raw: string, lang: string): string {
  const t = Date.parse(raw);
  if (!Number.isNaN(t)) {
    try {
      return new Intl.DateTimeFormat(lang === "en" ? "en" : "ar-EG", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(t));
    } catch {
      return raw;
    }
  }
  return raw;
}
