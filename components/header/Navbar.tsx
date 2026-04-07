"use client";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex items-center justify-between mt-4 rounded-xl px-6 py-3 
         bgTitleColorOpacity   shadow-sm">

          {/* Right - Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/Vector.svg"
              alt="logo"
              width={40}
              height={40}
            /> 
          </div>

          {/* Center - Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
            <Link href="#">الرئيسية</Link>
            <Link href="#">الخطة الدراسية</Link>
            <Link href="#">هيئة التدريس</Link>
            <Link href="#">مسارات علمية مستقلة</Link>
            <Link href="#">المكتبة العلمية</Link>
            <Link href="#">تواصل معنا</Link>
          </nav>

          {/* Left - Actions */}
          <div className="flex items-center gap-3">
            
            {/* Language Circle */}
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              ع
            </div>

            {/* Button */}
            <button className="bg-[#8B6B3E] text-white px-4 py-2 rounded-lg text-sm">
              تسجيل الدخول
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;