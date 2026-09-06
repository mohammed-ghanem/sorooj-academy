"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CertificateCard from "@/components/auth/profile/CertificateCard";
import ProfileShell from "@/components/auth/profile/ProfileShell";
import { unwrapProfileUser } from "@/components/auth/profile/profileUser";
import {
  mapCertificateTabs,
  saveBlobFile,
} from "@/lib/profile/certificates";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import { formatGregorianDate } from "@/lib/studyPlan/formatStudyPlanDates";
import {
  useDownloadCertificateMutation,
  useGetProfileQuery,
} from "@/store/auth/authApi";
import { cn } from "@/lib/utils";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import type { StudentCertificate } from "@/lib/profile/certificates";

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

  const formatIssuedAt = (certificate: StudentCertificate) => {
    if (certificate.issuedAtLabel) return certificate.issuedAtLabel;
    const value = certificate.issuedAt;
    if (!value) return "";
    const dateOnly = value.trim().split(/[T\s]/)[0] ?? value;
    const formatted = formatGregorianDate(dateOnly, locale);
    return formatted && formatted !== dateOnly ? formatted : dateOnly;
  };

  const handleDownload = async (certificate: StudentCertificate) => {
    if (!certificate.hasFiles && !certificate.pdfUrl && !certificate.downloadUrl) {
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
      if (certificate.pdfUrl || certificate.downloadUrl) {
        window.open(
          certificate.pdfUrl || certificate.downloadUrl,
          "_blank",
          "noopener,noreferrer",
        );
        return;
      }
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
            style={{
              gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
            }}
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
        <div className="flex flex-col gap-4">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              cert={certificate}
              issuedLabel={formatIssuedAt(certificate)}
              dir={lang === "en" ? "ltr" : "rtl"}
              downloading={downloading}
              onDownload={() => void handleDownload(certificate)}
              labels={{
                type: p?.certificateType,
                serial: p?.serialNumber,
                issued: p?.issuedAt,
                viewImage: p?.viewImage ?? p?.viewCertificate,
                downloadPdf: p?.downloadPdf,
                close: p?.closeCertificate,
              }}
            />
          ))}
        </div>
      )}
    </ProfileShell>
  );
}
