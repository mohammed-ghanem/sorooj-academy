"use client";

import ProfileShell from "@/components/auth/profile/ProfileShell";
import TranslateHook from "@/translate/TranslateHook";

export default function ProfileCertificates() {
  const translate = TranslateHook();
  const p = translate?.pages?.profile;

  return (
    <ProfileShell active="certificates">
      <h2 className="mb-5 text-base font-bold mainColor md:text-lg">
        {p?.certificates}
      </h2>
      <p className="text-sm font-semibold descriptionColor">
        {p?.emptyCertificates}
      </p>
    </ProfileShell>
  );
}
