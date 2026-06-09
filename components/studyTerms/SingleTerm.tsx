"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SingleTermDetailSkeleton, {
  SingleTermHeroTitleSkeleton,
} from "@/components/skeletons/SingleTermDetailSkeleton";
import InfoModal from "@/components/modals/InfoModal";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import {
  extractApiErrorMessage,
  readRtkQueryHttpStatus,
} from "@/lib/studentProgram/programErrors";
import { useGetStudyTermDetailQuery } from "@/store/studyTerms/studyTermsApi";
import { useLazyGetSubjectDetailQuery } from "@/store/subjects/subjectsApi";
import type { StudySubject } from "@/types/studySubject";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import card from "@/public/assets/images/card.jpg";

function getSubjectActionLabel(
  progressPercent: number,
  labels: {
    startStudy?: string;
    continueStudy?: string;
    reviewStudy?: string;
  },
): string {
  if (progressPercent >= 100) {
    return labels.reviewStudy ?? labels.startStudy ?? "";
  }
  if (progressPercent > 0) {
    return labels.continueStudy ?? labels.startStudy ?? "";
  }
  return labels.startStudy ?? "";
}

const SingleTerm = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.studyTermDetail;
  const subjectT = translate?.pages?.subjectDetail;
  const router = useRouter();
  const lang = LangUseParams();

  const { termId } = useParams<{
    termId: string;
  }>();

  const dir = lang === "en" ? "ltr" : "rtl";
  const listHref = `/${lang}/study-terms`;

  const idNum = useMemo(
    () => (termId && !Number.isNaN(Number(termId)) ? Number(termId) : NaN),
    [termId],
  );

  const apiReady = useStudentApiReady();
  const invalidId = !termId || Number.isNaN(idNum);
  const skipQuery = invalidId || !apiReady;

  const {
    data: term,
    isLoading,
    isFetching,
    isError,
    error: termError,
    refetch,
  } = useGetStudyTermDetailQuery(
    { id: termId ?? "", lang: lang ?? "ar" },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const [fetchSubjectDetail] = useLazyGetSubjectDetailQuery();

  const [subjectLockedOpen, setSubjectLockedOpen] = useState(false);
  const [subjectLockedMessage, setSubjectLockedMessage] = useState("");
  const [termAccessDeniedOpen, setTermAccessDeniedOpen] = useState(false);
  const [termAccessDeniedMessage, setTermAccessDeniedMessage] = useState("");
  const [startingSubjectId, setStartingSubjectId] = useState<number | null>(
    null,
  );

  const showSkeleton =
    !invalidId && (!apiReady || isLoading || (isFetching && !term));

  const termAccessDenied =
    !invalidId &&
    !showSkeleton &&
    isError &&
    readRtkQueryHttpStatus(termError) === 403;
  const showError =
    !invalidId && !showSkeleton && !termAccessDenied && (isError || !term);
  const subjects = term?.subjects ?? [];

  useEffect(() => {
    if (!termAccessDenied) return;
    setTermAccessDeniedMessage(
      extractApiErrorMessage(termError, t?.notFound ?? ""),
    );
    setTermAccessDeniedOpen(true);
  }, [termAccessDenied, termError, t?.notFound]);

  const handleSubjectStart = useCallback(
    async (subject: StudySubject) => {
      if (startingSubjectId !== null) return;

      if (!subject.canAccessSubject) {
        setSubjectLockedMessage(
          subjectT?.subjectLockedMessage ?? t?.subjectLockedTitle ?? "",
        );
        setSubjectLockedOpen(true);
        return;
      }

      setStartingSubjectId(subject.id);

      try {
        await fetchSubjectDetail({
          id: subject.id,
          lang: lang ?? "ar",
        }).unwrap();

        router.push(`/${lang}/study-terms/${termId}/content/${subject.id}`);
      } catch (err) {
        const status =
          err && typeof err === "object"
            ? (err as { status?: number }).status
            : undefined;

        if (status === 403) {
          setSubjectLockedMessage(
            extractApiErrorMessage(
              err,
              subjectT?.subjectLockedMessage ?? "",
            ),
          );
          setSubjectLockedOpen(true);
          return;
        }

        setSubjectLockedMessage(
          extractApiErrorMessage(err, t?.notFound ?? ""),
        );
        setSubjectLockedOpen(true);
      } finally {
        setStartingSubjectId(null);
      }
    },
    [
      fetchSubjectDetail,
      lang,
      router,
      startingSubjectId,
      subjectT?.subjectLockedMessage,
      t?.notFound,
      t?.subjectLockedTitle,
      termId,
    ],
  );

  const handleSubjectCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    subject: StudySubject,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    void handleSubjectStart(subject);
  };

  if (invalidId) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-lg mainColor font-medium mb-4">{t?.notFound}</p>
        <Link href={listHref} className="text-sm scoundColor hover:underline">
          {t?.back}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SmallHeroSection
        title={
          <div className="text-center w-full max-w-3xl">
            <Link
              href={listHref}
              className="text-sm scoundColor hover:underline inline-block mb-2"
            >
              ← {t?.back}
            </Link>
            {showSkeleton || !term ? (
              <SingleTermHeroTitleSkeleton />
            ) : (
              <h1 className="text-2xl font-semibold mt-2 mb-4">
                <span className="mainColor">
                  {String(term.id).padStart(2, "0")}.{" "}
                </span>
                <span className="scoundColor">{term.title}</span>
              </h1>
            )}
          </div>
        }
      />

      <div className="bg-[#F6F6F6] px-2 pt-4 pb-16 md:pt-6 md:pb-24">
        {showSkeleton && <SingleTermDetailSkeleton />}

        {showError && (
          <div className="container mx-auto flex min-h-[40vh] w-[80%] flex-col items-center justify-center py-16 text-center">
            <p className="text-lg mainColor font-medium mb-4">{t?.notFound}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => refetch()}
                className="scoundBgColor rounded-lg px-4 py-2 text-sm text-white"
              >
                {t?.retry}
              </button>
              <Link
                href={listHref}
                className="text-sm scoundColor hover:underline self-center"
              >
                {t?.back}
              </Link>
            </div>
          </div>
        )}

        {!showSkeleton && !showError && term && (
          <div className="container mx-auto py-4 md:py-20 w-[80%]">
            {subjects.length === 0 ? (
              <p className="text-center text-sm text-gray-600">
                {t?.emptySubjects}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {subjects.map((subject) => {
                  const progressPercent = subject.lessonsProgress.percentage;
                  const isStarting = startingSubjectId === subject.id;

                  return (
                    <div
                      key={subject.id}
                      role="button"
                      tabIndex={0}
                      aria-busy={isStarting}
                      onClick={() => void handleSubjectStart(subject)}
                      onKeyDown={(event) =>
                        handleSubjectCardKeyDown(event, subject)
                      }
                      className={cn(
                        "bg-white rounded-xl sm:rounded-2xl shadow-r-sm text-center sm:text-right overflow-hidden pb-4 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F854E]/40",
                        isStarting && "opacity-80",
                      )}
                    >
                      <div className="mb-4 w-full h-40 relative">
                        <Image
                          src={subject.cover || card.src}
                          fill
                          alt={subject.title}
                          className="p-2.5 rounded-3xl object-cover"
                          unoptimized={Boolean(subject.cover)}
                        />
                      </div>

                      <div className="mx-4">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-md font-semibold mainColor">
                            {subject.title}
                          </h2>
                        </div>

                        {subject.description ? (
                          <p className="text-sm text-gray-600 leading-relaxed mb-2">
                            {subject.description}
                          </p>
                        ) : null}

                        <div className="flex flex-wrap justify-center sm:justify-start gap-1 mb-1">
                          <div className="flex items-center">
                            <Image
                              src={lessons.src}
                              width={20}
                              height={20}
                              alt=""
                            />
                            <p className="me-2 ms-2 descriptionColor">
                              <span className="me-0.5">
                                {subject.lessonsCount}
                              </span>
                              <span>{t?.lessonUnit}</span>
                            </p>
                          </div>
                        </div>

                        <div className="m2-4 flex items-center justify-between">
                          <p className="text-sm mainColor font-semibold">
                            {t?.progress}
                          </p>
                          <p className="text-xs text-gray-500">
                            {progressPercent}%
                          </p>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                          <div
                            className="h-full scoundBgColor transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        <hr className="my-2" />

                        <div className="text-end mt-4">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center gap-2 text-sm text-white bkMainColor px-4 py-2 rounded-md font-medium",
                              isStarting && "opacity-90",
                            )}
                          >
                            {getSubjectActionLabel(progressPercent, {
                              startStudy: t?.startStudy,
                              continueStudy: t?.continueStudy,
                              reviewStudy: t?.reviewStudy,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <InfoModal
          open={subjectLockedOpen}
          onOpenChange={setSubjectLockedOpen}
          variant="info"
          title={t?.subjectLockedTitle ?? ""}
          description={subjectLockedMessage}
          primaryLabel={t?.close ?? subjectT?.close ?? ""}
          onPrimaryClick={() => setSubjectLockedOpen(false)}
          dir={dir}
        />

        <InfoModal
          open={termAccessDeniedOpen}
          onOpenChange={(open) => {
            setTermAccessDeniedOpen(open);
            if (!open) router.push(listHref);
          }}
          variant="info"
          title={translate?.pages?.studyTerms?.termLockedTitle ?? ""}
          description={termAccessDeniedMessage}
          primaryLabel={t?.close ?? ""}
          onPrimaryClick={() => {
            setTermAccessDeniedOpen(false);
            router.push(listHref);
          }}
          dir={dir}
        />
      </div>
    </div>
  );
};

export default SingleTerm;
