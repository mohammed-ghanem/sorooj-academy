"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import ProfileShell from "@/components/auth/profile/ProfileShell";
import {
  asProfileText,
  profilePlaceName,
  unwrapProfileUser,
} from "@/components/auth/profile/profileUser";
import { useGetProfileQuery } from "@/store/auth/authApi";
import { formatGregorianDate } from "@/lib/studyPlan/formatStudyPlanDates";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

function ProfileDetails() {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const p = translate?.pages?.profile;

  const { data } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = unwrapProfileUser(data);

  const dash = p?.emptyValue ?? "—";
  const name = asProfileText(user?.name) || dash;
  const genderLabel =
    asProfileText(user?._gender) || asProfileText(user?.gender);
  const birthDate = asProfileText(user?.date_of_birth)
    ? formatGregorianDate(
        asProfileText(user?.date_of_birth),
        lang === "ar" ? "ar" : "en",
      )
    : "";
  const country = profilePlaceName(user?.country);

  const infoRows = [
    { label: p?.name, value: name },
    { label: p?.email, value: asProfileText(user?.email) },
    { label: p?.dateOfBirth, value: birthDate },
    { label: p?.country, value: country },
    { label: p?.gender, value: genderLabel },
  ];

  return (
    <ProfileShell active="personal">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold mainColor md:text-lg">
          {p?.personalDetails}
        </h2>
        <Link
          href={`/${lang}/update-profile`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold scoundColor hover:underline"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          {p?.editProfile}
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {infoRows.map((row) => (
          <div key={row.label} className="text-start">
            <p className="mb-1 text-xs font-semibold descriptionColor">
              {row.label}
            </p>
            <p className="text-sm font-bold mainColor">{row.value || dash}</p>
          </div>
        ))}
      </div>
    </ProfileShell>
  );
}

export default ProfileDetails;
