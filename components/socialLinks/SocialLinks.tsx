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

function isHttpUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

const SocialLinks = ({
  className = "",
}: {
  className?: string;
}) => {
  const lang = LangUseParams();
  const locale = lang === "en" ? "en" : "ar";
  const { data: contacts } = useGetAppContactsQuery(
    { lang: locale },
    { refetchOnMountOrArgChange: true },
  );

  const socialLinks = [
    { icon: facebook, href: contacts?.facebook ?? "", label: "Facebook" },
    { icon: twitter, href: contacts?.x ?? "", label: "X" },
    { icon: telegram, href: contacts?.telegram ?? "", label: "Telegram" },
    { icon: youtube, href: contacts?.youtube ?? "", label: "YouTube" },
    { icon: instagram, href: contacts?.instagram ?? "", label: "Instagram" },
  ].filter((item) => isHttpUrl(item.href));

  if (socialLinks.length === 0) return null;

  return (
    <div className="flex gap-4 mt-2">
      {socialLinks.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-label={item.label}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 border flex items-center justify-center ${className}`}
        >
          <Image
            src={item.icon}
            alt=""
            width={item.icon === facebook ? 10 : 20}
            height={item.icon === facebook ? 10 : 20}
            aria-hidden
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialLinks;
