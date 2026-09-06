"use client";

import Image from "next/image";
import { Download, Eye, Loader2 } from "lucide-react";
import { isLikelyImageUrl } from "@/lib/profile/certificates";
import certificateIcon from "@/public/assets/images/certificate.svg";

type CertificateCardProps = {
  title: string;
  issuedAt?: string;
  imageUrl?: string;
  imageAlt?: string;
  viewLabel: string;
  downloadLabel: string;
  showDownload?: boolean;
  downloading?: boolean;
  onView: () => void;
  onDownload?: () => void;
};

export default function CertificateCard({
  title,
  issuedAt,
  imageUrl,
  imageAlt,
  viewLabel,
  downloadLabel,
  showDownload = false,
  downloading = false,
  onView,
  onDownload,
}: CertificateCardProps) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl px-4 py-4 sm:gap-4 sm:px-6 bg-[linear-gradient(90deg,#e3d6c4_0%,#f6f3ec_52%,#eee6d8_100%)]">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-white">
          {imageUrl && isLikelyImageUrl(imageUrl) ? (
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Image src={certificateIcon} alt="" width={36} height={36} />
            </div>
          )}
        </div>
        <div className="min-w-0 text-start">
          <h3 className="text-sm font-bold leading-snug text-black">{title}</h3>
          {issuedAt ? (
            <p className="mt-1 text-xs descriptionColor">{issuedAt}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onView}
          aria-label={viewLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9F854E] bg-white text-[#9F854E] cursor-pointer transition hover:bg-[#faf7f1]"
        >
          <Eye className="h-4 w-4" aria-hidden />
        </button>
        {showDownload ? (
          <button
            type="button"
            disabled={downloading}
            onClick={onDownload}
            aria-label={downloadLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full scoundBgColor text-white cursor-pointer transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
          </button>
        ) : null}
      </div>
    </article>
  );
}
