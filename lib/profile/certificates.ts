export type StudentCertificate = {
  id: number;
  title: string;
  imageUrl: string;
  issuedAt: string;
  hasFiles: boolean;
  type: string;
};

export type StudentCertificateTab = {
  key: string;
  label: string;
  count: number;
  certificates: StudentCertificate[];
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

function pickNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function unwrapCertificatePayload(payload: unknown): unknown {
  const root = asRecord(payload);
  if (!root) return payload;

  const data = asRecord(root.data) ?? root;
  return (
    data.certificate ??
    data.item ??
    (Array.isArray(data.certificates) ? data.certificates[0] : undefined) ??
    data
  );
}

export function mapStudentCertificate(
  raw: unknown,
): StudentCertificate | null {
  const obj = asRecord(raw);
  if (!obj) return null;

  const id = pickNumber(obj.id);
  if (id == null || id <= 0) return null;

  const year = asRecord(obj.academic_year);
  const term = asRecord(obj.study_term);
  const subject = asRecord(obj.subject);

  const title =
    pickString(obj, [
      "title",
      "name",
      "_title",
      "certificate_name",
      "label",
    ]) ||
    pickString(subject, ["name", "title"]) ||
    pickString(term, ["name", "title"]) ||
    pickString(year, ["name", "title"]);

  const imageUrl = pickString(obj, [
    "image_url",
    "image",
    "preview_url",
    "thumbnail_url",
    "file_url",
    "url",
  ]);

  const issuedAt = pickString(obj, [
    "issued_at",
    "issued_date",
    "granted_at",
    "created_at",
    "date",
  ]);

  const hasFiles =
    obj.has_files !== false &&
    obj.has_files !== 0 &&
    obj.has_files !== "0";

  return {
    id,
    title,
    imageUrl,
    issuedAt,
    hasFiles,
    type: pickString(obj, ["type", "key", "source"]),
  };
}

export function mapCertificateTabs(
  user: {
    tabs?: unknown[];
    certificates?: unknown[];
  } | null,
  fallbackLabel: string,
): StudentCertificateTab[] {
  const rawTabs = Array.isArray(user?.tabs) ? user.tabs : [];
  const tabs = rawTabs
    .map((tab): StudentCertificateTab | null => {
      const obj = asRecord(tab);
      if (!obj) return null;
      const key = pickString(obj, ["key", "type", "id"]);
      if (!key) return null;
      const certificates = Array.isArray(obj.certificates)
        ? obj.certificates
            .map(mapStudentCertificate)
            .filter((item): item is StudentCertificate => item != null)
        : [];
      const count = pickNumber(obj.count) ?? certificates.length;
      return {
        key,
        label: pickString(obj, ["label", "name", "title"]) || fallbackLabel,
        count,
        certificates,
      };
    })
    .filter((tab): tab is StudentCertificateTab => tab != null);

  if (tabs.length > 0) return tabs;

  const certificates = Array.isArray(user?.certificates)
    ? user.certificates
        .map(mapStudentCertificate)
        .filter((item): item is StudentCertificate => item != null)
    : [];

  return [
    {
      key: "all",
      label: fallbackLabel,
      count: certificates.length,
      certificates,
    },
  ];
}

export function mergeCertificate(
  current: StudentCertificate,
  incoming: StudentCertificate | null,
): StudentCertificate {
  if (!incoming) return current;
  return {
    id: incoming.id || current.id,
    title: incoming.title || current.title,
    imageUrl: incoming.imageUrl || current.imageUrl,
    issuedAt: incoming.issuedAt || current.issuedAt,
    hasFiles: incoming.hasFiles,
    type: incoming.type || current.type,
  };
}

export function isLikelyImageUrl(url: string): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return /\.(avif|gif|jpe?g|png|webp|svg)$/.test(clean) || !/\.pdf$/.test(clean);
}

export function filenameFromContentDisposition(header?: string): string {
  if (!header) return "";
  const utf = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf?.[1]) {
    try {
      return decodeURIComponent(utf[1].trim());
    } catch {
      return utf[1].trim();
    }
  }
  const simple = header.match(/filename="?([^";]+)"?/i);
  return simple?.[1]?.trim() ?? "";
}

export function saveBlobFile(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}
