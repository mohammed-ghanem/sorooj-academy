import { ReactNode } from "react";
import { Providers } from "@/providers/Providers";
import HtmlLang from "@/components/i18n/HtmlLang";

export default async function AuthLayout({
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
      <div>{children}</div>
    </Providers>
  );
}
