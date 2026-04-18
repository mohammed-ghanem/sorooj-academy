"use client";

import Image from "next/image";
import HeroAuth from "../heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useEffect, useRef, useState, type SubmitEventHandler } from "react";
import { Eye, EyeOff } from "lucide-react";
import ResetPasswordSkeleton from "@/components/skeletons/ResetPasswordSkeleton";
import Link from "next/link";
import { useResetPasswordMutation } from "@/store/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

const ResetPassword = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const redirectGuardDone = useRef(false);

  useEffect(() => {
    if (!translate) return;
    if (Cookies.get("reset_token")) return;
    if (redirectGuardDone.current) return;
    redirectGuardDone.current = true;
    toast.error(
      translate?.pages?.resetPassword?.sessionExpired ??
        "This reset link is no longer valid.",
    );
    router.replace(`/${lang}/forget-password`);
  }, [translate, lang, router]);

  if (!translate) {
    return <ResetPasswordSkeleton />;
  }

  const rp = translate.pages?.resetPassword;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!password.trim() || !passwordConfirm.trim()) {
      toast.error(
        translate?.pages?.signUp?.fillAllFields ?? "Please fill all fields",
      );
      return;
    }
    if (password !== passwordConfirm) {
      toast.error(
        translate?.pages?.signUp?.passwordMismatch ?? "Passwords do not match",
      );
      return;
    }

    try {
      const res = await resetPassword({
        password,
        password_confirmation: passwordConfirm,
      }).unwrap();
      toast.success(
        res?.message ?? rp?.signInWithNewPassword ?? "Password updated.",
      );
      router.push(`/${lang}/login`);
    } catch (err: unknown) {
      const errorData = err as {
        data?: { errors?: Record<string, string[]>; message?: string };
      };
      const d = errorData?.data;
      if (d?.errors) {
        Object.values(d.errors).forEach((messages) =>
          messages.forEach((msg) => toast.error(msg)),
        );
        return;
      }
      if (d?.message) {
        toast.error(d.message);
        return;
      }
      toast.error(
        translate?.pages?.signUp?.requestFailed ?? "Something went wrong.",
      );
    }
  };

  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 my-15 pb-0">
          <Link href={`/${lang}`}>
            <Image
              src={logo}
              alt=""
              width={140}
              height={48}
              className="h-auto w-35 object-contain"
              priority
            />
          </Link>

          <div className="relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1 ring-black/5 md:p-8">
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
                <h1 className="min-w-0 flex-1 text-xl font-bold mainColor">
                  {rp?.title}
                  <span className="scoundColor"> {rp?.password}</span>
                </h1>

                <div className="relative z-20 shrink-0 me-10">
                  <GlobeBtn />
                </div>
              </div>

              <p className="mt-2 text-sm text-[#737373] font-bold">
                {rp?.description}
              </p>
            </div>
            {/* ================= RESET PASSWORD FORM ================= */}
            <form
              className="p-0 md:p-4 mt-4 mx-auto z-30 relative"
              dir="ltr"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label
                  className={`block text-[13px] font-semibold  ${
                    lang === "ar" ? "text-right!" : "text-left"
                  }`}
                >
                  {rp?.password}
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm scoundColor outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className={`block text-[13px] font-semibold  ${
                    lang === "ar" ? "text-right!" : "text-left"
                  }`}
                >
                  {rp?.confirmPassword}
                </label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    autoComplete="new-password"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md scoundColor  shadow-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mx-auto scoundBgColor cursor-pointer text-white py-3 mt-6 rounded-lg flex justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? rp?.processing : rp?.confirmBtn}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href={`/${lang}/login`}
                className="border-b border-regal-blue text-[13px] font-semibold mainColor"
              >
                {rp?.backToLogin}
              </Link>
            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default ResetPassword;
