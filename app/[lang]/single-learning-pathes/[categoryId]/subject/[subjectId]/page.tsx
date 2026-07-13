import ScientificTrackSubjectContent from "@/components/singleLearningPathes/ScientificTrackSubjectContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string; categoryId: string; subjectId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectId } = await params;
  return {
    title: `مادة ${subjectId} - المسارات العلمية المستقلة - اكاديمية سرج`,
    description: "دروس المادة في المسارات العلمية المستقلة",
    robots: "index, follow",
  };
}

export default function ScientificTrackSubjectPage() {
  return <ScientificTrackSubjectContent />;
}
