/** Book category — maps GET `/book-categories` → `data.Categories[]`. */
export type BookLibraryCategory = {
  id: number;
  name: string;
  aboutCategory: string;
  booksCount: number;
  isActive: boolean;
};

/** Book row — maps GET `/books` → `data.Books[]`. */
export type BookLibraryBook = {
  id: number;
  title: string;
  image?: string;
  categoryId?: number;
  categoryName?: string;
  authorName?: string;
};

export type BookLibraryAttachment = {
  id: number;
  name: string;
  fileName: string;
  url: string;
};

/** Book detail — maps GET `/books/{id}` → `data.Book`. */
export type BookLibraryBookDetail = BookLibraryBook & {
  content: string;
  attachments: BookLibraryAttachment[];
};
