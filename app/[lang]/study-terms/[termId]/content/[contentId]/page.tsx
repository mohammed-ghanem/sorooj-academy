import SubjectContent from "@/components/studyTerms/SubjectContent";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string; termId: string; contentId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentId } = await params;

  return {
    title: `محتوى المادة ${contentId} - اكاديمية سرج`,
    description: "تفاصيل محتوى المادة داخل المحور الدراسي",
    robots: "index, follow",
  };
}

export default function SubjectContentPage() {
  return <SubjectContent />;
}

