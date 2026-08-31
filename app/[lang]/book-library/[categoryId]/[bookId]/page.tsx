import { Metadata } from "next";
import BookLibiraryDetails from "@/components/bookLibirary/BookLibiraryDetails";

type PageProps = {
  params: Promise<{ lang: string; categoryId: string; bookId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { bookId } = await params;

  return {
    title: `كتاب ${bookId} - المكتبة العلمية`,
    description:
      "تصفح تفاصيل الكتاب في المكتبة العلمية بأكاديمية سرج للدراسات والأبحاث الفكرية المعاصرة.",
    robots: "index, follow",
  };
}

export default async function BookLibraryBookPage({ params }: PageProps) {
  const { categoryId, bookId } = await params;
  return <BookLibiraryDetails categoryId={categoryId} bookId={bookId} />;
}
