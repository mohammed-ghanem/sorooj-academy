"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroAuth from "../heroAuth/HeroAuth";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import {
  SelectAuthHeaderDescriptionSkeleton,
  SelectAuthHeaderSectionSkeleton,
  SelectAuthHeaderTitleSkeleton,
  SelectAuthRoleCardTextSkeleton,
} from "@/components/skeletons/SelectAuthSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

type AuthRole = "trainer" | "student";

function RoleRadio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked ? "border-[#9F854E] bg-white" : "border-gray-300 bg-white"
      }`}
      aria-hidden
    >
      {checked ? (
        <span className="h-2.5 w-2.5 rounded-full scoundBgColor" />
      ) : null}
    </span>
  );
}

const SelectAuth = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const t = translate?.pages?.selectAuth;
  const isCopyReady = Boolean(t);

  const [role, setRole] = useState<AuthRole>("student");

  const trainerLoginUrl = "https://dashboard-academy.sorooj.org/login";
  const studentLoginPath = `/${lang}/login`;

  const nextButtonClass =
    "mt-8 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity scoundBgColor hover:opacity-95 md:text-base";

  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 mb-10">
          <Image
            src={logo}
            alt=""
            width={140}
            height={48}
            className="h-auto w-35 object-contain"
            priority
          />

          <div
            className=" relative w-full max-w-xl  md:max-w-3xl  rounded-2xl boxBgOpacity p-6 shadow-lg ring-1
           ring-black/5 md:p-8"
          >
            <div className="pointer-events-none absolute top-0 left-0">
              <Image
                src="/assets/images/line.svg"
                alt=""
                width={100}
                height={100}
              />
            </div>

            <div className="relative z-10 text-start">
              <div className="flex items-start justify-between gap-3">
                {isCopyReady ? (
                  <h1 className="min-w-0 flex-1 text-xl font-semibold mainColor md:text-2xl">
                    {t.title} <span className="scoundColor">{t.titleSpan}</span>
                  </h1>
                ) : (
                  <SelectAuthHeaderTitleSkeleton />
                )}
                <div className="relative z-20 shrink-0 me-10 ">
                  <GlobeBtn />
                </div>
              </div>
              {isCopyReady ? (
                <>
                  <p className="mt-2 text-sm text-[#737373] md:text-sm font-semibold">
                    {t.description}
                  </p>
                  <p className="mt-6 font-semibold mainColor md:text-base">
                    {t.sectionTitle}
                  </p>
                </>
              ) : (
                <>
                  <SelectAuthHeaderDescriptionSkeleton />
                  <SelectAuthHeaderSectionSkeleton />
                </>
              )}
            </div>

            <div
              className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
              role="radiogroup"
              aria-label={isCopyReady ? t.sectionTitle : undefined}
            >
              <button
                type="button"
                role="radio"
                aria-checked={role === "student"}
                onClick={() => setRole("student")}
                className={`relative flex w-full flex-col rounded-xl border-2 bg-white p-4 text-start transition-all md:min-h-55 md:p-5 ${
                  role === "student"
                    ? "border-[#9F854E] shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="absolute top-4 inset-s-4">
                  <RoleRadio checked={role === "student"} />
                </div>
                <div className="mt-8 flex flex-1 flex-col items-center gap-3 md:mt-6">
                  <div className="relative h-22 w-22 md:h-30 md:w-30">
                    <Image
                      src="/assets/images/student.png"
                      alt="student"
                      fill
                      className="object-contain"
                    />
                  </div>
                  {isCopyReady ? (
                    <>
                      <span className="text-base font-bold mainColor md:text-lg">
                        {t.studentTitle}
                      </span>
                      <p className="w-full text-center text-xs font-bold leading-relaxed text-[#737373]">
                        {t.studentDescription}
                      </p>
                    </>
                  ) : (
                    <SelectAuthRoleCardTextSkeleton />
                  )}
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={role === "trainer"}
                onClick={() => setRole("trainer")}
                className={`relative flex w-full flex-col rounded-xl border-2 bg-white p-4 text-start transition-all md:min-h-55 md:p-5 ${
                  role === "trainer"
                    ? "border-[#9F854E] shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="absolute top-4 inset-s-4">
                  <RoleRadio checked={role === "trainer"} />
                </div>
                <div className="mt-8 flex flex-1 flex-col items-center gap-3 md:mt-6">
                  <div className="relative h-22 w-22 md:h-30 md:w-30">
                    <Image
                      src="/assets/images/doctor.svg"
                      alt="trainer"
                      fill
                      className="object-contain"
                    />
                  </div>
                  {isCopyReady ? (
                    <>
                      <span className="text-base font-bold mainColor md:text-lg">
                        {t.trainerTitle}
                      </span>
                      <p className="w-full text-center text-xs font-bold leading-relaxed text-[#737373]">
                        {t.trainerDescription}
                      </p>
                    </>
                  ) : (
                    <SelectAuthRoleCardTextSkeleton />
                  )}
                </div>
              </button>
            </div>

            {isCopyReady ? (
              role === "trainer" ? (
                <a
                  href={trainerLoginUrl}
                  className={nextButtonClass}
                  rel="noopener noreferrer"
                >
                  {t.next}
                </a>
              ) : (
                <Link href={studentLoginPath} className={nextButtonClass}>
                  {t.next}
                </Link>
              )
            ) : (
              <Skeleton
                className="mt-8 h-12 w-full rounded-lg"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default SelectAuth;
