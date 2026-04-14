"use client";

import Image from "next/image";
import HeroAuth from "../heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Mail,
  User,
} from "lucide-react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";
import SignUpSkeleton from "@/components/skeletons/SignUpSkeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SignUp = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();

  const [step, setStep] = useState(1);

  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [degree, setDegree] = useState("");
  const [goal, setGoal] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [birthDate, setBirthDate] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [phone, setPhone] = useState("");
  const isArabic = lang === "ar";
  const nextIcon = isArabic ? ChevronLeft : ChevronRight;
  const prevIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = nextIcon;
  const PrevIcon = prevIcon;

  if (!translate) {
    return <SignUpSkeleton />;
  }

  const t = translate.pages?.signUp;

  const selectValueClass = (value: string) =>
    cn(
      "appearance-none mt-1 w-full p-2 border border-gray-300 rounded-md focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:outline-none!",
      value ? "scoundColor font-semibold text-sm" : "text-gray-400"
    );

  const dateInputClass = (value: string) =>
    cn(
      "mt-1 w-full p-2 border border-gray-300 rounded-md focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:outline-none!",
      value ? "scoundColor font-semibold text-sm" : "text-gray-400"
    );

  const radioLabelClass = (selected: boolean) =>
    cn(
      "flex cursor-pointer items-center gap-2 text-sm transition-colors",
      selected ? "scoundColor font-semibold" : "text-gray-400"
    );

  const radioInputClass =
    "h-4 w-4 shrink-0 border-gray-300 text-[#9F854E] focus:ring-[#9F854E] accent-[#9F854E]";

  const selectChevronClass = cn(
    "pointer-events-none absolute mt-[3px] top-1/2 -translate-y-1/2 text-gray-400!",
    isArabic ? "left-3" : "right-3"
  );

  return (
    <div>
      <HeroAuth contentClassName="max-w-3xl ">
        <div className="flex w-full flex-col items-center gap-6 mb-10">
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
          <div className="relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1 ring-black/5 md:p-8">
            {/* decoration */}
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
                  {translate?.pages?.signUp.title}
                  <span className="scoundColor">
                    {translate?.pages?.signUp.titleSpan}
                  </span>
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
                <div
                  className={`h-1 flex-1 ${step >= 1 ? "scoundBgColor" : "bg-gray-200"}`}
                />
                <div
                  className={`h-1 flex-1 ${step >= 2 ? "scoundBgColor" : "bg-gray-200"}`}
                />
                <div className="text-sm text-[#737373] font-semibold">
                  (<span> {translate?.pages?.signUp?.step} </span>
                  <span> {step} </span>
                  <span> {translate?.pages?.signUp?.from} 2 </span>)
                </div>
              </div>

              <div className={`mt-4 flex items-center gap-3 justify-end `}>
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  disabled={step === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full
                   scoundBgColor text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous step"
                >
                  <PrevIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(2, prev + 1))}
                  disabled={step === 2}
                  className="flex h-9 w-9 items-center justify-center rounded-full
                   scoundBgColor text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next step"
                >
                  <NextIcon size={18} />
                </button>
              </div>
            </div>

            {/* form */}
            <div className="mt-6" dir="ltr">
              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <>
                  {/* name */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.name}
                    </label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5" />
                      <input className="mt-1 scoundColor w-full p-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                  </div>

                  {/* email */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.email}
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5" />
                      <input className="mt-1 scoundColor w-full p-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                  </div>

                  {/* phone (NEW) */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold ${lang === "ar" ? "text-right!" : "text-left"}
                     text-gray-400`}
                    >
                      {translate?.pages?.signUp?.phone}
                    </label>

                    <PhoneInput
                      country={"kw"}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      inputClass="mt-1 block w-full pl-[52px] pr-[0] py-[20px] border scoundColor
                       border-gray-300 rounded-md shadow-sm bg-[#faf9f6]!"
                      containerClass="mt-1"
                      buttonClass="!border-gray-300"
                    />
                  </div>

                  {/* password */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.password}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="mt-1 w-full scoundColor  p-2 border border-gray-300 rounded-md outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* confirm */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.confirmPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        className="mt-1 scoundColor w-full p-2 border border-gray-300 rounded-md outline-none"
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
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full scoundBgColor text-white py-3 mt-6 rounded-lg"
                  >
                    {translate?.pages?.signUp?.next}
                  </button>
                </>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.country}
                    </label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={selectValueClass(country)}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <option value="">{t?.selectCountry ?? t?.select}</option>
                        <option value="eg">مصر</option>
                        <option value="sa">السعودية</option>
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.level}
                    </label>
                    <div className="relative">
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className={selectValueClass(level)}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <option value="">{t?.selectLevel ?? t?.select}</option>
                        <option value="beginner"> مبتدئ</option>
                        <option value="intermediate">متوسط</option>
                        <option value="advanced">متقدم</option>
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.degree}
                    </label>
                    <div className="relative">
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className={selectValueClass(degree)}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <option value="">{t?.select}</option>
                        <option value="student">طالب</option>
                        <option value="bachelor">بكالوريوس</option>
                        <option value="master">ماجستير</option>
                        <option value="phd">دكتوراه</option>
                        <option value="other">غير ذلك</option>
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.goal}
                    </label>
                    <div className="relative">
                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className={selectValueClass(goal)}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <option value="">{t?.selectGoal ?? t?.select}</option>
                        <option value="knowledge">
                          تنمية المعرفة الشرعية بشكل منهجي
                        </option>
                        <option value="basics">
                          دراسة أساسيات العلوم الإسلامية
                        </option>
                        <option value="skills">
                          تطوير مهارات الدعوة والتعليم
                        </option>
                        <option value="qualification">
                          التأهيل العلمي والحصول على شهادات معتمدة
                        </option>
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold
                       text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.gender}
                    </label>
                    <div
                      className={`flex gap-4 mt-2 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <label className={radioLabelClass(gender === "male")}>
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === "male"}
                          onChange={() => setGender("male")}
                          className={radioInputClass}
                        />
                        {translate?.pages?.signUp?.male}
                      </label>
                      <label className={radioLabelClass(gender === "female")}>
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === "female"}
                          onChange={() => setGender("female")}
                          className={radioInputClass}
                        />
                        {translate?.pages?.signUp?.female}
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-400 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.birthDate}
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className={dateInputClass(birthDate)}
                      dir="ltr"
                    />
                  </div>

                  <button className="w-full scoundBgColor text-white py-3 mt-6 rounded-lg">
                    {translate?.pages?.signUp?.signup}
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
