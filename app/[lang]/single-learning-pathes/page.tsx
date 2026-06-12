import SingleLearningPathes from "@/components/singleLearningPathes/SingleLearningPathes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المسارات العلمية المستقلة - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  description:
    "المسارات العلمية المستقلة في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  keywords: [
    "المسارات العلمية المستقلة",
    "اكاديمية سرج",
    "درسات",
    "ابحاث",
    "فكرية",
    "معاصرة",
    "المسارات العلمية المستقلة",
    "المسارات العلمية المستقلة في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  ],
  authors: [
    {
      name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
        title: "المسارات العلمية المستقلة - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description:
      "المسارات العلمية المستقلة في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/single-learning-pathes",
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

export default function SingleLearningPathesPage() {
  return <SingleLearningPathes />;
}
