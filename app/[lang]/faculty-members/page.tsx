import { Metadata } from "next"
import FacultyMembers from "@/components/faculty/FacultyMembers"

export const metadata: Metadata = {
  title: "هيئة التدريس - Sorooj Academy",
  description:
    "تعرف على أعضاء هيئة التدريس في أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة.",
  keywords: ["هيئة التدريس", "أكاديمية سرج", "تدريس", "علوم شرعية"],
  authors: [
    {
      name: "أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "هيئة التدريس - أكاديمية سرج",
    description:
      "تعرف على أعضاء هيئة التدريس في أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة.",
    url: "https://academy.sorooj.org/faculty-members",
    siteName: "أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة",
    locale: "ar",
    type: "website",
    images: [
      {
        url: "https://academy.sorooj.org/assets/images/meta.png",
        alt: "أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة",
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function FacultyMembersPage() {
  return <FacultyMembers />
}
