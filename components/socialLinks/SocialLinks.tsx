"use client";

import Image from "next/image";
import facebook from "@/public/assets/images/facebook.svg";
import twitter from "@/public/assets/images/twitter.svg";
import instagram from "@/public/assets/images/instagram.svg";
import youtube from "@/public/assets/images/youtube.svg";
import telegram from "@/public/assets/images/telegram.svg";
import Link from "next/link";
import { useGetAppContactsQuery } from "@/store/staticPages/staticPagesApi";
import LangUseParams from "@/translate/LangUseParams";

const SocialLinks = ({
  className = "",
}: {
  className?: string;
}) => {
  const lang = LangUseParams();
  const locale = lang === "en" ? "en" : "ar";
  const { data: contacts } = useGetAppContactsQuery({ lang: locale });

  const socialLinks = [
    { icon: telegram, href: contacts?.telegram || "#" },
    { icon: instagram, href: contacts?.instagram || "#" },
    { icon: twitter, href: contacts?.x || "#" },
    { icon: facebook, href: contacts?.facebook || "#" },
    { icon: youtube, href: contacts?.youtube || "#" },
  ];

  return (
    <div className="flex gap-4 mt-2">
      {socialLinks.map((item, index) => {
        const isExternal = item.href.startsWith("http");

        return (
          <Link
            key={index}
            href={item.href}
            className={`w-10 h-10 border flex items-center justify-center ${className}`}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <Image
              src={item.icon}
              alt="icon"
              width={item.icon === facebook ? 10 : 20}
              height={item.icon === facebook ? 10 : 20}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default SocialLinks;
