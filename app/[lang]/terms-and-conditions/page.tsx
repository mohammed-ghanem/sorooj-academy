import { Metadata } from "next";
import PublicTermsAndConditions from "@/components/termsAndConditions/PublicTermsAndConditions";

export const metadata: Metadata = {
  title: "الشروط والأحكام - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  description: "الشروط والأحكام في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  keywords: [
    "الشروط والأحكام",
    "اكاديمية سرج",
    "درسات",
    "ابحاث",
    "فكرية",
    "معاصرة",
    "الشروط والأحكام",
    "الشروط والأحكام في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  ],
  authors: [
    {
      name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "الشروط والأحكام - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "الشروط والأحكام في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/terms-and-conditions",
    siteName: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    locale: "ar",
    type: "website",
    images: [
      { url: "https://academy.sorooj.org/assets/images/meta.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
        width: 1200,
        height: 630,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "الشروط والأحكام - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "الشروط والأحكام في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    images: [
      { url: "https://academy.sorooj.org/assets/images/meta.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      },
    ],
  },
};

export default function TermsAndConditionsPage() {
  return <PublicTermsAndConditions />;
}
