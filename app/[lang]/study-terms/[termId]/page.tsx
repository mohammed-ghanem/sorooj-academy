import SingleTerm from "@/components/studyTerms/SingleTerm";
import { Metadata } from "next";

type Props = { params: Promise<{ lang: string; termId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { termId } = await params;
  return {
    title: `المستوى ${termId} - اكاديمية سرج للدرسات والابحاث الفكرية المعاصرة`,
    description: "تفاصيل المستوى الدراسي",
    robots: "index, follow",
  };
}

export default function StudyTermDetailPage() {
  return <SingleTerm />;
}
