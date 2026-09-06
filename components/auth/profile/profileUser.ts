export type ProfileUser = {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
  avatar?: string;
  image?: string;
  gender?: string;
  _gender?: string;
  date_of_birth?: string;
  country?: { id?: number; name?: string } | string;
  certificates_count?: number;
  academy_count?: number;
  independent_count?: number;
  tabs?: unknown[];
  certificates?: unknown[];
};

export function unwrapProfileUser(payload: unknown): ProfileUser | null {
  const p = payload as {
    user?: ProfileUser;
    data?: { user?: ProfileUser };
  };
  if (p?.user && typeof p.user === "object") return p.user;
  if (p?.data?.user && typeof p.data.user === "object") return p.data.user;
  if (payload && typeof payload === "object" && "email" in payload) {
    return payload as ProfileUser;
  }
  return null;
}

export function asProfileText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

export function profilePlaceName(
  value: { name?: string } | string | undefined,
): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return asProfileText(value.name);
}

export function profileCountryId(
  value: { id?: number } | string | undefined,
): string {
  if (!value || typeof value === "string") return "";
  return value.id != null ? String(value.id) : "";
}
