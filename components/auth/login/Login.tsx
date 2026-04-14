"use client";
import Image from "next/image";
import Link from "next/link";
import HeroAuth from "../heroAuth/HeroAuth";
import { Eye, EyeOff, Mail } from "lucide-react";
import logo from "@/public/assets/images/logoo.png";
import GlobeBtn from "@/components/header/GlobeBtn";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useState } from "react";
import SocialLogin from "../socialLogin/SocialLogin";
import LoginSkeleton from "@/components/skeletons/LoginSkeleton";

const Login = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const [showPassword, setShowPassword] = useState(false);

  if (!translate) {
    return <LoginSkeleton />;
  }

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
          <div
            className=" relative w-full max-w-xl rounded-2xl boxBgOpacity p-6 shadow-lg ring-1
           ring-black/5 md:p-8"
          >
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
                <h1 className="min-w-0 flex-1 text-xl font-bold mainColor md:text-2xl">
                  {translate?.pages?.selectAuth.title}
                  <span className="scoundColor">
                    {translate?.pages?.selectAuth.titleSpan}
                  </span>
                </h1>

                <div className="relative z-20 shrink-0 me-10 ">
                  <GlobeBtn />
                </div>
              </div>
              <p className="mt-2 text-sm text-[#737373] md:text-sm font-bold">
                {translate?.pages?.login.description}
              </p>
            </div>
            {/* login form */}
            <form className="p-0 md:p-4 mt-4  mx-auto z-30 relative" dir="ltr">
              <div className="mb-4">
                <label
                  className={`block text-[13px] font-semibold text-gray-400 
                  ${lang === "ar" ? "text-right!" : "text-left"}`}
                >
                  {translate?.pages.login.email}
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5" />
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none "
                  />
                </div>
              </div>
              {/* password input */}

              <div className="mb-4">
                <label
                  className={`block text-[13px] font-semibold text-gray-400
                 ${lang === "ar" ? "text-right!" : "text-left"}`}
                >
                  {translate?.pages.login.password}
                </label>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
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
              {/* forget password */}
              <Link
                href={`/${lang}/forget-password`}
                className="border-b border-regal-blue block
                              text-[13px] font-semibold w-fit text-start mainColor"
              >
                {translate?.pages.login.forgetPassword}
              </Link>
              {/* submit */}
              <button
                type="submit"
                className="w-full mx-auto scoundBgColor cursor-pointer text-white py-3 mt-8 rounded-lg flex justify-center"
              >
                {translate?.pages.login.loginButton}
              </button>
            </form>
            <SocialLogin />

            <div className="mt-2 text-center ">
              <span className="text-[13px] font-semibold">
                {translate?.pages.login.dontHaveUser}
              </span>
              <Link
                href={`/${lang}/sign-up`}
                className="border-b border-regal-blue ms-2 text-[13px] font-semibold w-fit mainColor"
              >
                {translate?.pages.login.createAccount}
              </Link>
            </div>
          </div>
        </div>
      </HeroAuth>
    </div>
  );
};

export default Login;
