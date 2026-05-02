import SingleLessonContent from "@/components/studyTerms/SingleLessonContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    lang: string;
    termId: string;
    contentId: string;
    lessonId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  return {
    title: `الدرس ${lessonId} - اكاديمية سرج`,
    description: "صفحة عرض الدرس مع قائمة فيديوهات",
    robots: "index, follow",
  };
}

export default function LessonContentPage() {
  return <SingleLessonContent />;
}

