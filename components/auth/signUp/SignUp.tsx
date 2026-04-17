"use client";

import Image from "next/image";
import sms from "@/public/assets/images/sms.svg";
import user from "@/public/assets/images/user.svg";
import HeroAuth from "../heroAuth/HeroAuth";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";
import SignUpSkeleton from "@/components/skeletons/SignUpSkeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useGetCountriesQuery,
  useRegisterMutation,
} from "@/store/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

/** API values for `education_level` (form field) */
const EDUCATION_LEVEL_KEYS = [
  "none",
  "primary",
  "middle_or_preparatory",
  "secondary_general",
  "associate",
  "bachelor",
  "master_or_professional",
  "doctorate",
  "other",
] as const;

/** API values for `join_purpose` */
const JOIN_PURPOSE_KEYS = [
  "sharia_knowledge",
  "islamic_basics",
  "dawah_teaching_skills",
  "accredited_certifications",
] as const;

/** API values for `islamic_studies_level` */
const ISLAMIC_LEVEL_KEYS = ["beginner", "intermediate", "advanced"] as const;

const emailValid = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const SignUp = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [degree, setDegree] = useState("");
  const [goal, setGoal] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [birthDate, setBirthDate] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [phone, setPhone] = useState("");

  const { data: countries = [], isLoading: countriesLoading } =
    useGetCountriesQuery({ page: 0, limit: 0 });

  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) =>
      a.name.localeCompare(b.name, lang === "ar" ? "ar" : "en"),
    );
  }, [countries, lang]);

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
      value ? "scoundColor font-semibold text-sm" : "text-gray-400",
    );

  const dateInputClass = (value: string) =>
    cn(
      "mt-1 w-full p-2 border border-gray-300 rounded-md focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:outline-none!",
      value ? "scoundColor font-semibold text-sm" : "text-gray-400",
    );

  const radioLabelClass = (selected: boolean) =>
    cn(
      "flex cursor-pointer items-center gap-2 text-sm transition-colors",
      selected ? "scoundColor font-semibold" : "text-gray-400",
    );

  const radioInputClass =
    "h-4 w-4 shrink-0 border-gray-300 text-[#9F854E] focus:ring-[#9F854E] accent-[#9F854E]";

  const selectChevronClass = cn(
    "pointer-events-none absolute mt-[3px] top-1/2 -translate-y-1/2 text-gray-400!",
    isArabic ? "left-3" : "right-3",
  );

  const goStep2 = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error(t?.fillAllFields ?? "Please fill all fields");
      return;
    }
    if (!emailValid(email)) {
      toast.error(t?.invalidEmail ?? "Invalid email");
      return;
    }
    if (!password || !passwordConfirm) {
      toast.error(t?.fillAllFields ?? "Please fill all fields");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error(t?.passwordMismatch ?? "Passwords do not match");
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!country || !level || !degree || !goal || !gender || !birthDate) {
      toast.error(t?.fillAllFields ?? "Please fill all fields");
      return;
    }
    if (!termsAccepted) {
      toast.error(t?.termsRequired ?? "Accept terms");
      return;
    }

    const deviceToken =
      typeof window !== "undefined"
        ? localStorage.getItem("device_token") ?? ""
        : "";

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("mobile", phone.replace(/\D/g, ""));
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirm);
    formData.append("country_id", country);
    formData.append("date_of_birth", birthDate);
    formData.append("gender", gender);
    formData.append("education_level", degree);
    formData.append("islamic_studies_level", level);
    formData.append("join_purpose", goal);
    formData.append("device_token", deviceToken);
    formData.append("terms", "1");

    try {
      const res = await register(formData).unwrap();
      toast.success(res?.message ?? "");

      Cookies.set("reset_email", email.trim(), {
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
        toast.error(d.message);
        return;
      }
      toast.error(t?.requestFailed ?? "Something went wrong.");
    }
  };

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
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.name}
                    </label>
                    <div className="relative">
                      <Image
                        src={user}
                        alt="user"
                        width={20}
                        height={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5"
                      />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 scoundColor w-full p-2 border border-gray-300 rounded-md outline-none"
                      />
                    </div>
                  </div>

                  {/* email */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.email}
                    </label>
                    <div className="relative">
                      <Image
                        src={sms}
                        alt="sms"
                        width={20}
                        height={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 scoundColor w-full p-2 border border-gray-300 rounded-md outline-none"
                      />
                    </div>
                  </div>

                  {/* phone */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold ${lang === "ar" ? "text-right!" : "text-left"}
                     text-gray-500`}
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
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.password}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.confirmPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
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
                    onClick={goStep2}
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
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.signUp?.country}
                    </label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={countriesLoading}
                        className={selectValueClass(country)}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <option value="">
                          {countriesLoading
                            ? (t?.loadingCountries ?? t?.select)
                            : (t?.selectCountry ?? t?.select)}
                        </option>
                        {sortedCountries.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
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
                        {ISLAMIC_LEVEL_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {(t?.islamicLevels as Record<string, string> | undefined)?.[
                              key
                            ] ?? key}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
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
                        <option value="">
                          {t?.selectDegree ?? t?.select}
                        </option>
                        {EDUCATION_LEVEL_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {(t?.educationLevels as Record<string, string> | undefined)?.[
                              key
                            ] ?? key}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
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
                        {JOIN_PURPOSE_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {(t?.joinPurposes as Record<string, string> | undefined)?.[
                              key
                            ] ?? key}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold
                       text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
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

                  <label
                    className={`mb-4 flex cursor-pointer items-start gap-2 text-sm text-gray-600 ${lang === "ar" ? "flex-row-reverse text-right" : "text-left"}`}
                  >
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#9F854E]"
                    />
                    <span>{t?.termsAccept}</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full scoundBgColor text-white py-3 mt-6 rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
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
