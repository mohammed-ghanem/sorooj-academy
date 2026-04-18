import { Metadata } from "next";
import PublicPrivacyPolicy from "@/components/privacyPolicy/PublicPrivacyPolicy";

export const metadata: Metadata = {
  title: "سياسة الخصوصية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  description: "سياسة الخصوصية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  keywords: [
    "سياسة الخصوصية",
    "اكاديمية سرج",
    "درسات",
    "ابحاث",
    "فكرية",
    "معاصرة",
    "سياسة الخصوصية"
  ],
  authors: [
    {
      name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "سياسة الخصوصية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "سياسة الخصوصية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/privacy-policy",
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
    title: "سياسة الخصوصية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "سياسة الخصوصية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    images: [
      { url: "https://academy.sorooj.org/assets/images/meta.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  return <PublicPrivacyPolicy />;
}
