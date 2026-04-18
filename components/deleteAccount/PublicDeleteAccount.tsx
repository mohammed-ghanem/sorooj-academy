"use client";

import SmallHeroSection from "@/components/smallHeroSection/SmallHeroSection";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useGetStaticDeleteAccountQuery } from "@/store/staticPages/staticPagesApi";
import { cn } from "@/lib/utils";

const PublicDeleteAccount = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const p = translate?.pages?.deleteAccountPage;

  const { data, isLoading, isError, refetch } = useGetStaticDeleteAccountQuery(
    {
      lang: lang ?? "ar",
    },
  );

  if (!translate) {
    return (
      <div className="min-h-[50vh] animate-pulse bg-gray-100/50" aria-hidden />
    );
  }

  const html = data?.html?.trim() ?? "";

  return (
    <div>
      <SmallHeroSection
        title={
          <h1 className="text-2xl font-semibold mt-28 mb-4">
            <span className="mainColor">{p?.title}</span>
            <span className="scoundColor">{p?.titleSpan}</span>
          </h1>
        }
      />

      <div className="container mx-auto w-[95%] max-w-4xl px-4 py-10 md:py-14">
        {isLoading && (
          <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
          </div>
        )}

        {isError && !isLoading && (
          <div
            className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-center text-sm text-red-800"
            role="alert"
          >
            <p className="mb-4 font-semibold">{p?.error}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="scoundBgColor rounded-lg px-4 py-2 text-white"
            >
              {lang === "ar" ? "إعادة المحاولة" : "Try again"}
            </button>
          </div>
        )}

        {!isLoading && !isError && html.length === 0 && (
          <p className="text-center text-sm text-gray-600">{p?.empty}</p>
        )}

        {!isLoading && !isError && html.length > 0 && (
          <article
            className={cn(
              "rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10",
              "[&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold",
              "[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold",
              "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold",
              "[&_p]:mb-3 [&_p]:leading-relaxed",
              "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6",
              "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6",
              "[&_a]:text-[#9F854E] [&_a]:underline",
              "[&_img]:max-w-full [&_img]:h-auto",
            )}
            dir={lang === "ar" ? "rtl" : "ltr"}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
};

export default PublicDeleteAccount;
