"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import SingleTermDetailSkeleton, {
  SingleTermHeroTitleSkeleton,
} from "@/components/skeletons/SingleTermDetailSkeleton";
import { useStudentApiReady } from "@/hooks/useStudentApiReady";
import { useGetStudyTermDetailQuery } from "@/store/studyTerms/studyTermsApi";
import TranslateHook from "@/translate/TranslateHook";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import card from "@/public/assets/images/card.jpg";

const SingleTerm = () => {
  const translate = TranslateHook();
  const t = translate?.pages?.studyTermDetail;

  const { lang, termId } = useParams<{
    lang: string;
    termId: string;
  }>();

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
    refetch,
  } = useGetStudyTermDetailQuery(
    { id: termId ?? "", lang: lang ?? "ar" },
    { skip: skipQuery, refetchOnMountOrArgChange: true },
  );

  const showSkeleton =
    !invalidId && (!apiReady || isLoading || (isFetching && !term));
  const showError = !invalidId && !showSkeleton && (isError || !term);
  const subjects = term?.subjects ?? [];

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
      {/* Hero stays mounted on refresh — same pattern as StudyTerms */}
      <SmallHeroSection
        title={
          <div className="text-center w-full max-w-3xl">
            <Link
              href={listHref}
              className="text-sm scoundColor hover:underline inline-block mb-2"
            >
              ← {t?.back}
            </Link>
            {showSkeleton ? (
              <SingleTermHeroTitleSkeleton />
            ) : (
              <h1 className="text-2xl font-semibold mt-2 mb-4">
                <span className="mainColor">
                  {String(term!.id).padStart(2, "0")}.{" "}
                </span>
                <span className="scoundColor">{term!.title}</span>
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

        {!showSkeleton && !showError && (
          <div className="container mx-auto py-4 md:py-20 w-[80%]">
            {subjects.length === 0 ? (
              <p className="text-center text-sm text-gray-600">
                {t?.emptySubjects}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-r-sm text-center sm:text-right overflow-hidden pb-4"
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
                            <span className="me-0.5">{subject.lessonsCount}</span>
                            <span>{t?.lessonUnit}</span>
                          </p>
                        </div>
                      </div>

                      <div className="m2-4 flex items-center justify-between">
                        <p className="text-sm mainColor font-semibold">
                          {t?.progress}
                        </p>
                        <p className="text-xs text-gray-500">
                          {subject.progress}%
                        </p>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                        <div
                          className="h-full scoundBgColor transition-all duration-500"
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>

                      <hr className="my-2" />

                      <div className="text-end mt-4">
                        <Link
                          href={`/${lang}/study-terms/${termId}/content/${subject.id}`}
                          className="text-sm text-white bkMainColor px-4 py-2 rounded-md font-medium"
                        >
                          {t?.startStudy}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleTerm;
