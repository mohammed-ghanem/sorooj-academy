"use client";

import { useState } from "react";
import Image from "next/image";
import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  FACULTY_PLACEHOLDERS,
  type FacultyMemberPlaceholder,
} from "./facultyMembersData";

const FacultyMembers = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const f = translate?.pages?.facultyMembers;

  const locale = lang === "en" ? "en" : "ar";

  const [selected, setSelected] = useState<FacultyMemberPlaceholder | null>(
    null,
  );

  if (!translate) {
    return (
      <div className="min-h-[50vh] animate-pulse bg-gray-100/50" aria-hidden />
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <SmallHeroSection
        title={
          <h1 className="mb-4 mt-28 text-2xl font-semibold">
            <span className="mainColor">{f?.title}</span>
            <span className="scoundColor">{f?.titleSpan}</span>
          </h1>
        }
      />

      <div className="container mx-auto mt-20 w-[92%] max-w-7xl px-2 pt-4 pb-16 md:pt-6 md:pb-20">
        {/* Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 
          lg:grid-cols-4 gap-y-20 md:gap-y-16 lg:gap-y-8"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {FACULTY_PLACEHOLDERS.map((m, i) => (
            <div
              key={`${m.name.ar}-${i}`}
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
                      alt={locale === "ar" ? m.name.ar : m.name.en}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 104px, 118px"
                    />
                  </div>
                  <p
                    className="absolute right-0 -bottom-4 left-0 rounded-full border border-solid border-[#ffffff]
                     bg-[#faf7f3b3] px-2 py-2 text-xs font-medium text-[#707070] [box-shadow:1px_1px_10px_#cbcbcb] shadow-md md:text-sm"
                  >
                    {locale === "ar" ? m.department.ar : m.department.en}
                  </p>
                </div>

                <div className="relative z-1 mt-4 flex grow flex-col items-center gap-1.5 pt-1">
                  <h3 className="text-lg font-semibold leading-snug text-black md:text-xl">
                    {locale === "ar" ? m.name.ar : m.name.en}
                  </h3>
                  <p className="max-w-65 text-sm leading-relaxed text-[#707070] md:max-w-none md:text-[15px]">
                    {locale === "ar" ? m.title.ar : m.title.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        {/* Modal */}
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
                    alt={locale === "ar" ? selected.name.ar : selected.name.en}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center md:text-start">
                  <p className="text-lg font-bold leading-snug text-black sm:text-xl">
                    {locale === "ar" ? selected.name.ar : selected.name.en}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#707070] sm:text-[15px] ">
                    {locale === "ar" ? selected.title.ar : selected.title.en}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full border border-solid border-[#ffffff] bg-[#faf7f3b3] px-3 
                  py-1.5 text-xs font-medium text-[#707070] [box-shadow:1px_1px_10px_#cbcbcb] shadow-sm sm:text-sm"
                >
                  {locale === "ar"
                    ? selected.department.ar
                    : selected.department.en}
                </span>
              </div>

              <DialogDescription
                className="text-center md:text-start text-base leading-relaxed font-normal text-black
               sm:text-[15px]"
              >
                {locale === "ar"
                  ? selected.description.ar
                  : selected.description.en}
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
