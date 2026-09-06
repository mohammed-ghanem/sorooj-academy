import type { Metadata } from "next";
import type { ReactNode } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/lib/siteMetadata";
import { getSiteUrl } from "@/lib/siteUrl";
import "./[lang]/globals.css";

const site = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "اكاديمية سرج",
    "درسات فكرية",
    "ابحاث فكرية",
    "مذاهب فكرية",
    "دينية",
    "فلسفية",
    "سياسية",
    "تعليم متخصص",
  ],
  authors: [
    {
      name: SITE_TITLE,
      url: site,
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: site,
    siteName: SITE_TITLE,
    locale: "ar",
    type: "website",
    images: [
      {
        url: `${site}/assets/images/meta.png`,
        alt: SITE_TITLE,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${site}/assets/images/meta.png`,
        alt: SITE_TITLE,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="description" content={SITE_DESCRIPTION} />
      </head>
      <body className="overflow-x-hidden">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
