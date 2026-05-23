"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection";
import TranslateHook from "@/translate/TranslateHook";
import book from "@/public/assets/images/book.svg";
import lessons from "@/public/assets/images/lessons.svg";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useGetStudyTermsQuery } from "@/store/studyTerms/studyTermsApi";
import StudyTermsCardsSkeleton from "@/components/skeletons/StudyTermsCardsSkeleton";
import InfoModal from "@/components/modals/InfoModal";
import {
  hasAccessToken,
  isStudentEnrolledFromCookie,
  studiesHaveStartedFromCookie,
} from "@/lib/auth/studentGate";
import { useEnrollInProgramMutation } from "@/store/studentHome/studentHomeApi";
import { useLazyGetProfileQuery } from "@/store/auth/authApi";
import {
  extractApiErrorMessage,
  extractStudyStartFromPayload,
  formatStudyStartForLocale,
  messageWithBackendFallback,
} from "@/lib/studentProgram/programErrors";
import {
  finalizeEnrollGate,
  parseEnrollResponse,
  type EnrollGateSnapshot,
} from "@/lib/studentProgram/enrollGate";
import {
  isStudyTermCompleted,
  isStudyTermUnlocked,
} from "@/lib/studyTerms/termUnlock";

type Gate =
  | "login"
  | "enroll"
  | "enrollSuccess"
  | "studyReady"
  | "studyNotStarted"
  | null;

const authCookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

function persistProfileToCookie(profile: unknown) {
  const p = profile as { data?: unknown; user?: unknown };
  const user = p?.data ?? p?.user ?? profile;
  if (user && typeof user === "object") {
    try {
      Cookies.set("user", JSON.stringify(user), authCookieOptions);
    } catch {
      /* ignore */
    }
  }
}

const StudyTerms = () => {
  const translate = TranslateHook();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = langParam ?? "ar";

  const {
    data: studyTerms = [],
    isLoading,
    isError,
    error: studyTermsError,
    refetch,
  } = useGetStudyTermsQuery({ lang });

  const td = translate?.pages?.studyTermDetail;
  const st = translate?.pages?.studyTerms;

  const lockedLabel = st?.locked ?? "Locked";
  const previousLabel = st?.previous ?? "Previous";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const studyPlanHref = `/${lang}/study-plan`;

  const [gate, setGate] = useState<Gate>(null);
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState("");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [gateSnapshot, setGateSnapshot] = useState<EnrollGateSnapshot | null>(
    null,
  );
  const [gateLoading, setGateLoading] = useState(false);
  const [enterTermMessage, setEnterTermMessage] = useState("");
  const [studiesHaveStarted, setStudiesHaveStarted] = useState(
    () => studiesHaveStartedFromCookie(),
  );

  const [enrollInProgram, { isLoading: enrollSubmitting }] =
    useEnrollInProgramMutation();
  const [triggerGetProfile] = useLazyGetProfileQuery();

  function resetGateExtras() {
    setPendingHref(null);
    setEnrollError("");
    setEnrollSuccessMessage("");
    setGateSnapshot(null);
    setGateLoading(false);
    setEnterTermMessage("");
  }

  function showStudyNotStarted(snapshot: EnrollGateSnapshot) {
    setGateSnapshot(snapshot);
    setEnrollSuccessMessage(snapshot.message);
    setGate("studyNotStarted");
  }

  /** POST enroll-in-program — updates `studies_have_started` on user cookie when true. */
  async function refreshEnrollGate(): Promise<EnrollGateSnapshot> {
    setGateLoading(true);
    try {
      const data = await enrollInProgram({ lang }).unwrap();
      const snap = parseEnrollResponse(data);
      setGateSnapshot(snap);
      setStudiesHaveStarted(snap.studiesHaveStarted);
      return snap;
    } catch (e) {
      const snap = finalizeEnrollGate(
        {
          message: extractApiErrorMessage(e, ""),
          studyStartsAt: extractStudyStartFromPayload(
            (e as { data?: unknown })?.data,
          ),
        },
        (e as { data?: unknown })?.data,
      );
      setGateSnapshot(snap);
      setStudiesHaveStarted(snap.studiesHaveStarted);
      return snap;
    } finally {
      setGateLoading(false);
    }
  }

  async function syncProfileAfterEnroll() {
    try {
      const profile = await triggerGetProfile().unwrap();
      persistProfileToCookie(profile);
    } catch (e) {
      const m = extractApiErrorMessage(e, "");
      if (m) toast.error(m);
    }
  }

  function navigateToTerm(href: string) {
    setGate(null);
    resetGateExtras();
    router.push(href);
  }

  function resolveTermHref(termId?: number): string | null {
    if (termId != null) return `/${lang}/study-terms/${termId}`;
    const first = studyTerms[0];
    return first ? `/${lang}/study-terms/${first.id}` : null;
  }

  async function handleEnrollSubmit() {
    setEnrollError("");
    try {
      const data = await enrollInProgram({ lang }).unwrap();
      const snap = parseEnrollResponse(data);
      setStudiesHaveStarted(snap.studiesHaveStarted);
      setGateSnapshot(snap);
      await syncProfileAfterEnroll();
      setStudiesHaveStarted(studiesHaveStartedFromCookie());

      if (!snap.studiesHaveStarted) {
        showStudyNotStarted(snap);
        return;
      }

      const target = pendingHref ?? resolveTermHref();
      if (target) {
        navigateToTerm(target);
        return;
      }

      setEnrollSuccessMessage(snap.message);
      setGate("enrollSuccess");
    } catch (e) {
      setEnrollError(
        messageWithBackendFallback(
          extractApiErrorMessage(e, ""),
          st?.enrollRequestFailed ?? "",
        ),
      );
    }
  }

  async function handleTermActivate(
    href: string,
    termUnlocked: boolean,
    isFirstTerm: boolean,
  ) {
    if (!hasAccessToken()) {
      setGate("login");
      return;
    }
    if (!isStudentEnrolledFromCookie()) {
      setPendingHref(href);
      setEnrollError("");
      setGate("enroll");
      return;
    }

    setPendingHref(href);

    const started =
      studiesHaveStarted || studiesHaveStartedFromCookie();

    if (!started) {
      const snap = await refreshEnrollGate();
      setStudiesHaveStarted(snap.studiesHaveStarted);

      if (!snap.studiesHaveStarted) {
        showStudyNotStarted(snap);
        return;
      }

      if (isFirstTerm) {
        const backendMessage = snap.message.trim();
        if (backendMessage) {
          toast.success(backendMessage);
        }
      }

      navigateToTerm(href);
      return;
    }

    if (!termUnlocked) {
      toast.error(st?.completePreviousTerm ?? "");
      return;
    }

    navigateToTerm(href);
  }

  function handleTermKeyDown(
    e: KeyboardEvent<HTMLDivElement>,
    href: string,
    termUnlocked: boolean,
    isFirstTerm: boolean,
  ) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    void handleTermActivate(href, termUnlocked, isFirstTerm);
  }

  function goToPendingTerm() {
    if (!pendingHref) return;
    const href = pendingHref;
    setGate(null);
    resetGateExtras();
    router.push(href);
  }

  useEffect(() => {
    setStudiesHaveStarted(studiesHaveStartedFromCookie());
  }, [lang]);

  useEffect(() => {
    if (searchParams.get("studyPending") !== "1") return;
    if (!hasAccessToken() || !isStudentEnrolledFromCookie()) return;
    void refreshEnrollGate().then((snap) => showStudyNotStarted(snap));
    router.replace(`/${lang}/study-terms`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, lang]);

  const enrollDescription = enrollError.trim()
    ? enrollError
    : (st?.gateEnrollDescription ?? "");

  const enrollSuccessDescription = messageWithBackendFallback(
    enrollSuccessMessage,
    st?.gateEnrollSuccessDescription ?? "",
  );

  const studyReadyDescription = messageWithBackendFallback(
    enterTermMessage,
    st?.gateStudyReadyDescription ?? "",
  );

  const studyNotStartedDescription = (() => {
    if (gateLoading) {
      return st?.loadingGateMessage ?? "Loading message…";
    }

    const snap = gateSnapshot;
    const backend = (snap?.message ?? enrollSuccessMessage).trim();
    if (!backend && !snap?.studyStartsAt) return undefined;

    const parts: string[] = [];
    if (backend) parts.push(backend);

    if (snap?.studyStartsAt) {
      const formatted = formatStudyStartForLocale(snap.studyStartsAt, lang);
      const alreadyInMessage =
        backend.includes(snap.studyStartsAt) || backend.includes(formatted);
      if (!alreadyInMessage) {
        const lead = (st?.gateStudyNotStartedLead ?? "").trim();
        parts.push(lead ? `${lead}\n${formatted}` : formatted);
      }
    }

    return parts.length ? parts.join("\n\n") : undefined;
  })();

  const studyNotStartedTitle =
    isStudentEnrolledFromCookie() && hasAccessToken()
      ? (st?.gateEnrollSuccessTitle ?? st?.gateStudyNotStartedTitle ?? "")
      : (st?.gateStudyNotStartedTitle ?? "");

  const studyAccessActive =
    hasAccessToken() &&
    isStudentEnrolledFromCookie() &&
    studiesHaveStarted;

  return (
    <div>
      <div>
        <SmallHeroSection
          title={
            <h1 className="text-2xl font-semibold mt-28 mb-4">
              <span className="mainColor">
                {translate?.pages?.studyTerms?.title}
              </span>
              <span className="scoundColor">
                {translate?.pages?.studyTerms?.titleSpan}
              </span>
            </h1>
          }
        />
      </div>

      <div className=" bg-[#F6F6F6] px-2 pt-4 pb-16  md:pt-6 md:pb-70">
        <div className="container mx-auto w-[90%] mt-20">
          {isLoading && <StudyTermsCardsSkeleton />}

          {!isLoading && isError && (
            <div
              className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-center text-sm text-red-800"
              role="alert"
            >
              <p className="mb-4 font-semibold whitespace-pre-line">
                {extractApiErrorMessage(
                  studyTermsError,
                  st?.loadFailed ?? "",
                )}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="scoundBgColor rounded-lg px-4 py-2 text-white"
              >
                {st?.retry ?? "Try again"}
              </button>
            </div>
          )}

          {!isLoading && !isError && studyTerms.length === 0 && (
            <p className="text-center text-sm text-gray-600">
              {st?.emptyList}
            </p>
          )}

          {!isLoading && !isError && studyTerms.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 lg:grid-cols-4 gap-y-20 md:gap-y-16 lg:gap-y-8">
                {studyTerms.map((item, index) => {
                  const href = `/${lang}/study-terms/${item.id}`;
                  const isFirstTerm = index === 0;
                  const unlocked = isStudyTermUnlocked(
                    index,
                    studyTerms,
                    studyAccessActive,
                  );
                  const completed = isStudyTermCompleted(item);
                  const progressWidth = studyAccessActive ? item.progress : 0;

                  const cardClass = unlocked
                    ? `block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 relative
      opacity-100 shadow-r-sm transition-all duration-300 ease-in-out text-center sm:text-right
      hover:shadow-md cursor-pointer`
                    : `block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 relative
      opacity-50 shadow-r-sm transition-all duration-300 ease-in-out text-center sm:text-right
      ${studyAccessActive ? "cursor-not-allowed" : "hover:opacity-100 hover:shadow-md cursor-pointer"}`;

                  const statusLabel = completed
                    ? previousLabel
                    : unlocked
                      ? null
                      : lockedLabel;

                  const actionLabel = unlocked
                    ? isFirstTerm && studiesHaveStarted
                      ? st?.continueStudyLink
                      : st?.cardLink
                    : lockedLabel;

                  const body = (
                    <>
                      <div className="flex justify-between items-center mb-8 md:mb-4">
                        <h2 className="text-lg md:text-l font-semibold mainColor">
                          {item.title}
                        </h2>
                        <div>
                          <span
                            className="bg-[#F6F6F6] text-[#c6a96aad] text-3xl px-6 py-4 
                  rounded-br-xl font-bold absolute top-0 left-0"
                          >
                            {String(item.id).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="flex">
                          <Image
                            src={book.src}
                            width={18}
                            height={18}
                            alt="book"
                          />
                          <p className="me-2 ms-2 descriptionColor">
                            <span className="me-0.5">
                              {item.materialsCount}
                            </span>
                            <span>{td?.materials ?? "مواد تعليمية"}</span>
                          </p>
                        </div>
                        <div className="flex ms-4">
                          <Image
                            src={lessons.src}
                            width={18}
                            height={18}
                            alt="lessonscreen"
                          />
                          <p className="me-2 ms-2 descriptionColor">
                            <span className="me-0.5">{item.lessonsCount}</span>
                            <span>{td?.lessons ?? "دروس"}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs mt-2">{item.shortDescription}</p>

                      <div className="w-full bg-gray-200 mt-3 rounded-full h-2 mb-3 overflow-hidden">
                        <div
                          className="h-full scoundBgColor transition-all duration-500"
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>

                      {statusLabel ? (
                        <div className="text-xs text-gray-500 mb-4">
                          {statusLabel}
                        </div>
                      ) : null}

                      <span
                        className={`text-sm font-medium scoundColor ${
                          unlocked
                            ? "group-hover:underline"
                            : "cursor-not-allowed"
                        }`}
                      >
                        {actionLabel}
                      </span>
                    </>
                  );

                  const enrolled = isStudentEnrolledFromCookie();
                  const canInteract =
                    unlocked || (enrolled && hasAccessToken() && !studiesHaveStarted);

                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={canInteract ? 0 : -1}
                      aria-disabled={!canInteract}
                      onClick={() =>
                        void handleTermActivate(href, unlocked, isFirstTerm)
                      }
                      onKeyDown={(e) =>
                        handleTermKeyDown(e, href, unlocked, isFirstTerm)
                      }
                      className={`${cardClass} group`}
                      aria-label={item.title}
                    >
                      {body}
                    </div>
                  );
                })}
              </div>

              <InfoModal
                open={gate === "login"}
                onOpenChange={(open) => {
                  if (!open) {
                    setGate(null);
                    resetGateExtras();
                  }
                }}
                title={st?.gateLoginTitle ?? ""}
                description={st?.gateLoginDescription}
                primaryLabel={st?.gateLoginAction ?? ""}
                primaryHref={`/${lang}/login`}
                secondaryLabel={st?.gateClose ?? ""}
                dir={dir}
              />

              <InfoModal
                open={gate === "enroll"}
                onOpenChange={(open) => {
                  if (!open) {
                    setGate(null);
                    resetGateExtras();
                  }
                }}
                title={st?.gateEnrollTitle ?? ""}
                description={enrollDescription}
                primaryLabel={st?.gateEnrollAction ?? ""}
                onPrimaryClick={handleEnrollSubmit}
                primaryLoading={enrollSubmitting}
                secondaryLabel={st?.gateClose ?? ""}
                dir={dir}
              />

              <InfoModal
                open={gate === "enrollSuccess"}
                onOpenChange={(open) => {
                  if (!open) {
                    setGate(null);
                    resetGateExtras();
                  }
                }}
                title={st?.gateEnrollSuccessTitle ?? ""}
                description={enrollSuccessDescription}
                primaryLabel={st?.gateClose ?? ""}
                onPrimaryClick={() => {
                  setGate(null);
                  resetGateExtras();
                }}
                dir={dir}
              />

              <InfoModal
                open={gate === "studyReady"}
                onOpenChange={(open) => {
                  if (!open) {
                    setGate(null);
                    resetGateExtras();
                  }
                }}
                title={st?.gateStudyReadyTitle ?? ""}
                description={studyReadyDescription}
                primaryLabel={st?.gateStartStudyAction ?? ""}
                onPrimaryClick={goToPendingTerm}
                secondaryLabel={st?.gateClose ?? ""}
                dir={dir}
              />

              <InfoModal
                open={gate === "studyNotStarted"}
                onOpenChange={(open) => {
                  if (!open) {
                    setGate(null);
                    resetGateExtras();
                  }
                }}
                title={studyNotStartedTitle}
                description={studyNotStartedDescription}
                primaryLabel={st?.gateStudyPlanAction ?? ""}
                primaryHref={studyPlanHref}
                secondaryLabel={st?.gateClose ?? ""}
                dir={dir}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTerms;
