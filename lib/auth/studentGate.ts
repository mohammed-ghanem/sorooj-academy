import Cookies from "js-cookie";

const authCookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

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

function flagIsTrue(value: unknown): boolean {
  return value === true || value === 1;
}

/**
 * Whether the student completed academy enrollment.
 * Extend keys when the API stores enrollment on the user profile cookie.
 */
export function isStudentEnrolledFromCookie(): boolean {
  const u = readUserFromCookie();
  if (!u) return false;
  if (typeof u.enrollment_status === "string") {
    return u.enrollment_status !== "not_enrolled";
  }
  if (flagIsTrue(u.is_enrolled) || flagIsTrue(u.enrolled) || flagIsTrue(u.has_enrollment)) {
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

/** From login/profile/enroll payloads — default false when missing. */
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

/** Authenticated student list: GET `/study-terms`. Otherwise GET `/public-study-terms`. */
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
