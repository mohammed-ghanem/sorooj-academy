"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  hasAccessToken,
  isStudentEnrolledFromCookie,
} from "@/lib/auth/studentGate";
import { canEnterStudyTerm } from "@/lib/studentProgram/enrollGate";

type StudyTermRouteGuardProps = {
  children: ReactNode;
};

/**
 * Term detail routes are gated on the study-terms list via modals.
 * Direct URL visits are redirected client-side; children always render so
 * SSR/hydration keeps page height (hero + skeleton) and the footer stays put.
 */
export default function StudyTermRouteGuard({
  children,
}: StudyTermRouteGuardProps) {
  const router = useRouter();
  const { lang: langParam } = useParams<{ lang: string }>();
  const lang = langParam ?? "ar";

  useEffect(() => {
    const loggedIn = hasAccessToken();
    const enrolled = isStudentEnrolledFromCookie();
    const studyOpen = canEnterStudyTerm();

    let query: string | null = null;
    if (!loggedIn) query = "login=1";
    else if (!enrolled) query = "enroll=1";
    else if (!studyOpen) query = "studyPending=1";

    if (query) {
      router.replace(`/${lang}/study-terms?${query}`);
    }
  }, [lang, router]);

  return <>{children}</>;
}
