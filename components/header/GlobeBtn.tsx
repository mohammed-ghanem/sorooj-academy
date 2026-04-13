"use client"
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";

const GlobeBtn = () => {
    const lang = LangUseParams();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const newLang = lang === "en" ? "ar" : "en";
        const segments = pathname.split("/").filter(Boolean);

        if (segments[0] === "en" || segments[0] === "ar") {
            segments[0] = newLang;
        } else {
            segments.unshift(newLang);
        }

        const path = "/" + segments.join("/");
        const query =
            typeof window !== "undefined" ? window.location.search : "";
        router.push(path + query);
    };

    return (
        <button
            type="button"
            className="inline-flex items-center cursor-pointer rounded-md p-1 scoundColor hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F854E]"
            onClick={toggleLanguage}
            aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
        >
            <Globe className="h-5 w-5" />
        </button>
    );
};

export default GlobeBtn