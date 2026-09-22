export type ScientificJourneyTerm = {
  id: number;
  title: string;
  academicYearName: string;
  subjectsCount: number;
  lessonsCount: number;
  progressPercentage: number;
  isCurrent: boolean;
  isLocked: boolean;
  isCompleted: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function pickString(
  obj: Record<string, unknown> | null,
  keys: string[],
): string {
  if (!obj) return "";
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function pickNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function pickBool(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function pickTitle(raw: Record<string, unknown>, lang: string): string {
  if (lang === "en") {
    return (
      pickString(raw, ["name_en", "name", "name_ar", "title"]) ||
      "Study term"
    );
  }
  return (
    pickString(raw, ["name_ar", "name", "name_en", "title"]) || "المحور"
  );
}

export function unwrapScientificJourneyTerms(payload: unknown): unknown[] {
  const root = asRecord(payload);
  if (!root) return [];

  const data = asRecord(root.data) ?? root;
  const list =
    data.StudyTerms ??
    data.study_terms ??
    data.studyTerms ??
    data.terms ??
    root.StudyTerms;

  return Array.isArray(list) ? list : [];
}

export function mapScientificJourneyTerm(
  raw: unknown,
  lang: string,
): ScientificJourneyTerm | null {
  const obj = asRecord(raw);
  if (!obj) return null;

  const id = pickNumber(obj.id);
  if (!id) return null;

  const year = asRecord(obj.academic_year) ?? asRecord(obj.academicYear);
  const progress =
    asRecord(obj.subjects_progress) ?? asRecord(obj.subjectsProgress);

  const percentage = Math.max(
    0,
    Math.min(100, Math.round(pickNumber(progress?.percentage))),
  );

  return {
    id,
    title: pickTitle(obj, lang),
    academicYearName: pickString(year, ["name", "name_ar", "name_en"]),
    subjectsCount: pickNumber(obj.subjects_count ?? obj.subjectsCount),
    lessonsCount: pickNumber(obj.lessons_count ?? obj.lessonsCount),
    progressPercentage: percentage,
    isCurrent: pickBool(obj.is_current ?? obj.isCurrent),
    isLocked: pickBool(obj.is_locked ?? obj.isLocked),
    // Visual completion follows progress — API flag can be true before 100%.
    isCompleted: percentage >= 100,
  };
}

export function mapScientificJourneyTerms(
  payload: unknown,
  lang: string,
): ScientificJourneyTerm[] {
  return unwrapScientificJourneyTerms(payload)
    .map((item) => mapScientificJourneyTerm(item, lang))
    .filter((item): item is ScientificJourneyTerm => item !== null);
}

/** Display index `01` / `٠١` for journey cards. */
export function formatJourneyIndex(index: number, lang: string): string {
  const padded = String(Math.max(1, index)).padStart(2, "0");
  if (lang !== "ar") return padded;
  return padded.replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)] ?? digit);
}
