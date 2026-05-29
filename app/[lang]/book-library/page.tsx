import { Metadata } from "next";
import BookLibiraryCategories from "@/components/bookLibirary/BookLibiraryCategories";

export const metadata: Metadata = {
  title: "المكتبة العلمية - أكاديمية سرج",
  description:
    "تصفح أقسام المكتبة العلمية في أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة.",
  keywords: ["المكتبة العلمية", "أكاديمية سرج", "كتب", "فقه", "شريعة"],
  authors: [
    {
      name: "أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة",
      url: "https://academy.sorooj.org",
    },
  ],
  robots: "index, follow",
  openGraph: {
    title: "المكتبة العلمية - أكاديمية سرج",
    description:
      "تصفح أقسام المكتبة العلمية في أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة.",
    url: "https://academy.sorooj.org/book-library",
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
};

export default function BookLibraryPage() {
  return <BookLibiraryCategories />;
}
