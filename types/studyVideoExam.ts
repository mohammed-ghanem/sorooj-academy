/** Option inside a video exam question. */
export type VideoExamOption = {
  id: number;
  text: string;
};

/** Single question in a video exam. */
export type VideoExamQuestion = {
  id: number;
  text: string;
  type: string;
  options: VideoExamOption[];
};

/** Video exam payload from GET `/lesson-videos/{id}/exam`. */
export type VideoExam = {
  id: number;
  title: string;
  questions: VideoExamQuestion[];
};

/** Answer row for POST submit-exam (sent as multipart form-data). */
export type VideoExamAnswerPayload = {
  examQuestionId: number;
  type: string;
  selectedOptionId?: number;
  /** 0 = false, 1 = true — used when `type` is `true_false`. */
  trueFalseAnswer?: number;
};

/** Result after POST submit-exam endpoints. */
export type VideoExamSubmitResult = {
  passed: boolean;
  /** Attempt submitted but essay answers still need admin grading. */
  pendingReview?: boolean;
  canRetake?: boolean;
  score?: number;
  message?: string;
  attemptStatus?: string | null;
  isPassed?: boolean | null;
};
