/* eslint-disable @typescript-eslint/no-unused-vars */
// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useEffect, useLayoutEffect } from "react";
import Cookies from "js-cookie";
import api from "@/services/api";
import { setSessionReady } from "@/store/app/appSlice";
import { useLazyGetProfileQuery } from "@/store/auth/authApi";
import LangUseParams from "@/translate/LangUseParams";
import { useRouter } from "next/navigation";
import { persistAuthUserCookie } from "@/lib/auth/studentGate";

const PROFILE_CHECK_INTERVAL = 60 * 60 * 1000;

function SessionMonitor() {
  const lang = LangUseParams() ?? "ar";
  const router = useRouter();
  const [triggerGetProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    let active = true;
    let checking = false;

    const checkSession = async () => {
      if (
        !active ||
        checking ||
        document.visibilityState !== "visible" ||
        !Cookies.get("access_token")
      ) {
        return;
      }

      checking = true;
      try {
        const profile = await triggerGetProfile(undefined, false).unwrap();
        if (active) {
          persistAuthUserCookie(profile, true);
        }
      } catch {
        // A 401 is handled centrally by axiosBaseQuery.
      } finally {
        checking = false;
      }
    };

    const handleSessionExpired = () => {
      if (!active) return;
      toast.error(
        lang === "en"
          ? "Your session has expired. Please log in again."
          : "انتهت جلستك، يرجى تسجيل الدخول مرة أخرى",
      );
      window.dispatchEvent(new Event("sorooj-auth-session"));
      router.replace(`/${lang}/login`);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void checkSession();
    };

    void checkSession();
    const intervalId = window.setInterval(checkSession, PROFILE_CHECK_INTERVAL);
    window.addEventListener("sorooj-session-expired", handleSessionExpired);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener(
        "sorooj-session-expired",
        handleSessionExpired,
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lang, router, triggerGetProfile]);

  return null;
}


export function Providers({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // Seed auth before child queries run (fixes refresh → "not available" until retry)
    const token = Cookies.get("access_token") ?? null;
    const userJson = Cookies.get("user") ?? null;
    let user = null;
    try {
      user = userJson ? JSON.parse(userJson) : null;
    } catch {
      user = null;
    }

    // immediately set axios default header (redundant with interceptor but safe)
    if (token) {
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    store.dispatch(setSessionReady());
  }, []);

  return (
    <Provider store={store}>
      <SessionMonitor />
      {children}
      <Toaster
        position="top-right"
        richColors
        expand={true}
        closeButton
        toastOptions={{
          duration: 4000,
          className: "fontCairo",
        }}
      />
    </Provider>
  );
}