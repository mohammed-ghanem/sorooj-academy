import { Metadata } from "next";
import BookLibiraryDetails from "@/components/bookLibirary/BookLibiraryDetails";
import { getBookById } from "@/lib/bookLibrary/mockData";

type PageProps = {
  params: Promise<{ lang: string; categoryId: string; bookId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { bookId } = await params;
  const book = getBookById(bookId);

  const title = book
    ? `${book.titleAr} - المكتبة العلمية`
    : "المكتبة العلمية - أكاديمية سرج";

  return {
    title,
    description: book?.descriptionAr?.slice(0, 160),
    robots: "index, follow",
  };
}

export default async function BookLibraryBookPage({ params }: PageProps) {
  const { categoryId, bookId } = await params;
  return (
    <BookLibiraryDetails categoryId={categoryId} bookId={bookId} />
  );
}
