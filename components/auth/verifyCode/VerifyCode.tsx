"use client";

import Image from "next/image";
import HeroAuth from "../heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useEffect, useRef, useState } from "react";
import VerifyCodeSkeleton from "@/components/skeletons/VerifyCodeSkeleton";
import Link from "next/link";
import {
  useResendOtpMutation,
  useVerifyCodeMutation,
} from "@/store/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RESEND_COOLDOWN_SEC = 60;

const VerifyCode = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [secondsLeft, setSecondsLeft] = useState(0);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      setActiveIndex(index + 1);
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const codeString = otp.join("");

  const handleVerify = async () => {
    if (codeString.length !== 4) {
      toast.error(
        translate?.pages?.verifyCode?.placeholder ??
          "Enter the 4-digit code",
      );
      return;
    }

    const formData = new FormData();
    formData.append("code", codeString);

    try {
      const res = await verifyOtp(formData).unwrap();
      toast.success(res?.message ?? "");
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

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    try {
      const res = await resendOtp().unwrap();
      toast.success(res?.message ?? "");
      setSecondsLeft(RESEND_COOLDOWN_SEC);
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

  if (!translate) {
    return <VerifyCodeSkeleton />;
  }

  const v = translate.pages?.verifyCode;
  const canResend = secondsLeft === 0 && !isResending;

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
          <div
            className="relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1
           ring-black/5 md:mt-4 md:p-16"
          >
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
                  {v?.title}
                  <span className="scoundColor"> {v?.code}</span>
                </h1>

                <div className="relative z-20 shrink-0 me-10">
                  <GlobeBtn />
                </div>
              </div>

              <p className="mt-2 text-sm text-[#737373] font-semibold">
                {v?.description}
              </p>
            </div>

            {/* OTP inputs */}
            <div className="flex justify-center gap-3 mt-6" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => setActiveIndex(index)}
                  className={`w-14 h-14 text-center text-medium font-semibold rounded-md 
                  border outline-none transition
                    ${
                      activeIndex === index
                        ? "bg-white border-mainColor shadow-sm"
                        : "bg-transparent border-gray-300"
                    }
                  `}
                />
              ))}
            </div>

            {/* button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full mx-auto scoundBgColor cursor-pointer text-white py-3 mt-6 rounded-lg flex justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? v?.processing : v?.verify}
            </button>

            {/* resend */}
            <p className="text-center text-sm mt-3">
              {v?.resendText}{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="mainColor font-semibold border-b border-regal-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:border-transparent"
              >
                {isResending
                  ? v?.processing
                  : secondsLeft > 0
                    ? `(${secondsLeft}s)`
                    : v?.resendCode}
              </button>
            </p>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default VerifyCode;