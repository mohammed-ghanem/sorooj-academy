"use client";

import Image from "next/image";
import HeroAuth from "../heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useState } from "react";
import { Eye, EyeOff, Mail, User } from "lucide-react";

import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import './style.css'

const SignUp = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();

  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [phone, setPhone] = useState("");

  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 mb-10">

          {/* logo */}
          <Image
            src={logo}
            alt=""
            width={140}
            height={48}
            className="h-auto w-35 object-contain"
            priority
          />

          {/* card */}
          <div className="relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1 ring-black/5 md:p-8">

            {/* decoration */}
            <div className="pointer-events-none absolute top-0 left-0">
              <Image src="/assets/images/line.svg" alt="" width={100} height={100} />
            </div>

            {/* header */}
            <div className="relative z-10 text-start">
              <div className="flex items-start justify-between gap-3">
              <h1 className="min-w-0 flex-1 text-xl font-bold mainColor">
                      {translate?.pages?.signUp.title}
                    <span className="scoundColor">{translate?.pages?.signUp.titleSpan}</span>
                  </h1>

                <div className="me-10">
                  <GlobeBtn />
                </div>
              </div>

              <p className="mt-2 text-sm text-[#737373] font-semibold">
                {translate?.pages?.signUp?.description}
              </p>

              {/* progress */}
              <div className="flex gap-2 mt-4 items-center">
                <div className={`h-1 flex-1 ${step >= 1 ? "scoundBgColor" : "bg-gray-200"}`} />
                <div className={`h-1 flex-1 ${step >= 2 ? "scoundBgColor" : "bg-gray-200"}`} />
                <div className="text-sm text-[#737373] font-semibold">
                    (
                    <span> {translate?.pages?.signUp?.step} </span>
                    <span> {step} </span>
                    <span> {translate?.pages?.signUp?.from} 2  </span>
                    )
                </div>
              </div>
            </div>

            {/* form */}
            <div className="mt-6" dir="ltr">

              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <>
                  {/* name */}
                  <div className="mb-4">
                    <label className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}>
                      الاسم بالكامل
                    </label>
                    <div className="relative">
                      <User  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5" />
                      <input className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                  </div>

                  {/* email */}
                  <div className="mb-4">
                    <label className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}>
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5" />
                      <input className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                  </div>

                  {/* phone (NEW) */}
                  <div className="mb-4">
                    <label className={`block text-[13px] font-semibold
                     text-gray-400`}>
                      رقم الهاتف
                    </label>

                    <PhoneInput
                      country={"kw"}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      inputClass="mt-1 block w-full pl-[52px] pr-[0] py-[20px] border
                       border-gray-300 rounded-md shadow-sm bg-[#faf9f6]!"
                      containerClass="mt-1"
                      buttonClass="!border-gray-300"
                    />
                  </div>

                  {/* password */}
                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-gray-400">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* confirm */}
                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-gray-400">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full scoundBgColor text-white py-3 mt-6 rounded-lg"
                  >
                    التالي
                  </button>
                </>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-gray-400">
                      الدولة
                    </label>
                    <select className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                      <option>اختر</option>
                      <option>مصر</option>
                      <option>السعودية</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-gray-400">
                      المستوى العلمي
                    </label>
                    <select className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                      <option>اختر</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-gray-400">
                      الهدف
                    </label>
                    <select className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                      <option>اختر</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-gray-400">
                      الجنس
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label><input type="radio" name="gender" /> ذكر</label>
                      <label><input type="radio" name="gender" /> أنثى</label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold text-gray-400">
                      تاريخ الميلاد
                    </label>
                    <input type="date" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                  </div>

                  <button className="w-full scoundBgColor text-white py-3 mt-6 rounded-lg">
                    إنشاء حساب
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default SignUp;