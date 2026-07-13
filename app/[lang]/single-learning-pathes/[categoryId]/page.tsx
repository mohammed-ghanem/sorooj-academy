import ScientificTrackSubjects from "@/components/singleLearningPathes/ScientificTrackSubjects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المسارات العلمية المستقلة - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة",
  description: "مواد المسار العلمي المستقل",
  robots: "index, follow",
};

export default function ScientificTrackCategoryPage() {
  return <ScientificTrackSubjects />;
}
