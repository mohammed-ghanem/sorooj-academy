"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import people from "@/public/assets/images/people.svg";
import ayah from "@/public/assets/images/ayah.svg";
import readbook from "@/public/assets/images/readbook.svg";
import global from "@/public/assets/images/global.svg";
import { useGetHomeStatisticsQuery } from "@/store/studentHome/studentHomeApi";
import LangUseParams from "@/translate/LangUseParams";

const STAT_ICONS: Record<string, StaticImageData> = {
  registered_students: people,
  specialized_subjects: ayah,
  faculty_members: readbook,
  participating_countries: global,
};

const FALLBACK_ICONS = [people, ayah, readbook, global];

function iconForStat(key: string, index: number): StaticImageData {
  return STAT_ICONS[key] ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

function formatStatValue(value: number): string {
  return `${value} +`;
}

const StatusSection = () => {
  const lang = LangUseParams();
  const locale = lang === "en" ? "en" : "ar";

  const {
    data: stats = [],
    isLoading,
    isUninitialized,
    isFetching,
  } = useGetHomeStatisticsQuery({ lang: locale });

  const showSkeleton =
    isUninitialized || isLoading || (isFetching && stats.length === 0);

  return (
    <section className="relative z-11 p-4 -mt-19">
      <div
        className="max-w-6xl mx-auto rounded-2xl
         shadow-lg py-8 ps-4 md:px-1 block md:grid grid-cols-2 md:grid-cols-4 gap-6 
         text-center bgTitleColorOpacity2"
      >
        {showSkeleton
          ? FALLBACK_ICONS.map((_, index) => (
              <div
                key={`stat-skeleton-${index}`}
                className="flex items-center justify-start md:justify-center border-l-none
             md:border-l last:border-none border-[#9f854e7a] mt-2.5 md:mt-0"
                aria-hidden
              >
                <div className="lightBgColor ml-4 h-12 w-12 animate-pulse rounded-md" />
                <div className="text-start">
                  <div className="h-7 w-16 animate-pulse rounded bg-[#9F854E]/15" />
                  <div className="mt-2 h-4 w-24 animate-pulse rounded bg-[#9F854E]/15" />
                </div>
              </div>
            ))
          : stats.map((stat, index) => (
              <div
                key={stat.key}
                className="flex items-center justify-start md:justify-center border-l-none
             md:border-l last:border-none border-[#9f854e7a] mt-2.5 md:mt-0"
              >
                <div className="  lightBgColor p-3 rounded-md ml-4">
                  <Image
                    width={30}
                    height={30}
                    src={iconForStat(stat.key, index)}
                    alt={stat.label}
                  />
                </div>

                <div className="text-start">
                  <p className="text-2xl font-bold mainColor">
                    {formatStatValue(stat.value)}
                  </p>
                  <p className="text-sm mt-1 descriptionColor font-bold">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default StatusSection;
