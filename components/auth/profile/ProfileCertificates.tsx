"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Download, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import CertificateCard from "@/components/auth/profile/CertificateCard";
import ProfileShell from "@/components/auth/profile/ProfileShell";
import { unwrapProfileUser } from "@/components/auth/profile/profileUser";
import {
  isLikelyImageUrl,
  mapCertificateTabs,
  mergeCertificate,
  saveBlobFile,
  type StudentCertificate,
} from "@/lib/profile/certificates";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import { formatGregorianDate } from "@/lib/studyPlan/formatStudyPlanDates";
import {
  useDownloadCertificateMutation,
  useGetProfileQuery,
  useLazyGetCertificateQuery,
} from "@/store/auth/authApi";
import { cn } from "@/lib/utils";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import certificateIcon from "@/public/assets/images/certificate.svg";

export default function ProfileCertificates() {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const p = translate?.pages?.profile;
  const locale = lang === "en" ? "en" : "ar";

  const { data } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = unwrapProfileUser(data);
  const tabs = useMemo(
    () => mapCertificateTabs(user, p?.certificates ?? ""),
    [user, p?.certificates],
  );

  const [activeTab, setActiveTab] = useState("");
  const [selected, setSelected] = useState<StudentCertificate | null>(null);
  const [fetchCertificate, { isFetching: loadingDetails }] =
    useLazyGetCertificateQuery();
  const [downloadCertificate, { isLoading: downloading }] =
    useDownloadCertificateMutation();

  useEffect(() => {
    if (!tabs.length) return;
    if (!tabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs, activeTab]);

  const currentTab =
    tabs.find((tab) => tab.key === activeTab) ?? tabs[0] ?? null;
  const certificates = currentTab?.certificates ?? [];

  const formatIssuedAt = (value: string) => {
    if (!value) return "";
    const dateOnly = value.trim().split(/[T\s]/)[0] ?? value;
    const formatted = formatGregorianDate(dateOnly, locale);
    return formatted && formatted !== dateOnly ? formatted : dateOnly;
  };

  const handleView = async (certificate: StudentCertificate) => {
    setSelected(certificate);
    try {
      const details = await fetchCertificate(certificate.id).unwrap();
      setSelected((current) =>
        current?.id === certificate.id
          ? mergeCertificate(current, details)
          : current,
      );
    } catch (err) {
      toast.error(
        extractApiErrorMessage(err, p?.certificateLoadError ?? ""),
      );
    }
  };

  const handleDownload = async (certificate: StudentCertificate) => {
    if (!certificate.hasFiles) {
      toast.info(p?.certificateNotReady ?? "");
      return;
    }

    try {
      const file = await downloadCertificate(certificate.id).unwrap();
      if (file.url) {
        window.open(file.url, "_blank", "noopener,noreferrer");
        return;
      }
      saveBlobFile(
        file.blob,
        file.filename || `certificate-${certificate.id}.pdf`,
      );
    } catch (err) {
      toast.error(
        extractApiErrorMessage(err, p?.certificateDownloadError ?? ""),
      );
    }
  };

  return (
    <ProfileShell active="certificates">
      <h2 className="mb-5 text-base font-bold mainColor md:text-lg">
        {p?.certificates}
      </h2>

      {tabs.length > 1 ? (
        <div className="mb-5 overflow-hidden rounded-xl border border-[#efe7d8]">
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
          >
            {tabs.map((tab) => {
              const isActive = tab.key === currentTab?.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3 py-3 text-sm font-semibold transition-colors cursor-pointer",
                    isActive
                      ? "scoundColor border-b-2 border-[#9F854E] lightBgColor"
                      : "text-black bg-white hover:bg-[#faf7f1]",
                  )}
                >
                  {tab.label}
                  <span className="ms-1 tabular-nums descriptionColor">
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {certificates.length === 0 ? (
        <p className="text-sm font-semibold descriptionColor">
          {p?.emptyCertificates}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              title={certificate.title || (p?.certificateUntitled ?? "")}
              issuedAt={formatIssuedAt(certificate.issuedAt)}
              imageUrl={certificate.imageUrl}
              imageAlt={certificate.title || (p?.certificates ?? "")}
              viewLabel={p?.viewCertificate ?? ""}
              downloadLabel={p?.downloadPdf ?? ""}
              showDownload={certificate.hasFiles}
              downloading={downloading}
              onView={() => void handleView(certificate)}
              onDownload={() => void handleDownload(certificate)}
            />
          ))}
        </div>
      )}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          dir={lang === "en" ? "ltr" : "rtl"}
          className="max-h-[min(90vh,calc(100%-2rem))] max-w-[calc(100%-2rem)] gap-4 overflow-y-auto rounded-2xl border border-[#E8E0D4]/60 bg-white p-5 sm:max-w-2xl sm:p-6"
        >
          {selected ? (
            <>
              <DialogTitle className="text-center text-lg font-semibold mainColor">
                {selected.title || p?.certificateUntitled}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {p?.viewCertificate}
              </DialogDescription>

              <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-xl bg-[#faf7f1]">
                {loadingDetails ? (
                  <Loader2
                    className="h-8 w-8 animate-spin scoundColor"
                    aria-hidden
                  />
                ) : selected.imageUrl &&
                  isLikelyImageUrl(selected.imageUrl) ? (
                  <Image
                    src={selected.imageUrl}
                    alt={selected.title || (p?.certificates ?? "")}
                    width={900}
                    height={640}
                    className="max-h-[65vh] w-auto object-contain"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={certificateIcon}
                    alt=""
                    width={80}
                    height={80}
                  />
                )}
              </div>

              {selected.issuedAt ? (
                <p className="text-center text-sm descriptionColor">
                  {formatIssuedAt(selected.issuedAt)}
                </p>
              ) : null}

              {selected.hasFiles ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    disabled={downloading}
                    onClick={() => void handleDownload(selected)}
                    className="inline-flex items-center gap-1.5 rounded-md bkMainColor px-4 py-2 text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Download className="h-4 w-4" aria-hidden />
                    )}
                    {p?.downloadPdf}
                  </button>
                </div>
              ) : null}
            </>
          ) : null}

          <DialogClose asChild>
            <button
              type="button"
              className="absolute top-4 right-4 rounded-full border p-0.5 transition hover:bg-gray-200 rtl:right-auto rtl:left-4"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{p?.closeCertificate}</span>
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </ProfileShell>
  );
}
