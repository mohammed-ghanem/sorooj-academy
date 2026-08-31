import { Metadata } from "next";
import ProfileCertificates from "@/components/auth/profile/ProfileCertificates";

export const metadata: Metadata = {
  title: "شهاداتي - أكاديمية سرج",
  robots: "noindex, nofollow",
};

export default function ProfileCertificatesPage() {
  return <ProfileCertificates />;
}
