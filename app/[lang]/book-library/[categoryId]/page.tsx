import { Metadata } from "next";
import BookLibiraryCards from "@/components/bookLibirary/BookLibiraryCards";
import { getCategoryById } from "@/lib/bookLibrary/mockData";

type PageProps = {
  params: Promise<{ lang: string; categoryId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = getCategoryById(categoryId);

  const title = category
    ? `${category.titleAr} - المكتبة العلمية`
    : "المكتبة العلمية - أكاديمية سرج";

  return {
    title,
    description:
      "تصفح الكتب العلمية في أكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة.",
    robots: "index, follow",
  };
}

export default async function BookLibraryCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  return <BookLibiraryCards categoryId={categoryId} />;
}
