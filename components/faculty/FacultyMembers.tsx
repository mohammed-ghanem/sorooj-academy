"use client";

import { useState } from "react";
import Image from "next/image";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import FacultyMembersSkeleton, {
  FacultyMembersHeroTitleSkeleton,
} from "@/components/skeletons/FacultyMembersSkeleton";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useGetDoctorsQuery } from "@/store/facultyMembers/facultyMembersApi";
import type { FacultyMemberCard } from "@/store/facultyMembers/facultyMembersApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const FacultyMembers = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const f = translate?.pages?.facultyMembers;

  const locale = lang === "en" ? "en" : "ar";

  const { data: doctors = [], isLoading, isError, refetch } = useGetDoctorsQuery(
    { lang: lang ?? "ar" },
  );

  const [selected, setSelected] = useState<FacultyMemberCard | null>(null);

  if (!translate) {
    return (
      <div className="bg-white">
        <SmallHeroSection title={<FacultyMembersHeroTitleSkeleton />} />
        <div className="container mx-auto mt-20 w-[92%] max-w-7xl px-2 pt-4 pb-16 md:pt-6 md:pb-20">
          <FacultyMembersSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SmallHeroSection
        title={
          <h1 className="mb-4 mt-28 text-2xl font-semibold">
            <span className="mainColor">{f?.title}</span>
            <span className="scoundColor">{f?.titleSpan}</span>
          </h1>
        }
      />

      <div className="container mx-auto mt-20 w-[92%] max-w-7xl px-2 pt-4 pb-16 md:pt-6 md:pb-20">
        {isLoading && <FacultyMembersSkeleton />}

        {isError && !isLoading && (
          <div
            className="rounded-xl border border-red-200 bg-red-50/80 p-8 text-center text-sm text-red-800"
            role="alert"
          >
            <p className="mb-4 font-semibold">
              {f?.error ?? (locale === "ar" ? "تعذر تحميل البيانات." : "Could not load faculty.")}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="scoundBgColor rounded-lg px-4 py-2 text-white"
            >
              {locale === "ar" ? "إعادة المحاولة" : "Try again"}
            </button>
          </div>
        )}

        {!isLoading && !isError && doctors.length === 0 && (
          <p className="text-center text-sm text-gray-600">
            {f?.empty ??
              (locale === "ar"
                ? "لا يوجد أعضاء هيئة تدريس حالياً."
                : "No faculty members to display.")}
          </p>
        )}

        {!isLoading && !isError && doctors.length > 0 && (
          <div
            className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4 gap-y-20 md:gap-y-16 lg:gap-y-8"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {doctors.map((m) => (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(m)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(m);
                  }
                }}
                className="relative mx-auto h-full w-full max-w-sm cursor-pointer overflow-visible text-center"
              >
                <div
                  className=" relative h-full rounded-3xl border border-[#E8E0D4]/60 bg-[#FAF7F2] px-5 
                pt-16 pb-8 shadow-sm md:rounded-[18px] md:pt-17 md:pb-10 md:px-6"
                >
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] md:rounded-[18px]"
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute right-0 bottom-0">
                    <Image
                      src="/assets/images/lineCard.svg"
                      alt=""
                      width={100}
                      height={100}
                      className="h-full w-full"
                    />
                  </div>

                  <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="relative size-26 overflow-hidden rounded-full border-[3px] border-[#d1c1a7]
                     bg-white shadow-md md:size-29.5 md:border-4"
                    >
                      <Image
                        src={m.imageSrc}
                        alt={m.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 104px, 118px"
                      />
                    </div>
                    <p
                      className="absolute right-0 -bottom-4 left-0 rounded-full border border-solid border-[#ffffff]
                     bg-[#faf7f3b3] px-2 py-2 text-xs font-medium text-[#707070] [box-shadow:1px_1px_10px_#cbcbcb] shadow-md md:text-sm"
                    >
                      {m.department}
                    </p>
                  </div>

                  <div className="relative z-1 mt-4 flex grow flex-col items-center gap-1.5 pt-1">
                    <h3 className="text-lg font-semibold leading-snug text-black md:text-xl">
                      {m.name}
                    </h3>
                    <p className="max-w-65 text-sm leading-relaxed text-[#707070] md:max-w-none md:text-[15px]">
                      {m.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="max-h-[min(85vh,calc(100%-2rem))] max-w-[calc(100%-2rem)] gap-5 overflow-y-auto rounded-3xl
           border border-[#E8E0D4]/60 bg-[#ffffff] p-6 shadow-lg sm:max-w-xl sm:p-8 "
        >
          {selected && (
            <>
              <DialogTitle className="text-center text-lg font-semibold mainColor sm:text-xl">
                {f?.bioModalTitle}
              </DialogTitle>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div
                  className="relative size-22 shrink-0 overflow-hidden rounded-full border-[3px] 
                border-[#d1c1a7] bg-white shadow-sm sm:size-25"
                >
                  <Image
                    src={selected.imageSrc}
                    alt={selected.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center md:text-start">
                  <p className="text-lg font-bold leading-snug text-black sm:text-xl">
                    {selected.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#707070] sm:text-[15px] ">
                    {selected.title}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full border border-solid border-[#ffffff] bg-[#faf7f3b3] px-3 
                  py-1.5 text-xs font-medium text-[#707070] [box-shadow:1px_1px_10px_#cbcbcb] shadow-sm sm:text-sm"
                >
                  {selected.department}
                </span>
              </div>

              <DialogDescription
                className="text-center md:text-start text-base leading-relaxed font-normal text-black
               sm:text-[15px]"
              >
                {selected.description || "—"}
              </DialogDescription>
            </>
          )}

          <DialogClose asChild>
            <button
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-0.5
                hover:bg-gray-200 transition border rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyMembers;
