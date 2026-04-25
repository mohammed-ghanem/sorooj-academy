import type { StudyTopic } from "@/types/studyTopic";

/** Local placeholder until the API is wired. Replace with `getStudyTopicById` from services. */
export const studyTopics: StudyTopic[] = [
  {
    id: 1,
    title: "المحور الاول",
    progress: 100,
    materialsCount: 6,
    lessonsCount: 32,
    shortDescription:
      "يعنى بدراسة مسائل الإيمان وأصول الاعتقاد وفق المنهج الصحيح.",
    description:
      "يعنى هذا المحور بدراسة مسائل الإيمان وأصول الاعتقاد وفق المنهج الصحيح، مع بيان أهم القضايا التي يحتاجها طالب العلم في بداية مساره.",
  },
  {
    id: 2,
    title: "المحور الثانى",
    progress: 40,
    materialsCount: 6,
    lessonsCount: 32,
    shortDescription:
      "يعنى بدراسة مسائل الإيمان وأصول الاعتقاد وفق المنهج الصحيح.",
    description:
      "يتابع هذا المحور بناء الاعتقاد الصحيح وربطه بالدليل والأدلة الشرعية بأسلوب يسهل فهمه ومراجعته.",
  },
  {
    id: 3,
    title: "المحور الثالث",
    progress: 0,
    materialsCount: 6,
    lessonsCount: 32,
    shortDescription:
      "يعنى بدراسة مسائل الإيمان وأصول الاعتقاد وفق المنهج الصحيح.",
    description:
      "يُفتح عند إكمال المحاور السابقة. يتناول موضوعات أعمق في العقيدة والتطبيق العملي لها.",
  },
  {
    id: 4,
    title: "المحور الرابع",
    progress: 0,
    materialsCount: 6,
    lessonsCount: 32,
    shortDescription:
      "يعنى بدراسة مسائل الإيمان وأصول الاعتقاد وفق المنهج الصحيح.",
    description:
      "يُفتح عند إكمال المحاور السابقة. يلخص المسار ويربط بين المحاور في منظور واحد.",
  },
];

export function getStudyTopicById(id: number): StudyTopic | undefined {
  return studyTopics.find((t) => t.id === id);
}

export function isTopicLockedByIndex(
  items: { progress: number }[],
  index: number
): boolean {
  if (index === 0) return false;
  return items[index - 1].progress < 100;
}
