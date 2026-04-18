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
import { useState, type SubmitEventHandler } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ContactUsSkeleton from "@/components/skeletons/ContactUsSkeleton";
import { useSubmitContactMutation } from "@/store/contact/contactApi";
import { toast } from "sonner";

const CONTACT_TYPE_KEYS = [
  "request",
  "inquiry",
  "suggestion",
  "complaint",
] as const;

const emailValid = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const ContactUs = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [submitContact, { isLoading }] = useSubmitContactMutation();

  const isArabic = lang === "ar";

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

  const c = translate.pages?.contactUs;
  const tSignUp = translate.pages?.signUp;
  const requestTypeLabels = c?.requestTypes as
    | Record<string, string>
    | undefined;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error(tSignUp?.fillAllFields ?? "Please fill all fields");
      return;
    }
    if (!emailValid(email)) {
      toast.error(tSignUp?.invalidEmail ?? "Invalid email address");
      return;
    }
    if (!request) {
      toast.error(c?.selectRequest ?? "Select request type");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("mobile", phone.replace(/\D/g, ""));
    formData.append("message", message.trim());
    formData.append("type", request);

    try {
      const res = await submitContact(formData).unwrap();
      toast.success(res?.message ?? "");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setRequest("");
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
      toast.error(tSignUp?.requestFailed ?? "Something went wrong.");
    }
  };

  return (
    <div>
      <SmallHeroSection
        title={
          <h1 className="text-2xl font-semibold mt-28 mb-4 ">
            <span className="mainColor">{c?.title}</span>
            <span className="scoundColor">{c?.titleSpan}</span>
          </h1>
        }
      />

      <div
        className={`relative container mx-auto w-[95%] lg:w-[70%] mt-10  
         md:px-8  py-1  md:py-9 rounded-xl shadow bkMainColor 
         ${lang === "ar" ? "md:pl-0!" : "md:pl-6!"}  ${lang === "en" ? "md:pr-0!" : "md:pr-6!"} `}
      
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
              {c?.contactUs}
            </h3>
            <h6 className="font-semibold text-3xl">{c?.help}</h6>
            <p className="font-semibold text-sm my-4 smallDescriptionColor">
              {c?.description}
            </p>
            <p className="font-bold text-medium my-4 text-amber-50">
              {c?.yourMessage}
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
                      {c?.title}
                      <span className="scoundColor">{c?.titleSpan}</span>
                    </h1>
                  </div>
                  <p className="mt-2 text-sm text-[#737373] md:text-sm font-semibold">
                    {c?.smallTitle}
                  </p>
                </div>
                <form
                  className="p-0 md:p-4 mt-4  mx-auto z-30 relative"
                  dir="ltr"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {c?.name}
                    </label>
                    <div className="relative">
                      <Image
                        src={user}
                        alt=""
                        width={20}
                        height={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5"
                      />
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold 
                    ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {c?.email}
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
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none "
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold ${lang === "ar" ? "text-right!" : "text-left"}
                     `}
                    >
                      {tSignUp?.phone}
                    </label>

                    <PhoneInput
                      country={"kw"}
                      value={phone}
                      onChange={(p) => setPhone(p)}
                      inputClass="mt-1 block w-full pl-[52px] pr-[0] py-[20px] border 
                       border-gray-300 rounded-md shadow-sm"
                      containerClass="mt-1"
                      buttonClass="!border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {c?.request}
                    </label>
                    <div className="relative">
                      <select
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        className={selectValueClass(request)}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <option value="">{c?.selectRequest}</option>
                        {CONTACT_TYPE_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {requestTypeLabels?.[key] ?? key}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={selectChevronClass} size={18} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block text-[13px] font-semibold ${lang === "ar" ? "text-right!" : "text-left"}`}
                    >
                      {c?.message}
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md 
                        shadow-sm outline-none h-32 resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mx-auto scoundBgColor cursor-pointer text-white py-3 mt-8 rounded-lg flex justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (c?.sending ?? "Sending…") : c?.send}
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
