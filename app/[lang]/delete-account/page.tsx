import { Metadata } from "next";
import PublicDeleteAccount from "@/components/deleteAccount/PublicDeleteAccount";

export const metadata: Metadata = {
  title: "حذف حسابك - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  description:
    "كيفية حذف حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  keywords: [
    "حذف حساب",
    "اكاديمية سرج",
    "درسات",
    "ابحاث",
    "فكرية",
    "معاصرة",
    "كيفية حذف حسابك",
    "حذف حسابك",
    "حذف حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  ],
  authors: [
    {
      name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "حذف حسابك - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description:
      "كيفية حذف حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/delete-account",
    siteName: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    locale: "ar",
    type: "website",
    images: [
      {
        url: "https://academy.sorooj.org/assets/images/meta.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "حذف حسابك - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "كيفية حذف حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    images: [
      { url: "https://academy.sorooj.org/assets/images/meta.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      },
    ],
  },
};

export default function DeleteAccountPage() {
  return <PublicDeleteAccount />;
}
