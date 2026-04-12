import Image from "next/image";
import footerlogo from "@/public/assets/images/logofooter.png";
import footerEffect from "@/public/assets/images/footer-effect.png";
import facebook from "@/public/assets/images/facebook.svg";
import twitter from "@/public/assets/images/twitter.svg";
import instagram from "@/public/assets/images/instagram.svg";
import youtube from "@/public/assets/images/youtube.svg";
import telegram from "@/public/assets/images/telegram.svg";

import "./style.css";

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

const socialLinks = [
  { icon: telegram, href: "#" },
  { icon: instagram, href: "#" },
  { icon: twitter, href: "#" },
  { icon: facebook, href: "#" },
  { icon: youtube, href: "#" },
];

const Footer = () => {
  return (
    <footer className="relative mt-10 text-white pt-10 md:pt-20 lg:pt-32 footer-bg">
        <div className="hidden md:block">
          <Image
            src={footerEffect}
            alt="footerEffect"
            className="m-auto"
           fill
          />

        </div>
      <div className="relative z-10 max-w-6xl mx-auto w-[95%] md:w-[80%] text-center px-4">

      
        
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
        <div className="
                grid grid-rows-6
                font-bold w-1/2 md:w-full
                justify-start md:justify-center
                text-sm text-white mb-6 text-start
              ">
                  {mainLinks.map((link, index) => (
                    <a key={index} href={link.href} className="mb-2.5">
                      {link.label}
                    </a>
                  ))}
                </div>

                {/* Secondary Links */}
                <div className="
                    grid grid-rows-6 md:flex
                    justify-start md:justify-center
                    border-r border-white pr-5
                    text-sm font-bold w-1/2 md:w-full text-start
                    text-gray-200 mb-6
                  ">
                  {secondaryLinks.map((link, index) => (
                    <a key={index} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </div>

        </div>

       
        {/* Divider */}
        <div className="border-t border-gray-500 mb-2"></div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-4">
          {socialLinks.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="w-10 h-10 border rounded-full flex items-center justify-center"
            >
              <Image src={item.icon} alt="icon" 
                width={item.icon === facebook ? 10 : 20}
                height={item.icon === facebook ? 10 : 20} />
            </a>
          ))}
        </div>

         {/* Divider */}
         {/* <div className="border-t border-gray-500 mb-2"></div> */}

        <div className='text-center text-white font-bold text-xs mt-6 pb-4' >
        <p>
          All rights reserved for <span className='text-[#ffd86d]'>Sorooj-Academy</span>  &copy; 2026 - {new Date().getFullYear()}
        </p>
        <p className='text-white text-xs mt-2'>WeCan For Development & IT</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;