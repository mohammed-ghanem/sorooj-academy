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

const VerifyCode = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // handle change
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

  // handle backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
    }
  };

  if (!translate) {
    return <VerifyCodeSkeleton />;
  }

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
           ring-black/5 md:mt-4 md:p-16">
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
                  {translate?.pages?.verifyCode.title}
                  <span className="scoundColor">
                    {" "}
                    {translate?.pages?.verifyCode.code}
                  </span>
                </h1>

                <div className="relative z-20 shrink-0 me-10">
                  <GlobeBtn />
                </div>
              </div>

              <p className="mt-2 text-sm text-[#737373] font-semibold">
                {translate?.pages?.verifyCode?.description}
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
            <button className="w-full mx-auto scoundBgColor cursor-pointer text-white py-3 mt-6 rounded-lg flex justify-center">
              {translate?.pages?.verifyCode?.verify}
            </button>

            {/* resend */}
            <p className="text-center text-sm mt-3">
              {translate?.pages?.verifyCode?.resendText}{" "}
              <button className="mainColor font-semibold border-b border-regal-blue">
                {translate?.pages?.verifyCode?.resendCode}
              </button>
            </p>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default VerifyCode;
