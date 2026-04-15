import { Metadata } from "next";
import ContactUs from "@/components/contactUs/ContactUs";

export const metadata: Metadata = {
  title: "  تواصل معنا - Sorooj Academy",
  description:
    "     تواصل معنا في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة  ",
  keywords: [
    "تواصل معنا",
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
      "  تواصل معنا - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description:
      "     تواصل معنا في اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    url: "https://academy.sorooj.org/contact-us",
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
};

export default function Contact() {
  return <ContactUs/>
}
