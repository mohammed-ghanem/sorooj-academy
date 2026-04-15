"use client";

import SmallHeroSection from '../smallHeroSection/SmallHeroSection'
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import SocialLinks from '../socialLinks/SocialLinks';
import {  Mail } from "lucide-react";
import Image from "next/image";

const ContactUs = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  return (
    <div>
      <SmallHeroSection
        title={
          <h1 className="text-2xl font-semibold mt-28 mb-4 ">
            <span className="mainColor"> تواصل </span>
            <span className="scoundColor"> معانا </span>
          </h1>
        }
      />

      <div className="container mx-auto w-[90%] mt-10 px-8 py-6 rounded-xl shadow bkMainColor">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1 text-white">
          <h3 className='font-semibold text-sm my-4 bg-[#6d7383]/50 w-fit
           text-amber-50 rounded-lg py-2 px-4'>
            {translate?.pages?.contactUs.title}
            </h3>
          <h6 className='font-semibold text-3xl'>{translate?.pages?.contactUs.help}</h6>
          <p className='font-semibold text-sm my-4 smallDescriptionColor'>{translate?.pages?.contactUs.description}</p>
          <p className='font-bold text-medium my-4 text-amber-50'>{translate?.pages?.contactUs.yourMessage}</p>
          <div className='mt-4'>
              <SocialLinks className="rounded-md bg-[#6d7383] border-none"/>
          </div>

        </div>
        {/* form */}
        <div className="md:col-span-2 bg-white w-[90%] rounded-xl shadow mx-auto">
          <div className="">
            <div
              className=" relative w-full  rounded-2xl boxBgOpacity p-6 shadow-lg ring-1
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
                    تواصل معنا
                  </h1>

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
                    {translate?.pages?.contactUs.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400! w-5 h-5" />
                    <input
                      type="email"
                      required
                      className="mt-1 block scoundColor w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none "
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
  )
}

export default ContactUs