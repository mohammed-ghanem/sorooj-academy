"use client";

import SmallHeroSection from "../smallHeroSection/SmallHeroSection";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import SocialLinks from "../socialLinks/SocialLinks";
import Image from "next/image";
import sms from "@/public/assets/images/sms.svg";
import user from "@/public/assets/images/user.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.css";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ContactUsSkeleton from "@/components/skeletons/ContactUsSkeleton";
const ContactUs = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const [phone, setPhone] = useState("");
  const isArabic = lang === "ar";
  const [request, setRequest] = useState("");

  const selectValueClass = (value: string) =>
    cn(
      "appearance-none mt-1 w-full p-2 border border-gray-300 rounded-md focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:outline-none!",
      value ? "scoundColor font-semibold text-sm" : "text-gray-400",
    );

  const selectChevronClass = cn(
    "pointer-events-none absolute mt-[3px] top-1/2 -translate-y-1/2 text-gray-400!",
    isArabic ? "left-3" : "right-3",
  );

  if (!translate) {
    return <ContactUsSkeleton />;
  }

  return (
    <div>
      <SmallHeroSection
        title={
          <h1 className="text-2xl font-semibold mt-28 mb-4 ">
            <span className="mainColor">
              {translate?.pages?.contactUs.title}
            </span>
            <span className="scoundColor">
              {translate?.pages?.contactUs.titleSpan}
            </span>
          </h1>
        }
      />

      <div
        className="relative container mx-auto w-[95%] lg:w-[70%] mt-10   md:px-8 px-0 py-1 md:py-6 rounded-xl 
      shadow bkMainColor"
      >
        <div className="pointer-events-none absolute bottom-2 -right-28 opacity-5">
          <Image
            src="/assets/images/contactbg.webp"
            alt=""
            width={600}
            height={600}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 text-white lg:px-0 px-4">
            <h3
              className="font-semibold text-sm my-4 bg-[#6d7383]/50 w-fit
           text-amber-50 rounded-4xl border border-white shadow-lg py-2 px-4 "
            >
              {translate?.pages?.contactUs.contactUs}
            </h3>
            <h6 className="font-semibold text-3xl">
              {translate?.pages?.contactUs.help}
            </h6>
            <p className="font-semibold text-sm my-4 smallDescriptionColor">
              {translate?.pages?.contactUs.description}
            </p>
            <p className="font-bold text-medium my-4 text-amber-50">
              {translate?.pages?.contactUs.yourMessage}
            </p>
            <div className="mt-4">
              <SocialLinks className="rounded-md bg-[#6d7383] border-none" />
            </div>
          </div>
          {/* form */}
          <div className="lg:col-span-2 bg-white w-[90%] rounded-xl shadow mx-auto lg:mt-0 mt-10">
            <div className="">
              <div
                className=" relative w-full  rounded-2xl boxBgOpacity shadow-lg ring-1
            ring-black/5  md:px-8 md:py-8 px-4 py-4"
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
                    <h1 className="min-w-0 flex-1 text-xl font-semibold mainColor md:text-2xl">
                      {translate?.pages?.contactUs.title}
                      <span className="scoundColor">
                        {translate?.pages?.contactUs.titleSpan}
                      </span>
                    </h1>
                  </div>
                  <p className="mt-2 text-sm text-[#737373] md:text-sm font-semibold">
                    {translate?.pages?.contactUs.smallTitle}
                  </p>
                </div>
                {/* login form */}
                <form
                  className="p-0 md:p-4 mt-4  mx-auto z-30 relative"
                  dir="ltr"
                >
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
                      <input className="mt-1 scoundColor w-full p-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                  </div>
                  {/* email */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-500 
                    ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.contactUs.email}
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
                        required
                        className="mt-1 block scoundColor w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none "
                      />
                    </div>
                  </div>
                  {/* phone (NEW) */}
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
                       border-gray-300 rounded-md shadow-sm"
                      containerClass="mt-1"
                      buttonClass="!border-gray-300"
                    />
                  </div>
                  {/* request  */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.contactUs.request}
                    </label>
                    <div className="relative">
                      <select
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        className={selectValueClass(request)}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <option value="">
                          {translate?.pages?.contactUs.selectRequest}
                        </option>
                        <option value="request">طلب</option>
                        <option value="suggestion">اقتراح</option>
                        <option value="complaint">شكوى</option>
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>
                  {/* message */}
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold text-gray-500 ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {translate?.pages?.contactUs.message}
                    </label>
                    <div className="relative">
                      <textarea
                        className="mt-1 block scoundColor w-full p-2 border border-gray-300 rounded-md 
                        shadow-sm outline-none h-32 resize-none"
                      />
                    </div>
                  </div>

                  {/* submit */}
                  <button
                    type="submit"
                    className="w-full mx-auto scoundBgColor cursor-pointer text-white py-3 mt-8 rounded-lg flex justify-center"
                  >
                    {translate?.pages?.contactUs.send}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
