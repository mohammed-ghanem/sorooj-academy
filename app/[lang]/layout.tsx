import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../../providers/Providers";
import { ReactNode } from "react";
import { Cairo } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة ",
  description: "اكاديمية سُرُجْ - منارة للبحث العلمى والتعليم المتخصص فى استكشاف وفهم المذاهب الفكرية المعاصرة , بما فى ذلك الدينية والفلسفية والسياسية من اجل تمكين المتعلمين فى اتخاذ قرارات مستنيرة فى ظل التنوع الفكرى المتزايد",
  keywords: ["اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة", "sorooj academy for contemporary intellectual studies and research", "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة", "sorooj academy for contemporary intellectual studies and research", "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة", "sorooj academy for contemporary intellectual studies and research"],
  authors: [{ name: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة", url: "https://academy.sorooj.org" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "اكاديمية سُرُجْ - منارة للبحث العلمى والتعليم المتخصص فى استكشاف وفهم المذاهب الفكرية المعاصرة , بما فى ذلك الدينية والفلسفية والسياسية من اجل تمكين المتعلمين فى اتخاذ قرارات مستنيرة فى ظل التنوع الفكرى المتزايد",
    url: "https://academy.sorooj.org",
    siteName: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    locale: "ar",
    type: "website",
    images: [
      {
        url: "https://academy.sorooj.org/logo.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
    description: "اكاديمية سُرُجْ - منارة للبحث العلمى والتعليم المتخصص فى استكشاف وفهم المذاهب الفكرية المعاصرة , بما فى ذلك الدينية والفلسفية والسياسية من اجل تمكين المتعلمين فى اتخاذ قرارات مستنيرة فى ظل التنوع الفكرى المتزايد",
    images: [
      {
        url: "https://academy.sorooj.org/logo.png",
        alt: "اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className={cairo.variable}>
      <body className="overflow-x-hidden">
        <Providers>
          <div className="">
            <div>
              <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
                <Header />
              </header>

              <main className="">
                <div className="mx-auto">{children}</div>
              </main>

              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
