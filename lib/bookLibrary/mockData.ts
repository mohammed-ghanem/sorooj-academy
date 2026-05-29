


export type LibraryChapter = {
  id: string;
  numberAr: string;
  numberEn: string;
  titleAr: string;
  titleEn: string;
};

export type LibraryBook = {
  id: string;
  categoryId: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  coverSrc: string;
  descriptionAr: string;
  descriptionEn: string;
  chapters: LibraryChapter[];
};

export type LibraryCategory = {
  id: string;
  titleAr: string;
  titleEn: string;
};

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: "fiqh-sharia", titleAr: "فقه وشريعة", titleEn: "Fiqh & Sharia" },
  {
    id: "islamic-legal-laws",
    titleAr: "قوانين فقهية إسلامية",
    titleEn: "Islamic Legal Laws",
  },
  { id: "usool-fiqh", titleAr: "أصول فقه", titleEn: "Principles of Fiqh" },
  { id: "quran-sciences", titleAr: "علوم قرآن", titleEn: "Quranic Sciences" },
  { id: "seerah", titleAr: "السيرة النبوية", titleEn: "Prophetic Biography" },
];

const SAMPLE_DESCRIPTION_AR = `يقدّم هذا الكتاب قراءة منهجية لموضوع العلاقات الدولية في الفقه الإسلامي، مستعرضاً أهم المبادئ والقواعد التي نظّمها الفقهاء لعلاقة الدولة المسلمة بالدول الأخرى، مع إبراز الضوابط الشرعية في السلم والحرب والمعاهدات والتعاملات الدبلوماسية، بما يخدم الباحث والدارس في هذا المجال.`;

const SAMPLE_DESCRIPTION_EN = `This book offers a structured overview of international relations in Islamic jurisprudence, surveying key principles that classical scholars used to regulate relations between Muslim polities and other states—including rules on peace, war, treaties, and diplomacy—for researchers and students alike.`;

const SAMPLE_CHAPTERS: LibraryChapter[] = [
  {
    id: "ch-1",
    numberAr: "الفصل الأول",
    numberEn: "Chapter One",
    titleAr: "مدخل إلى العلاقات الدولية في الإسلام",
    titleEn: "Introduction to International Relations in Islam",
  },
  {
    id: "ch-2",
    numberAr: "الفصل الثاني",
    numberEn: "Chapter Two",
    titleAr: "السلم والحرب في الفقه الإسلامي",
    titleEn: "Peace and War in Islamic Jurisprudence",
  },
  {
    id: "ch-3",
    numberAr: "الفصل الثالث",
    numberEn: "Chapter Three",
    titleAr: "المعاهدات والمواثق الدولية",
    titleEn: "Treaties and International Covenants",
  },
  {
    id: "ch-4",
    numberAr: "الفصل الرابع",
    numberEn: "Chapter Four",
    titleAr: "الجهاد وأحكامه المعاصرة",
    titleEn: "Jihad and Its Contemporary Rulings",
  },
];

export const LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: "international-relations-fiqh",
    categoryId: "fiqh-sharia",
    titleAr: "العلاقات الدولية في الفقه الإسلامي",
    titleEn: "International Relations in Islamic Jurisprudence",
    authorAr: "الشيخ أ.د. محمد بن فهد الهاجري",
    authorEn: "Sheikh Prof. Muhammad bin Fahd Al-Hajri",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS,
  },
  {
    id: "islamic-legal-theory",
    categoryId: "islamic-legal-laws",
    titleAr: "النظام الفقهي في الشريعة الإسلامية",
    titleEn: "The Legal System in Islamic Sharia",
    authorAr: "د. عبد الله بن سعد الغامدي",
    authorEn: "Dr. Abdullah bin Saad Al-Ghamdi",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS.slice(0, 3),
  },
  {
    id: "usool-principles",
    categoryId: "usool-fiqh",
    titleAr: "مبادئ أصول الفقه المعاصرة",
    titleEn: "Principles of Contemporary Usul al-Fiqh",
    authorAr: "الشيخ أ.د. حمد بن محمد الهاجري",
    authorEn: "Sheikh Prof. Hamad bin Muhammad Al-Hajri",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS,
  },
  {
    id: "quran-sciences-intro",
    categoryId: "quran-sciences",
    titleAr: "مدخل إلى علوم القرآن",
    titleEn: "Introduction to Quranic Sciences",
    authorAr: "د. فهد بن عبد الرحمن السديس",
    authorEn: "Dr. Fahd bin Abdulrahman Al-Sudais",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS.slice(0, 2),
  },
  {
    id: "seerah-study",
    categoryId: "seerah",
    titleAr: "دراسات في السيرة النبوية",
    titleEn: "Studies in the Prophetic Biography",
    authorAr: "د. صالح بن عبد العزيز آل الشيخ",
    authorEn: "Dr. Salih bin Abdulaziz Al Ash-Sheikh",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS,
  },
  {
    id: "fiqh-worship",
    categoryId: "fiqh-sharia",
    titleAr: "فقه العبادات في المذهب الحنبلي",
    titleEn: "Worship Jurisprudence in the Hanbali School",
    authorAr: "الشيخ محمد بن صالح العثيمين",
    authorEn: "Sheikh Muhammad bin Salih Al-Uthaymin",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS.slice(0, 3),
  },
  {
    id: "legal-maxims",
    categoryId: "islamic-legal-laws",
    titleAr: "القواعد الفقهية الكبرى",
    titleEn: "Major Legal Maxims",
    authorAr: "ابن رجب الحنبلي",
    authorEn: "Ibn Rajab al-Hanbali",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS,
  },
  {
    id: "usool-methodology",
    categoryId: "usool-fiqh",
    titleAr: "منهجية الاستدلال في أصول الفقه",
    titleEn: "Methodology of Inference in Usul al-Fiqh",
    authorAr: "الشيخ أ.د. محمد بن فهد الهاجري",
    authorEn: "Sheikh Prof. Muhammad bin Fahd Al-Hajri",
    coverSrc: "/assets/images/holyQ.jpg",
    descriptionAr: SAMPLE_DESCRIPTION_AR,
    descriptionEn: SAMPLE_DESCRIPTION_EN,
    chapters: SAMPLE_CHAPTERS,
  },
];

export function getCategoryById(id: string) {
  return LIBRARY_CATEGORIES.find((c) => c.id === id);
}

export function getBookById(bookId: string) {
  return LIBRARY_BOOKS.find((b) => b.id === bookId);
}

export function getBooksByCategory(categoryId: string) {
  if (categoryId === "all") return LIBRARY_BOOKS;
  return LIBRARY_BOOKS.filter((b) => b.categoryId === categoryId);
}

export function localizedCategory(
  category: LibraryCategory,
  lang: string,
) {
  return lang === "en" ? category.titleEn : category.titleAr;
}

export function localizedBookField<
  K extends keyof Pick<
    LibraryBook,
    "titleAr" | "titleEn" | "authorAr" | "authorEn" | "descriptionAr" | "descriptionEn"
  >,
>(book: LibraryBook, lang: string, arKey: K, enKey: K): string {
  return lang === "en" ? (book[enKey] as string) : (book[arKey] as string);
}

export function localizedChapterField(
  chapter: LibraryChapter,
  lang: string,
  field: "number" | "title",
) {
  if (field === "number") {
    return lang === "en" ? chapter.numberEn : chapter.numberAr;
  }
  return lang === "en" ? chapter.titleEn : chapter.titleAr;
}
