import StudyTopics from "@/components/studyTopics/StudyTopics";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المحاور الدراسية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  description: "المحاور الدراسية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  keywords: [
    "المحاور الدراسية",
    "اكاديمية سرج",
    "درسات",
    "ابحاث",
    "فكرية",
    "معاصرة",
    "المحاور الدراسية",
    "المحاور الدراسية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  ],
  authors: [
    {
      name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "المحاور الدراسية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "المحاور الدراسية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/study-topics",

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
    title: "المحاور الدراسية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "المحاور الدراسية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    images: [
      { url: "https://academy.sorooj.org/assets/images/meta.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      },
    ],
  },
};
export default function StudyTopicsPage() {
  return <StudyTopics />;
}