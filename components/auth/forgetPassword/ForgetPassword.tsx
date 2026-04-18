"use client";

import Image from "next/image";
import HeroAuth from "../heroAuth/HeroAuth";
import sms from "@/public/assets/images/sms.svg";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import Link from "next/link";
import ForgetPasswordSkeleton from "@/components/skeletons/ForgetPasswordSkeleton";
import { useState } from "react";
import { useSendResetCodeMutation } from "@/store/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

// const emailValid = (v: string) =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const ForgetPassword = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sendResetCode, { isLoading }] = useSendResetCodeMutation();

  if (!translate) {
    return <ForgetPasswordSkeleton />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error(
        translate?.pages?.signUp?.fillAllFields ?? "Please fill all fields",
      );
      return;
    }
    // if (!emailValid(email)) {
    //   toast.error(
    //     translate?.pages?.signUp?.invalidEmail ?? "Invalid email address",
    //   );
    //   return;
    // }

    const formData = new FormData();
    formData.append("email", email.trim());

    try {
      const res = await sendResetCode(formData).unwrap();
      toast.success(translate?.pages?.forgetPassword?.successMessage);

      Cookies.set("reset_email", email.trim(), {
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      Cookies.set("auth_otp_flow", "password_reset", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      router.push(`/${lang}/verify-code`);
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
        toast.error(translate?.pages?.forgetPassword?.errorMessage);
        return;
      }
      toast.error(
        translate?.pages?.signUp?.requestFailed,
      );
    }
  };

  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 my-15 pb-20">
          {/* logo */}
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

          {/* card */}
          <div className="relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1
           ring-black/5 md:mt-4 md:p-12">
            {/* decorative line */}
            <div className="pointer-events-none absolute top-0 left-0">
              <Image
                src="/assets/images/line.svg"
                alt=""
                width={100}
                height={100}
              />
            </div>

            {/* header */}
            <div className="relative z-10 text-start">
              <div className="flex items-start justify-between gap-3">
                <h1 className="min-w-0 flex-1 text-xl font-bold mainColor">
                  {translate?.pages?.forgetPassword.title}
                  <span className="scoundColor">
                    {" "}
                    {translate?.pages?.forgetPassword.forgetPassword}{" "}
                  </span>
                </h1>
                <div className="relative z-20 shrink-0 me-10">
                  <GlobeBtn />
                </div>
              </div>

              <p className="mt-2 text-sm text-[#737373] font-semibold">
                {translate?.pages?.forgetPassword?.forgetPasswordTitle}
              </p>
            </div>

            {/* form */}
            <form
              className="p-0 md:p-4 mt-4 mx-auto z-30 relative"
              dir="ltr"
              onSubmit={handleSubmit}
            >
              {/* email */}
              <div className="mb-4">
                <label
                  className={`block text-[13px] font-semibold ${
                    lang === "ar" ? "text-right!" : "text-left"
                  }`}
                >
                  {translate?.pages?.forgetPassword?.email}
                </label>

                <div className="relative">
                  <Image
                    src={sms}
                    alt=""
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
                  />
                </div>
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mx-auto scoundBgColor cursor-pointer text-white py-3 mt-6 rounded-lg flex justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {translate?.pages?.forgetPassword?.send}
              </button>
            </form>

            {/* back to login */}
            <div className="mt-4 text-center">
              <Link
                href={`/${lang}/login`}
                className="border-b border-regal-blue text-[13px] font-semibold mainColor"
              >
                {translate?.pages?.forgetPassword?.backToLogin}
              </Link>
            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default ForgetPassword;
