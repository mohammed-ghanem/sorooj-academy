"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import ProfileShell from "@/components/auth/profile/ProfileShell";
import {
  formatJourneyIndex,
  type ScientificJourneyTerm,
} from "@/lib/profile/scientificJourney";
import { useGetScientificJourneyQuery } from "@/store/auth/authApi";
import { cn } from "@/lib/utils";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import book from "@/public/assets/images/book.svg";
import lessonsIcon from "@/public/assets/images/lessons.svg";

const CARD_TONES = [
  {
    card: "border-[#eadfcf] bg-[#faf6ef]",
    hover: "hover:border-[#e0d2bc] hover:bg-[#f6f0e6]",
    number: "text-[#c4a87a]",
    barTrack: "bg-[#ebe3d6]",
    barFill: "bg-[#9F854E]",
    wash: "bg-[radial-gradient(circle_at_100%_0%,rgba(159,133,78,0.10),transparent_55%)]",
  },
  {
    card: "border-[#d9e0ea] bg-[#f4f6f9]",
    hover: "hover:border-[#cdd6e3] hover:bg-[#eef2f7]",
    number: "text-[#8a94a8]",
    barTrack: "bg-[#e2e7ef]",
    barFill: "bg-[#6b778f]",
    wash: "bg-[radial-gradient(circle_at_100%_0%,rgba(66,76,97,0.08),transparent_55%)]",
  },
  {
    card: "border-[#dde6df] bg-[#f3f7f4]",
    hover: "hover:border-[#cfdcd3] hover:bg-[#ecf3ee]",
    number: "text-[#7f9a88]",
    barTrack: "bg-[#dde8e1]",
    barFill: "bg-[#6a8a75]",
    wash: "bg-[radial-gradient(circle_at_100%_0%,rgba(79,122,98,0.09),transparent_55%)]",
  },
  {
    card: "border-[#e6dfd4] bg-[#f8f4ee]",
    hover: "hover:border-[#dbd0c0] hover:bg-[#f3ede4]",
    number: "text-[#b39a75]",
    barTrack: "bg-[#e8e0d4]",
    barFill: "bg-[#a08a5e]",
    wash: "bg-[radial-gradient(circle_at_100%_0%,rgba(180,148,74,0.09),transparent_55%)]",
  },
] as const;

function JourneyCardsSkeleton() {
  return (
    <ul className="space-y-4" aria-hidden>
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="h-24 animate-pulse rounded-2xl bg-[#f5f1ea]"
        />
      ))}
    </ul>
  );
}

function JourneyTermCard({
  term,
  index,
  lang,
  subjectsLabel,
  lessonsLabel,
  progressTemplate,
  lockedLabel,
}: {
  term: ScientificJourneyTerm;
  index: number;
  lang: string;
  subjectsLabel: string;
  lessonsLabel: string;
  progressTemplate: string;
  lockedLabel: string;
}) {
  const isRtl = lang !== "en";
  const locked = term.isLocked;
  const tone = CARD_TONES[index % CARD_TONES.length];
  const progressText = progressTemplate.replace(
    "{{percent}}",
    String(term.progressPercentage),
  );

  const content = (
    <>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", tone.wash)}
      />

      <span
        className={cn(
          "pointer-events-none absolute top-3.5 text-[1.75rem] font-semibold leading-none sm:text-[2rem]",
          tone.number,
          isRtl ? "left-4" : "right-4",
        )}
        aria-hidden
      >
        {formatJourneyIndex(index + 1, lang)}
      </span>

      <div
        className={cn(
          "relative pe-12 sm:pe-14",
          isRtl ? "text-right" : "text-left",
        )}
      >
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold mainColor sm:text-base">
            {term.title}
          </h3>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-[#9F854E] ring-1 ring-[#eadfcf]/80">
              <Lock className="h-3 w-3" aria-hidden />
              {lockedLabel}
            </span>
          ) : null}
        </div>

        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] descriptionColor">
          <span className="inline-flex items-center gap-1.5">
            <Image src={book} alt="" width={14} height={14} />
            <span>
              {term.subjectsCount} {subjectsLabel}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Image src={lessonsIcon} alt="" width={14} height={14} />
            <span>
              {term.lessonsCount} {lessonsLabel}
            </span>
          </span>
        </div>

        {!locked ? (
          <div className="max-w-xs">
            <div
              className={cn(
                "h-1 overflow-hidden rounded-full",
                tone.barTrack,
              )}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  tone.barFill,
                )}
                style={{
                  width: `${Math.max(0, Math.min(100, term.progressPercentage))}%`,
                }}
              />
            </div>
            <p className="mt-1.5 text-xs descriptionColor">{progressText}</p>
          </div>
        ) : null}
      </div>
    </>
  );

  const cardClass = cn(
    "relative block overflow-hidden rounded-2xl border p-4 sm:p-[1.15rem]",
    tone.card,
    locked
      ? "opacity-80"
      : cn(
          "transition duration-300",
          tone.hover,
          "hover:-translate-y-px hover:shadow-[0_8px_18px_-14px_rgba(66,76,97,0.35)]",
        ),
  );

  if (locked) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <Link href={`/${lang}/study-terms/${term.id}`} className={cardClass}>
      {content}
    </Link>
  );
}

export default function ProfileJourney() {
  const lang = LangUseParams() ?? "ar";
  const translate = TranslateHook();
  const p = translate?.pages?.profile;
  const isRtl = lang !== "en";

  const { data: terms = [], isLoading, isError, isFetching } =
    useGetScientificJourneyQuery(lang, {
      refetchOnMountOrArgChange: true,
    });

  const showLoading = isLoading || (isFetching && terms.length === 0);

  return (
    <ProfileShell active="journey">
      <h2 className="mb-5 text-base font-bold mainColor md:text-lg">
        {p?.journey}
      </h2>

      {showLoading ? <JourneyCardsSkeleton /> : null}

      {!showLoading && isError ? (
        <p className="text-sm font-semibold descriptionColor">
          {p?.journeyLoadError ?? p?.emptyJourney}
        </p>
      ) : null}

      {!showLoading && !isError && terms.length === 0 ? (
        <p className="text-sm font-semibold descriptionColor">
          {p?.emptyJourney}
        </p>
      ) : null}

      {!showLoading && !isError && terms.length > 0 ? (
        <ol className="relative m-0 list-none space-y-4 p-0">
          <span
            className={cn(
              "absolute top-3 bottom-3 w-px bg-[#c5ccd8]",
              isRtl ? "right-2" : "left-2",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "absolute top-3 bottom-3 border-s border-dotted border-[#c9d4e4]",
              isRtl ? "right-4" : "left-4",
            )}
            aria-hidden
          />

          {terms.map((term, index) => {
            const completed = term.progressPercentage >= 100;

            return (
              <li key={term.id} className="relative ps-12 sm:ps-14">
                <span
                  className={cn(
                    "absolute top-[1.35rem] z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#424C61] bg-white",
                    isRtl ? "right-1" : "left-1",
                  )}
                  aria-hidden
                >
                  {completed ? (
                    <span className="h-2 w-2 rounded-full bg-[#424C61]" />
                  ) : null}
                </span>

                <JourneyTermCard
                  term={term}
                  index={index}
                  lang={lang}
                  subjectsLabel={p?.journeySubjects ?? ""}
                  lessonsLabel={p?.journeyLessons ?? ""}
                  progressTemplate={p?.journeyProgress ?? "{{percent}}%"}
                  lockedLabel={p?.journeyLocked ?? ""}
                />
              </li>
            );
          })}
        </ol>
      ) : null}
    </ProfileShell>
  );
}
