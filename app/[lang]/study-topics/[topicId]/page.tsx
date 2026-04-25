import SingleTopic from "@/components/studyTopics/SingleTopic";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: string; topicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId } = await params;
  return {
    title: `المحور ${topicId} - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة`,
    description: "تفاصيل المحور الدراسي",
    robots: "index, follow",
  };
}

export default function StudyTopicDetailPage() {
  return <SingleTopic />;
}
