import Image from "next/image";
import footerlogo from "@/public/assets/images/logofooter.png";
import footerEffect from "@/public/assets/images/footer-effect.png";


import "./style.css";
import SocialLinks from "../socialLinks/SocialLinks";

const mainLinks = [
  { label: "الرئيسية", href: "#" },
  { label: "اعضاء هيئة التدريس", href: "#" },
  { label: "الخطة الدراسية", href: "#" },
  { label: "مسارات علمية مستقلة", href: "#" },
  { label: "المكتبة العلمية", href: "#" },
  { label: "تواصل معنا", href: "#" },
];

const secondaryLinks = [
  { label: "سياسة الخصوصية", href: "#" },
  { label: "الشروط والأحكام", href: "#" },
  { label: "حذف حسابك", href: "#" },
];


const Footer = () => {
  return (
    <footer className="relative mt-10 text-white pt-10 md:pt-20 lg:pt-26 footer-bg">
      <div className="relative z-10 max-w-6xl mx-auto w-[95%] md:w-[80%] text-center px-4">
        <div className="hidden md:block">
          <Image
            src={footerEffect}
            alt="footerEffect"
            className="m-auto"
            fill
          />
        </div>

        {/* Logo */}
        <div className="mb-6">
          <Image
            src={footerlogo}
            alt="footerLogo"
            className="m-auto"
            width={150}
            height={150}
          />
        </div>

        <div className="flex flex-row gap-4 md:flex-col">
          {/* Main Links */}
          <div
            className="
                grid grid-rows-6 md:flex md:justify-center
                font-bold w-1/2 md:w-full
                justify-start 
                text-sm text-white mb-6 text-start
              "
          >
            {mainLinks.map((link, index) => (
              <a key={index} href={link.href} className="my-2.5 md:mx-4">
                {link.label}
              </a>
            ))}
          </div>

          {/* Secondary Links */}
          <div
            className="
                    grid grid-rows-6 md:flex
                    justify-start md:justify-center
                    border-r border-white pr-5 md:pr-0 md:border-none 
                    text-sm font-bold w-1/2 md:w-full text-start
                    text-gray-200 mb-6
                  "
          >
            {secondaryLinks.map((link, index) => (
              <a key={index} href={link.href} className="md:mx-4">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-500 mb-2"></div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-4">
          <SocialLinks className="rounded-full"/>
        </div>

        {/* Divider */}
        {/* <div className="border-t border-gray-500 mb-2"></div> */}

        <div className="text-center text-white font-bold text-xs mt-6 pb-4">
          <p>
            All rights reserved for{" "}
            <span className="text-[#ffd86d]">Sorooj-Academy</span> &copy; 2026 -{" "}
            {new Date().getFullYear()}
          </p>
          <p className="text-white text-xs mt-2">WeCan For Development & IT</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
