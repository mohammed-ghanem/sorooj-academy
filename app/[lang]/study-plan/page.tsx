import { Metadata } from "next";
import StudyPlan from "@/components/studyPlan/StudyPlan";

export const metadata: Metadata = {
  title: "الخطة الدراسية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  description:
    "الخطة الدراسية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  keywords: [
    "الخطة الدراسية",
    "اكاديمية سرج",
    "درسات",
    "ابحاث",
    "فكرية",
    "معاصرة",
    "الخطة الدراسية",
    "الخطة الدراسية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  ],
  authors: [
    {
      name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "الخطة الدراسية - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description:
      "الخطة الدراسية في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/study-plan",
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
};

export default function StudyPlanPage() {
  return <StudyPlan />;
}
