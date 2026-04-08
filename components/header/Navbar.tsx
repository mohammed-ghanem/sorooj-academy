"use client";

import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="relative flex items-center justify-between mt-4 rounded-xl px-6 py-2 bgTitleColorOpacity shadow-sm">
          
          {/* Logo */}
          <Image src={logo} alt="logo" width={100} />

          {/* Desktop Links */}
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

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              ع
            </div>

            <button className="scoundBgColor text-white px-4 py-2 rounded-lg text-sm">
              تسجيل الدخول
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="w-6 h-0.5 scoundBgColor"></span>
            <span className="w-6 h-0.5 scoundBgColor"></span>
            <span className="w-6 h-0.5 scoundBgColor"></span>
          </button>

          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-3 p-4 flex flex-col gap-4 md:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-bold mainColor"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Actions inside mobile */}
              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                  ع
                </div>

                <button className="scoundBgColor text-white px-4 py-2 rounded-lg text-sm w-full">
                  تسجيل الدخول
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;