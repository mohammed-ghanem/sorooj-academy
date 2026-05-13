import Cookies from "js-cookie";

export function hasAccessToken(): boolean {
  return Boolean(Cookies.get("access_token"));
}

/**
 * Whether the student completed academy enrollment.
 * Extend keys when the API stores enrollment on the user profile cookie.
 */
export function isStudentEnrolledFromCookie(): boolean {
  const raw = Cookies.get("user");
  if (!raw) return false;
  try {
    const u = JSON.parse(raw) as Record<string, unknown>;
    if (u.is_enrolled === true || u.is_enrolled === 1) return true;
    if (u.enrolled === true || u.enrolled === 1) return true;
    if (u.has_enrollment === true || u.has_enrollment === 1) return true;
    const nested = u.student;
    if (nested && typeof nested === "object") {
      const s = nested as Record<string, unknown>;
      if (s.is_enrolled === true || s.is_enrolled === 1) return true;
    }
    return false;
  } catch {
    return false;
  }
}
