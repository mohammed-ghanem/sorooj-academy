export type StudyPlanLocale = "ar" | "en";

const GREGORIAN_MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
] as const;

const GREGORIAN_MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const HIJRI_MONTHS_AR = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
] as const;

const HIJRI_MONTHS_EN = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Ula",
  "Jumada al-Akhirah",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
] as const;

function parseYmd(
  value: string,
): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return { year, month, day };
}

/** `2026-05-14` → `14 مايو 2026` */
export function formatGregorianDate(
  iso: string,
  locale: StudyPlanLocale = "ar",
): string {
  const parts = parseYmd(iso);
  if (!parts) return iso.trim();

  const months =
    locale === "en" ? GREGORIAN_MONTHS_EN : GREGORIAN_MONTHS_AR;
  return `${parts.day} ${months[parts.month - 1]} ${parts.year}`;
}

/** `1447-11-28` → `28 ذو القعدة 1447 هـ` */
export function formatHijriDate(
  iso: string,
  locale: StudyPlanLocale = "ar",
): string {
  const parts = parseYmd(iso);
  if (!parts) return iso.trim();

  const months = locale === "en" ? HIJRI_MONTHS_EN : HIJRI_MONTHS_AR;
  const suffix = locale === "en" ? "AH" : "هـ";
  return `${parts.day} ${months[parts.month - 1]} ${parts.year} ${suffix}`;
}
