import Image from "next/image";
import facebook from "@/public/assets/images/facebook.svg";
import twitter from "@/public/assets/images/twitter.svg";
import instagram from "@/public/assets/images/instagram.svg";
import youtube from "@/public/assets/images/youtube.svg";
import telegram from "@/public/assets/images/telegram.svg";
import Link from "next/link";

const socialLinks = [
  { icon: telegram, href: "#" },
  { icon: instagram, href: "#" },
  { icon: twitter, href: "#" },
  { icon: facebook, href: "#" },
  { icon: youtube, href: "#" },
];

const SocialLinks = ({
    className = "",
  }: {
    className?: string;
  }) => {
    return (
      <div className="flex gap-4 mt-2">
        {socialLinks.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`w-10 h-10 border flex items-center justify-center ${className}`}
          >
            <Image
              src={item.icon}
              alt="icon"
              width={item.icon === facebook ? 10 : 20}
              height={item.icon === facebook ? 10 : 20}
            />
          </Link>
        ))}
      </div>
    );
  };

export default SocialLinks;