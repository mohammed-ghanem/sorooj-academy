/** Static placeholders until faculty API is connected. */
export type FacultyMemberPlaceholder = {
  imageSrc: string;
  department: { ar: string; en: string };
  name: { ar: string; en: string };
  title: { ar: string; en: string };
  description: { ar: string; en: string };
};

export const FACULTY_PLACEHOLDERS: FacultyMemberPlaceholder[] = [
  {
    imageSrc: "/assets/images/dd.png",
    department: { ar: "الدراسات الإسلامية", en: "Islamic Studies" },
    name: { ar: "الشيخ حمد الهاجري", en: "Sheikh Hamad Al-Hajri" },
    title: {
      ar: "أستاذ الفقه المقارن والسياسة الشرعية -  كلية الشريعة (جامعة الكويت)",
      en: "Professor of Comparative Law and Islamic Jurisprudence - Faculty of Law (Kuwait University)",
    },
    description: {
      ar: "متخصص في علوم الفقه والسياسة الشرعية، وله إسهامات علمية في التدريس الجامعي والبحث العلمي، وشارك في عدد من البرامج العلمية والدورات الشرعية داخل المملكة وخارجها.",
      en: "Specialized in jurisprudence and Sharia policy, with scholarly contributions to university teaching and research, and participation in academic programs and Sharia courses inside and outside the Kingdom.",
    },
  },
  // {
  //   imageSrc: "/assets/images/dd.png",
  //   department: { ar: "إدارة الأعمال", en: "Business Administration" },
  //   name: { ar: "السيد عبد الرحمن الدوسري", en: "Mr. Abdul Rahman Al-Dosari" },
  //   title: {
  //     ar: "الأستاذ الدكتور بجامعة الكويت",
  //     en: "Professor at Kuwait University",
  //   },
  //   description: {
  //     ar: "يُعنى ببحوث إدارة الأعمال وتطبيقاتها في البيئة الأكاديمية، وله خبرة في الإشراف على المشاريع البحثية والمناهج التعليمية في الجامعة.",
  //     en: "Focuses on business administration research and its academic applications, with experience supervising research projects and curricula at the university.",
  //   },
  // },
  // {
  //   imageSrc: "/assets/images/dd.png",
  //   department: { ar: "الدراسات الإسلامية", en: "Islamic Studies" },
  //   name: { ar: "الدكتور فهد اليوسف", en: "Dr. Fahd Al-Yousef" },
  //   title: {
  //     ar: "أستاذ مشارك بجامعة الملك عبد العزيز",
  //     en: "Associate Professor at King Abdulaziz University",
  //   },
  //   description: {
  //     ar: "مهتم بالدراسات الإسلامية والمنهج العلمي في عرض المسائل المعاصرة، وشارك في مؤتمرات ولجان علمية داخل المملكة.",
  //     en: "Interested in Islamic studies and scholarly methodology in addressing contemporary issues, and has participated in conferences and academic committees within the Kingdom.",
  //   },
  // },
  // {
  //   imageSrc: "/assets/images/dd.png",
  //   department: { ar: "العقيدة والأدلة", en: "Creed and Evidence" },
  //   name: { ar: "الشيخ سعود العتيبي", en: "Sheikh Saud Al-Otaibi" },
  //   title: {
  //     ar: "أستاذ مساعد بجامعة الملك سعود",
  //     en: "Assistant Professor at King Saud University",
  //   },
  // },
];
