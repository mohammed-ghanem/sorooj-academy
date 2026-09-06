import type { Metadata } from "next";
import HomePage from "@/components/homePage/HomePage";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}

