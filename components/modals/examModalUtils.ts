import {
  isArticleExamQuestion,
  type VideoExam,
  type VideoExamAnswerPayload,
  type VideoExamOption,
  type VideoExamQuestion,
} from "@/types/studyVideoExam";

export function formatExamLabel(
  template: string,
  vars: Record<string, string | number>,
) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replace(`{{${key}}}`, String(value)),
    template,
  );
}

/** true_false questions may arrive with an empty options array from the API. */
export function resolveQuestionOptions(
  question: VideoExamQuestion,
  labels: { trueAnswer: string; falseAnswer: string },
): VideoExamOption[] {
  if (question.options.length > 0) return question.options;

  if (question.type === "true_false") {
    return [
      { id: 1, text: labels.trueAnswer },
      { id: 0, text: labels.falseAnswer },
    ];
  }

  return [];
}

export function isQuestionAnswered(
  question: VideoExamQuestion,
  selectedAnswers: Record<number, number>,
  articleAnswers: Record<number, string>,
  labels: { trueAnswer: string; falseAnswer: string },
): boolean {
  if (isArticleExamQuestion(question.type)) {
    return Boolean(articleAnswers[question.id]?.trim());
  }

  const options = resolveQuestionOptions(question, labels);
  return options.length > 0 && selectedAnswers[question.id] !== undefined;
}

export function buildExamAnswersPayload(
  exam: VideoExam,
  selectedAnswers: Record<number, number>,
  articleAnswers: Record<number, string>,
  labels: { trueAnswer: string; falseAnswer: string },
): VideoExamAnswerPayload[] {
  return exam.questions.map((question) => {
    if (isArticleExamQuestion(question.type)) {
      return {
        examQuestionId: question.id,
        type: question.type,
        articleAnswer: articleAnswers[question.id]?.trim() ?? "",
      };
    }

    const selected = selectedAnswers[question.id];

    if (question.type === "true_false") {
      return {
        examQuestionId: question.id,
        type: question.type,
        trueFalseAnswer: selected,
      };
    }

    return {
      examQuestionId: question.id,
      type: question.type,
      selectedOptionId: selected,
    };
  });
}

export function countAnsweredQuestions(
  exam: VideoExam,
  selectedAnswers: Record<number, number>,
  articleAnswers: Record<number, string>,
  labels: { trueAnswer: string; falseAnswer: string },
) {
  return exam.questions.filter((question) =>
    isQuestionAnswered(question, selectedAnswers, articleAnswers, labels),
  ).length;
}
