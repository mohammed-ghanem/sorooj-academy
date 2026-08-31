import { Metadata } from "next";
import ChangePassword from "@/components/auth/changePassword/ChangePassword";

export const metadata: Metadata = {
  title: "تغيير كلمة المرور - أكاديمية سرج",
  description: "تغيير كلمة مرور حساب الطالب في أكاديمية سرج.",
  robots: "noindex, nofollow",
};

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
