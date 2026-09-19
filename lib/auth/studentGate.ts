import Cookies from "js-cookie";

export const authCookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

const NAME_KEYS = [
  "name",
  "full_name",
  "fullName",
  "student_name",
  "studentName",
  "user_name",
  "userName",
  "arabic_name",
  "english_name",
] as const;

export function readUserFromCookie(): Record<string, unknown> | null {
  const raw = Cookies.get("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function hasAccessToken(): boolean {
  return Boolean(Cookies.get("access_token"));
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pickNameFromRecord(
  value: Record<string, unknown> | null | undefined,
): string {
  if (!value) return "";
  for (const key of NAME_KEYS) {
    const name = asTrimmedString(value[key]);
    if (name) return name;
  }
  return "";
}

function scoreUserCandidate(value: unknown): number {
  if (!value || typeof value !== "object" || Array.isArray(value)) return -1;
  const u = value as Record<string, unknown>;
  let score = 0;
  if (pickNameFromRecord(u)) score += 100;
  if (asTrimmedString(u.email)) score += 20;
  if (asTrimmedString(u.mobile)) score += 10;
  if (u.id != null) score += 5;
  // Token wrappers / auth shells without identity.
  if (asTrimmedString(u.access_token) && score < 20) score -= 50;
  return score;
}

/**
 * Pull a user/profile object from login, OTP, or profile API payloads.
 * Prefers objects that actually contain a display name.
 */
export function extractUserFromAuthPayload(
  payload: unknown,
): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : null;

  const candidates: unknown[] = [
    data && typeof data.user === "object"
      ? (data.user as Record<string, unknown>).user
      : null,
    data?.user,
    data?.student,
    root.user && typeof root.user === "object"
      ? (root.user as Record<string, unknown>).user
      : null,
    root.user,
    root.student,
    data,
    root,
  ];

  let best: Record<string, unknown> | null = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const score = scoreUserCandidate(candidate);
    if (score > bestScore) {
      bestScore = score;
      best = candidate as Record<string, unknown>;
    }
  }

  return bestScore > 0 ? best : null;
}

/** Display label for navbar / menus from a user-like object. */
export function displayNameFromUser(
  user: Record<string, unknown> | null | undefined,
): string | null {
  if (!user) return null;

  const direct = pickNameFromRecord(user);
  if (direct) return direct;

  for (const key of ["user", "student"] as const) {
    const nested = user[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const nestedName = pickNameFromRecord(
        nested as Record<string, unknown>,
      );
      if (nestedName) return nestedName;
    }
  }

  const email = asTrimmedString(user.email);
  if (email) {
    const local = email.split("@")[0]?.trim();
    if (local) return local;
  }

  return null;
}

export function displayNameFromCookie(): string | null {
  return displayNameFromUser(readUserFromCookie());
}

function slimAuthUser(
  source: Record<string, unknown>,
  previous: Record<string, unknown>,
): Record<string, unknown> {
  const name =
    pickNameFromRecord(source) || pickNameFromRecord(previous) || "";
  const email =
    asTrimmedString(source.email) || asTrimmedString(previous.email);

  const slim: Record<string, unknown> = {
    id: source.id ?? previous.id,
    name: name || undefined,
    email: email || undefined,
    enrollment_status:
      source.enrollment_status ?? previous.enrollment_status,
    is_enrolled: source.is_enrolled ?? previous.is_enrolled,
    enrolled: source.enrolled ?? previous.enrolled,
    has_enrollment: source.has_enrollment ?? previous.has_enrollment,
    studies_have_started:
      source.studies_have_started ?? previous.studies_have_started,
  };

  Object.keys(slim).forEach((key) => {
    if (slim[key] === undefined) delete slim[key];
  });

  return slim;
}

/**
 * Persist a slim auth identity cookie (name/email/enrollment only).
 * Full profile payloads are too large and browsers silently drop them.
 */
export function persistAuthUserCookie(
  payload: unknown,
  notify = true,
): Record<string, unknown> | null {
  const extracted = extractUserFromAuthPayload(payload);
  if (!extracted) return null;

  const previous = readUserFromCookie() ?? {};
  const next = slimAuthUser(extracted, previous);

  try {
    Cookies.set("user", JSON.stringify(next), authCookieOptions);
    // Verify write — oversized cookies are ignored by the browser.
    if (!Cookies.get("user")) {
      Cookies.set(
        "user",
        JSON.stringify({
          id: next.id,
          name: next.name,
          email: next.email,
        }),
        authCookieOptions,
      );
    }
  } catch {
    try {
      Cookies.set(
        "user",
        JSON.stringify({
          id: next.id,
          name: next.name,
          email: next.email,
        }),
        authCookieOptions,
      );
    } catch {
      return null;
    }
  }

  if (notify && typeof window !== "undefined") {
    window.dispatchEvent(new Event("sorooj-auth-session"));
  }

  return next;
}

function flagIsTrue(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

export function isStudentEnrolledFromCookie(): boolean {
  const u = readUserFromCookie();
  if (!u) return false;
  if (typeof u.enrollment_status === "string") {
    return u.enrollment_status !== "not_enrolled";
  }
  if (
    flagIsTrue(u.is_enrolled) ||
    flagIsTrue(u.enrolled) ||
    flagIsTrue(u.has_enrollment)
  ) {
    return true;
  }
  const nested = u.student;
  if (nested && typeof nested === "object") {
    const s = nested as Record<string, unknown>;
    if (typeof s.enrollment_status === "string") {
      return s.enrollment_status !== "not_enrolled";
    }
    if (flagIsTrue(s.is_enrolled)) return true;
  }
  return false;
}

export function studiesHaveStartedFromCookie(): boolean {
  const u = readUserFromCookie();
  if (!u) return false;
  if (flagIsTrue(u.studies_have_started)) return true;
  const nested = u.student;
  if (nested && typeof nested === "object") {
    const s = nested as Record<string, unknown>;
    if (flagIsTrue(s.studies_have_started)) return true;
  }
  return false;
}

export function shouldUseStudentStudyTermsApi(): boolean {
  return hasAccessToken() && isStudentEnrolledFromCookie();
}

export function setStudiesHaveStartedInCookie(started: boolean): void {
  const u = readUserFromCookie();
  if (!u) return;
  try {
    Cookies.set(
      "user",
      JSON.stringify({ ...u, studies_have_started: started }),
      authCookieOptions,
    );
  } catch {
    /* ignore */
  }
}
