import { Metadata } from "next";
import ProfileJourney from "@/components/auth/profile/ProfileJourney";

export const metadata: Metadata = {
  title: "رحلتي العلمية - أكاديمية سرج",
  robots: "noindex, nofollow",
};

export default function ProfileJourneyPage() {
  return <ProfileJourney />;
}
