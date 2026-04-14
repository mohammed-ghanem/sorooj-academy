import SignUp from "@/components/auth/signUp/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "انشاء حساب للطلاب - Sorooj Academy",
  description:
    "انشاء حساب للطلاب للانشاء حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  keywords: [
    "انشاء حساب",
    "طلاب",
    "اكاديمية سرج",
    "درسات",
    "ابحاث",
    "فكرية",
    "معاصرة",
  ],
  authors: [
    {
      name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "انشاء حساب للطلاب - Sorooj Academy",
    description:
      "انشاء حساب للطلاب للانشاء حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/sign-up",
    siteName: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    locale: "ar",
    type: "website",
    images: [{ url: "https://academy.sorooj.org/logo.png" }],
  },
};

export default function SignUpPage() {
  return <SignUp />;
}
