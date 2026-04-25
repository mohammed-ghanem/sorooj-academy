import TopicContent from "@/components/studyTopics/TopicContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string; topicId: string; contentId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentId } = await params;

  return {
    title: `محتوى المادة ${contentId} - اكاديمية سرج`,
    description: "تفاصيل محتوى المادة داخل المحور الدراسي",
    robots: "index, follow",
  };
}

export default function TopicContentPage() {
  return <TopicContent />;
}

