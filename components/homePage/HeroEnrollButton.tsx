"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import InfoModal from "@/components/modals/InfoModal";
import {
  hasAccessToken,
  isStudentEnrolledFromCookie,
} from "@/lib/auth/studentGate";
import {
  extractApiErrorMessage,
  messageWithBackendFallback,
} from "@/lib/studentProgram/programErrors";
import {
  parseEnrollResponse,
  shouldBlockEnrollRetry,
} from "@/lib/studentProgram/enrollGate";
import { useEnrollInProgramMutation } from "@/store/studentHome/studentHomeApi";
import { useLazyGetProfileQuery } from "@/store/auth/authApi";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import { cn } from "@/lib/utils";

type EnrollModal =
  | "login"
  | "success"
  | "batchClosed"
  | "error"
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

function buildModalDescription(
  backendMessage: string,
  extraHint?: string,
): string {
  const parts = [backendMessage.trim()];
  if (extraHint?.trim()) {
    parts.push(extraHint.trim());
  }
  return parts.filter(Boolean).join("\n\n");
}

const buttonClassName =
  "scoundBgColor inline-flex min-h-10 items-center justify-center gap-2 rounded-md p-2 text-white font-normal disabled:opacity-70";

export default function HeroEnrollButton() {
  const lang = LangUseParams() ?? "ar";
  const translate = TranslateHook();
  const hero = translate?.home?.hero;
  const st = translate?.pages?.studyTerms;
  const nav = translate?.home?.navbar;
  const dir = lang === "en" ? "ltr" : "rtl";

  const studyTermsHref = `/${lang}/study-terms`;
  const pathsHref = `/${lang}/single-learning-pathes`;
  const loginHref = `/${lang}/login`;

  const [enrolled, setEnrolled] = useState(false);
  const [modal, setModal] = useState<EnrollModal>(null);
  const [modalDescription, setModalDescription] = useState("");

  const [enrollInProgram, { isLoading: enrolling }] =
    useEnrollInProgramMutation();
  const [triggerGetProfile] = useLazyGetProfileQuery();

  const syncEnrollmentState = useCallback(() => {
    setEnrolled(hasAccessToken() && isStudentEnrolledFromCookie());
  }, []);

  useEffect(() => {
    syncEnrollmentState();
    window.addEventListener("sorooj-auth-session", syncEnrollmentState);
    return () =>
      window.removeEventListener("sorooj-auth-session", syncEnrollmentState);
  }, [syncEnrollmentState]);

  const closeModal = () => {
    setModal(null);
    setModalDescription("");
  };

  const syncProfileAfterEnroll = async () => {
    try {
      const profile = await triggerGetProfile().unwrap();
      persistProfileToCookie(profile);
    } catch {
      /* profile sync is best-effort */
    }
    syncEnrollmentState();
  };

  const handleEnrollClick = async () => {
    if (enrolling) return;

    if (!hasAccessToken()) {
      setModalDescription(
        hero?.loginRequiredDescription ?? st?.gateLoginDescription ?? "",
      );
      setModal("login");
      return;
    }

    try {
      const data = await enrollInProgram({ lang }).unwrap();
      const snap = parseEnrollResponse(data);

      setModalDescription(
        messageWithBackendFallback(
          snap.message,
          st?.gateEnrollSuccessDescription ?? "",
        ),
      );
      setModal("success");

      void syncProfileAfterEnroll();
    } catch (err) {
      const backendMessage = extractApiErrorMessage(
        err,
        st?.enrollRequestFailed ?? "",
      );

      if (shouldBlockEnrollRetry(err)) {
        setModalDescription(
          buildModalDescription(backendMessage, hero?.independentPathsHint),
        );
        setModal("batchClosed");
        return;
      }

      setModalDescription(backendMessage);
      setModal("error");
    }
  };

  const showContinueLink = enrolled && modal === null;

  return (
    <>
      {showContinueLink ? (
        <Link href={studyTermsHref} className={buttonClassName}>
          {hero?.continueStudy ?? st?.continueStudyLink}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => void handleEnrollClick()}
          disabled={enrolling}
          className={cn(buttonClassName, "cursor-pointer")}
        >
          {enrolling ? (
            <>
              <span>{hero?.enrollNow}</span>
            </>
          ) : (
            hero?.enrollNow
          )}
        </button>
      )}

      <InfoModal
        open={modal === "login"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        variant="login"
        title={st?.gateLoginTitle ?? ""}
        description={modalDescription || hero?.loginRequiredDescription || st?.gateLoginDescription}
        primaryLabel={st?.gateLoginAction ?? ""}
        primaryHref={loginHref}
        secondaryLabel={st?.gateClose ?? ""}
        dir={dir}
      />

      <InfoModal
        open={modal === "success"}
        onOpenChange={(open) => {
          if (!open) {
            syncEnrollmentState();
            closeModal();
          }
        }}
        variant="success"
        title={st?.gateEnrollSuccessTitle ?? ""}
        description={modalDescription}
        primaryLabel={hero?.startStudyNow ?? st?.gateStartStudyAction ?? ""}
        primaryHref={studyTermsHref}
        secondaryLabel={st?.gateClose ?? ""}
        dir={dir}
      />

      <InfoModal
        open={modal === "batchClosed"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        variant="schedule"
        title={st?.gateEnrollTitle ?? ""}
        description={modalDescription}
        primaryLabel={nav?.independentScientificPaths ?? ""}
        primaryHref={pathsHref}
        secondaryLabel={st?.gateClose ?? ""}
        dir={dir}
      />

      <InfoModal
        open={modal === "error"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        variant="info"
        title={st?.gateStartStudyErrorTitle ?? st?.gateEnrollTitle ?? ""}
        description={modalDescription}
        primaryLabel={st?.gateEnrollAction ?? hero?.enrollNow ?? ""}
        onPrimaryClick={() => {
          closeModal();
          void handleEnrollClick();
        }}
        secondaryLabel={st?.gateClose ?? ""}
        dir={dir}
      />
    </>
  );
}
