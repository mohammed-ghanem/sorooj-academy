/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import type {
  BookLibraryAttachment,
  BookLibraryBook,
  BookLibraryBookDetail,
  BookLibraryCategory,
} from "@/types/bookLibrary";

const CATEGORIES_PATH = "book-categories";
const BOOKS_PATH = "books";

function resolveAcceptLanguage(lang?: string): string {
  const fromArg =
    typeof lang === "string" && lang.trim() !== "" ? lang.trim() : "";
  return fromArg || Cookies.get("lang") || "ar";
}

function toNumericId(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function asNonEmptyString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

type CategoryApiPayload = {
  id?: number | string;
  name?: string;
  about_category?: string;
  books_count?: number | string;
  is_active?: number | boolean | string;
};

function mapCategory(raw: CategoryApiPayload): BookLibraryCategory | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  return {
    id,
    name: asNonEmptyString(raw.name) || "—",
    aboutCategory: asNonEmptyString(raw.about_category),
    booksCount: Math.max(0, Number(raw.books_count) || 0),
    isActive: asBoolean(raw.is_active),
  };
}

function extractCategoriesPayload(payload: unknown): CategoryApiPayload[] {
  const p = payload as any;
  const raw = p?.data?.Categories ?? p?.data?.categories;
  return Array.isArray(raw) ? (raw as CategoryApiPayload[]) : [];
}

type BookApiPayload = {
  id?: number | string;
  title?: string;
  image?: string;
  content?: string;
  category?: {
    id?: number | string;
    name?: string;
  };
  doctor?: {
    id?: number | string;
    name?: string;
  };
  attachments?: AttachmentApiPayload[];
};

type AttachmentApiPayload = {
  id?: number | string;
  name?: string;
  file_name?: string;
  url?: string;
};

function mapBook(raw: BookApiPayload): BookLibraryBook | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  return {
    id,
    title: asNonEmptyString(raw.title) || "—",
    image: asNonEmptyString(raw.image) || undefined,
    categoryId: toNumericId(raw.category?.id),
    categoryName: asNonEmptyString(raw.category?.name) || undefined,
    authorName: asNonEmptyString(raw.doctor?.name) || undefined,
  };
}

function extractBooksPayload(payload: unknown): BookApiPayload[] {
  const p = payload as any;
  const raw = p?.data?.Books ?? p?.data?.books;
  return Array.isArray(raw) ? (raw as BookApiPayload[]) : [];
}

function mapAttachment(raw: AttachmentApiPayload): BookLibraryAttachment | null {
  const id = toNumericId(raw.id);
  const url = asNonEmptyString(raw.url);
  if (id === undefined || !url) return null;

  const fileName = asNonEmptyString(raw.file_name) || asNonEmptyString(raw.name);
  return {
    id,
    name: asNonEmptyString(raw.name) || fileName || "—",
    fileName: fileName || "—",
    url,
  };
}

function mapBookDetail(raw: BookApiPayload): BookLibraryBookDetail | null {
  const book = mapBook(raw);
  if (!book) return null;

  return {
    ...book,
    content: typeof raw.content === "string" ? raw.content : "",
    attachments: (raw.attachments ?? [])
      .map(mapAttachment)
      .filter((item): item is BookLibraryAttachment => item !== null),
  };
}

function unwrapBookDetail(payload: unknown): BookApiPayload | null {
  const p = payload as any;
  const book = p?.data?.Book ?? p?.data?.book ?? p?.Book ?? p?.book;
  if (book && typeof book === "object") return book as BookApiPayload;
  return null;
}

export const bookLibraryApi = createApi({
  reducerPath: "bookLibraryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["BookLibraryCategories", "BookLibraryBooks"],
  endpoints: (builder) => ({
    /** GET `/book-categories` → active library sections. */
    getBookCategories: builder.query<BookLibraryCategory[], { lang: string }>({
      query: ({ lang }) => ({
        url: `/${CATEGORIES_PATH}`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): BookLibraryCategory[] => {
        return extractCategoriesPayload(response)
          .map(mapCategory)
          .filter((item): item is BookLibraryCategory => item !== null)
          .filter((item) => item.isActive);
      },
      providesTags: ["BookLibraryCategories"],
    }),

    /** GET `/books` → library books. */
    getBooks: builder.query<BookLibraryBook[], { lang: string }>({
      query: ({ lang }) => ({
        url: `/${BOOKS_PATH}`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): BookLibraryBook[] => {
        return extractBooksPayload(response)
          .map(mapBook)
          .filter((item): item is BookLibraryBook => item !== null);
      },
      providesTags: ["BookLibraryBooks"],
    }),

    /** GET `/books/{id}` → book details. */
    getBookDetail: builder.query<
      BookLibraryBookDetail,
      { bookId: string | number; lang: string }
    >({
      query: ({ bookId, lang }) => ({
        url: `/${BOOKS_PATH}/${bookId}`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown): BookLibraryBookDetail => {
        const raw = unwrapBookDetail(response);
        const mapped = raw ? mapBookDetail(raw) : null;
        if (!mapped) {
          throw new Error("Invalid book detail payload");
        }
        return mapped;
      },
      providesTags: (_result, _error, arg) => [
        { type: "BookLibraryBooks", id: String(arg.bookId) },
      ],
    }),
  }),
});

export const {
  useGetBookCategoriesQuery,
  useGetBooksQuery,
  useGetBookDetailQuery,
} = bookLibraryApi;
