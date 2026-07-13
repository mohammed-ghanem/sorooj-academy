import SingleLessonContent from "@/components/studyTerms/SingleLessonContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    lang: string;
    categoryId: string;
    subjectId: string;
    lessonId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  return {
    title: `الدرس ${lessonId} - المسارات العلمية المستقلة - اكاديمية سرج`,
    description: "صفحة عرض الدرس مع قائمة فيديوهات",
    robots: "index, follow",
  };
}

export default function ScientificTrackLessonPage() {
  return <SingleLessonContent />;
}
