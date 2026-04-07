"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/images/logoo.png";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الخطة الدراسية", href: "/" },
  { label: "هيئة التدريس", href: "/" },
  { label: "مسارات علمية مستقلة", href: "/" },
  { label: "المكتبة العلمية", href: "/" },
  { label: "تواصل معنا", href: "/" },
];

const Navbar = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div
          className="flex items-center justify-between mt-4 rounded-xl px-6 py-1
         bgTitleColorOpacity   shadow-sm"
        >
          {/* Right - Logo */}
          <div className="flex items-center gap-2 ">
            <Image src={logo} alt="logo" width={120} height={120} />
          </div>

          {/* Center - Links */}
          <nav className="hidden md:flex items-center gap-8 text-base">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:mainColor transition font-bold mainColor"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Left - Actions */}
          <div className="flex items-center gap-3">
            {/* Language Circle */}
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              ع
            </div>

            {/* Button */}
            <button className="scoundBgColor text-white px-4 py-2 rounded-lg text-sm">
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
