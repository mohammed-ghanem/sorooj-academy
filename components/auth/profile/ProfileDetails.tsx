"use client";

import Link from "next/link";
import { CalendarDays, Mail, MapPin, Pencil, UserRound } from "lucide-react";
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
    {
      label: p?.name,
      value: name,
      icon: UserRound,
      tone: "bg-[#e8edf4] text-[#424C61]",
    },
    {
      label: p?.email,
      value: asProfileText(user?.email),
      icon: Mail,
      tone: "bg-[#e9eef6] text-[#5A6B8A]",
    },
    {
      label: p?.dateOfBirth,
      value: birthDate,
      icon: CalendarDays,
      tone: "bg-[#f3ead6] text-[#9F854E]",
    },
    {
      label: p?.country,
      value: country,
      icon: MapPin,
      tone: "bg-[#e5f0ea] text-[#4F7A62]",
    },
    {
      label: p?.gender,
      value: genderLabel,
      icon: UserRound,
      tone: "bg-[#f3ead6] text-[#9F854E]",
    },
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

      <div className="flex flex-col gap-3">
        {infoRows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="flex items-center gap-3 rounded-xl bg-[#f8f5ef] px-3 py-3"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${row.tone}`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 text-start">
                <p className="mb-0.5 text-xs font-semibold descriptionColor">
                  {row.label}
                </p>
                <p className="text-sm font-bold mainColor">
                  {row.value || dash}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ProfileShell>
  );
}

export default ProfileDetails;
