import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "../../providers/Providers";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HtmlLang from "@/components/i18n/HtmlLang";
import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_TITLE,
  SITE_TITLE_EN,
} from "@/lib/siteMetadata";
import { getSiteUrl } from "@/lib/siteUrl";

const site = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  return {
    title: isEn ? SITE_TITLE_EN : SITE_TITLE,
    description: isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION,
    openGraph: {
      title: isEn ? SITE_TITLE_EN : SITE_TITLE,
      description: isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION,
      url: site,
      locale: isEn ? "en" : "ar",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <Providers>
      <HtmlLang lang={lang} dir={dir} />
      <div>
        <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
          <Header />
        </header>

        <main>
          <div className="mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </Providers>
  );
}
