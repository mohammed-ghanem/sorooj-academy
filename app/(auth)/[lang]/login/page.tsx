import { Metadata } from "next";
import Login from "@/components/auth/login/Login";

export const metadata: Metadata = {
  title: "تسجيل الدخول للطلاب - Sorooj Academy",
  description:
    "تسجيل الدخول للطلاب للدخول إلى حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة  ",
  keywords: [
    "تسجيل الدخول",
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
    title:
      "تسجيل الدخول للطلاب - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description:
      "تسجيل الدخول للطلاب للدخول إلى حسابك في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/login",
    siteName: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    locale: "ar",
    type: "website",
    images: [{ url: "https://academy.sorooj.org/logo.png" }],
  },
};

export default function LoginPage() {
  return <Login />;
}
