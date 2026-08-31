import { Metadata } from "next";
import ProfileDetails from "@/components/auth/profile/ProfileDetails";

export const metadata: Metadata = {
  title: "الملف الشخصي - أكاديمية سرج",
  description: "عرض الملف الشخصي لطالب أكاديمية سرج.",
  robots: "noindex, nofollow",
};

export default function ProfilePage() {
  return <ProfileDetails />;
}
