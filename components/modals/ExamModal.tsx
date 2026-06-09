"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  buildExamAnswersPayload,
  countAnsweredQuestions,
  formatExamLabel,
  isQuestionAnswered,
  resolveQuestionOptions,
} from "@/components/modals/examModalUtils";
import {
  isArticleExamQuestion,
  type VideoExam,
  type VideoExamAnswerPayload,
} from "@/types/studyVideoExam";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Loader2,
  XCircle,
} from "lucide-react";

export type ExamModalLabels = {
  loading: string;
  noQuestions: string;
  trueAnswer: string;
  falseAnswer: string;
  questionOf: string;
  multipleChoice: string;
  trueFalseType: string;
  articleType: string;
  articlePlaceholder: string;
  previous: string;
  next: string;
  finish: string;
  confirmTitle: string;
  confirmDescription: string;
  totalQuestions: string;
  answeredQuestions: string;
  remainingQuestions: string;
  confirmSubmit: string;
  backToReview: string;
  passedTitle: string;
  failedTitle: string;
  failedDescription: string;
  pendingReviewTitle: string;
  pendingReviewDescription: string;
  retake: string;
  backToLesson: string;
  close: string;
  cancel: string;
};

export type ExamModalResult = {
  passed: boolean;
  pendingReview?: boolean;
  message?: string;
  score?: number;
};

type ExamModalPhase = "questions" | "confirm";

export type ExamModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam?: VideoExam | null;
  loading?: boolean;
  submitting?: boolean;
  result?: ExamModalResult | null;
  labels: ExamModalLabels;
  dir?: "rtl" | "ltr";
  onSubmit: (answers: VideoExamAnswerPayload[]) => void | Promise<void>;
  onRetake?: () => void | Promise<void>;
  onCloseResult?: () => void;
};

export default function ExamModal({
  open,
  onOpenChange,
  exam,
  loading = false,
  submitting = false,
  result = null,
  labels,
  dir = "rtl",
  onSubmit,
  onRetake,
  onCloseResult,
}: ExamModalProps) {
  const rtl = dir === "rtl";
  const [phase, setPhase] = useState<ExamModalPhase>("questions");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [articleAnswers, setArticleAnswers] = useState<Record<number, string>>(
    {},
  );

  const optionLabels = useMemo(
    () => ({
      trueAnswer: labels.trueAnswer,
      falseAnswer: labels.falseAnswer,
    }),
    [labels.falseAnswer, labels.trueAnswer],
  );

  const questions = exam?.questions ?? [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[activeIndex];
  const answeredCount = exam
    ? countAnsweredQuestions(
        exam,
        selectedAnswers,
        articleAnswers,
        optionLabels,
      )
    : 0;
  const remainingCount = Math.max(totalQuestions - answeredCount, 0);
  const progressPercent =
    totalQuestions > 0
      ? Math.round(((activeIndex + 1) / totalQuestions) * 100)
      : 0;

  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  useEffect(() => {
    if (!open) {
      setPhase("questions");
      setActiveIndex(0);
      setSelectedAnswers({});
      setArticleAnswers({});
    }
  }, [open]);

  useEffect(() => {
    if (!exam) return;
    setPhase("questions");
    setActiveIndex(0);
    setSelectedAnswers({});
    setArticleAnswers({});
  }, [exam?.id]);

  const handleSelectAnswer = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleArticleAnswerChange = (questionId: number, text: string) => {
    setArticleAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleConfirmSubmit = () => {
    if (!exam || submitting || result) return;
    const answers = buildExamAnswersPayload(
      exam,
      selectedAnswers,
      articleAnswers,
      optionLabels,
    );
    void Promise.resolve(onSubmit(answers));
  };

  const handleClose = () => {
    if (submitting) return;
    onOpenChange(false);
  };

  const showResult = Boolean(result);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (submitting) return;
        if (!next) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-3xl max-h-[92vh] flex flex-col bg-[#f6f6f6]",
          rtl ? "text-right" : "text-left",
          "**:data-[slot=dialog-close]:top-3 **:data-[slot=dialog-close]:right-3",
          "**:data-[slot=dialog-close]:rtl:right-auto **:data-[slot=dialog-close]:rtl:left-3",
        )}
        dir={dir}
        showCloseButton={!submitting && !showResult}
      >
        {loading ? (
          <>
            <DialogTitle className="sr-only">{labels.loading}</DialogTitle>
            <div className="flex min-h-64 items-center justify-center gap-2 px-6 py-16 text-sm descriptionColor">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              <span>{labels.loading}</span>
            </div>
          </>
        ) : showResult ? (
          <ExamResultView
            result={result!}
            labels={labels}
            rtl={rtl}
            onClose={() => {
              onCloseResult?.();
              onOpenChange(false);
            }}
            onRetake={() => {
              setPhase("questions");
              setActiveIndex(0);
              setSelectedAnswers({});
              void Promise.resolve(onRetake?.());
            }}
          />
        ) : phase === "confirm" ? (
          <ExamConfirmView
            examTitle={exam?.title}
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            remainingCount={remainingCount}
            labels={labels}
            rtl={rtl}
            submitting={submitting}
            onBack={() => setPhase("questions")}
            onConfirm={handleConfirmSubmit}
          />
        ) : !exam || totalQuestions === 0 ? (
          <>
            <DialogTitle className="sr-only">{labels.noQuestions}</DialogTitle>
            <div className="px-6 py-16 text-center text-sm descriptionColor">
              {labels.noQuestions}
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-[#efe7d8] bg-white px-5 py-4 sm:px-8">
              <DialogTitle
                className={cn(
                  "text-lg font-semibold mainColor sm:text-xl",
                  !exam.title?.trim() && "sr-only",
                )}
              >
                {exam.title?.trim() || labels.confirmTitle}
              </DialogTitle>

              <div className="mt-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="scoundColor font-semibold tabular-nums">
                  {progressPercent}%
                </span>
                <span className="descriptionColor">
                  {formatExamLabel(labels.questionOf, {
                    current: activeIndex + 1,
                    total: totalQuestions,
                  })}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ece7db]">
                <div
                  className="h-full scoundBgColor transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {questions.map((question, index) => {
                  const isActive = index === activeIndex;
                  const isAnswered = isQuestionAnswered(
                    question,
                    selectedAnswers,
                    articleAnswers,
                    optionLabels,
                  );

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                        isActive
                          ? "border-[#9F854E] scoundBgColor text-white"
                          : isAnswered
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-[#ece7db] bg-white text-gray-500 hover:border-[#9F854E]/40",
                      )}
                      aria-current={isActive ? "step" : undefined}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {currentQuestion ? (
              <ExamQuestionPanel
                question={currentQuestion}
                questionIndex={activeIndex}
                selectedOptionId={selectedAnswers[currentQuestion.id]}
                articleAnswer={articleAnswers[currentQuestion.id]}
                labels={labels}
                optionLabels={optionLabels}
                rtl={rtl}
                onSelect={(optionId) =>
                  handleSelectAnswer(currentQuestion.id, optionId)
                }
                onArticleChange={(text) =>
                  handleArticleAnswerChange(currentQuestion.id, text)
                }
              />
            ) : null}

            <div className="flex flex-col gap-3 border-t border-[#efe7d8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <Button
                type="button"
                variant="outline"
                className="order-2 border-gray-300 bg-white sm:order-1"
                disabled={activeIndex === 0}
                onClick={() =>
                  setActiveIndex((index) => Math.max(index - 1, 0))
                }
              >
                {rtl ? (
                  <ChevronRight className="h-4 w-4" aria-hidden />
                ) : (
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                )}
                <span className="ms-1">{labels.previous}</span>
              </Button>

              <div className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 bg-white"
                  onClick={handleClose}
                >
                  {labels.cancel}
                </Button>
                <Button
                  type="button"
                  className="bkMainColor text-white hover:opacity-90"
                  disabled={!allAnswered}
                  onClick={() => setPhase("confirm")}
                >
                  {labels.finish}
                </Button>
              </div>

              <Button
                type="button"
                className="order-3 scoundBgColor text-white hover:opacity-90"
                disabled={activeIndex >= totalQuestions - 1}
                onClick={() =>
                  setActiveIndex((index) =>
                    Math.min(index + 1, totalQuestions - 1),
                  )
                }
              >
                <span className="me-1">{labels.next}</span>
                {rtl ? (
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                ) : (
                  <ChevronRight className="h-4 w-4" aria-hidden />
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ExamQuestionPanel({
  question,
  questionIndex,
  selectedOptionId,
  articleAnswer,
  labels,
  optionLabels,
  rtl,
  onSelect,
  onArticleChange,
}: {
  question: VideoExam["questions"][number];
  questionIndex: number;
  selectedOptionId?: number;
  articleAnswer?: string;
  labels: ExamModalLabels;
  optionLabels: { trueAnswer: string; falseAnswer: string };
  rtl: boolean;
  onSelect: (optionId: number) => void;
  onArticleChange: (text: string) => void;
}) {
  const options = resolveQuestionOptions(question, optionLabels);
  const isArticle = isArticleExamQuestion(question.type);
  const isTrueFalse = question.type === "true_false";
  const typeLabel = isArticle
    ? labels.articleType
    : isTrueFalse
      ? labels.trueFalseType
      : labels.multipleChoice;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-5 shadow-r-sm sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="text-4xl font-light leading-none text-[#ece7db] tabular-nums">
            .{String(questionIndex + 1).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-[#faf7f1] px-3 py-1 text-xs font-medium scoundColor">
            {typeLabel}
          </span>
        </div>

        <p className="mb-6 text-center text-lg font-semibold leading-relaxed mainColor sm:text-xl">
          {question.text}
        </p>

        {isArticle ? (
          <Textarea
            value={articleAnswer ?? ""}
            onChange={(event) => onArticleChange(event.target.value)}
            placeholder={labels.articlePlaceholder}
            dir={rtl ? "rtl" : "ltr"}
            className={cn(
              "min-h-[160px] resize-y border-[#ece7db] bg-white text-base leading-relaxed focus-visible:ring-[#9F854E]",
              rtl ? "text-right" : "text-left",
            )}
          />
        ) : options.length === 0 ? (
          <p className="text-center text-sm descriptionColor">
            {labels.noQuestions}
          </p>
        ) : isTrueFalse ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map((option) => {
              const selected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelect(option.id)}
                  className={cn(
                    "rounded-xl border px-4 py-5 text-base font-semibold transition-colors",
                    selected
                      ? "border-[#9F854E] scoundBgColor text-white"
                      : "border-[#ece7db] bg-white text-gray-700 hover:border-[#9F854E]/40",
                  )}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {options.map((option) => {
              const selected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelect(option.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition-colors",
                    selected
                      ? "border-[#9F854E] bg-[#faf7f1]"
                      : "border-[#ece7db] bg-white hover:border-[#9F854E]/30",
                    rtl ? "flex-row-reverse text-right" : "text-left",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      selected
                        ? "border-[#9F854E] bg-[#9F854E]"
                        : "border-[#d8d2c4] bg-white",
                    )}
                    aria-hidden
                  >
                    {selected ? (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <span className="leading-relaxed descriptionColor">
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ExamConfirmView({
  examTitle,
  totalQuestions,
  answeredCount,
  remainingCount,
  labels,
  rtl,
  submitting,
  onBack,
  onConfirm,
}: {
  examTitle?: string;
  totalQuestions: number;
  answeredCount: number;
  remainingCount: number;
  labels: ExamModalLabels;
  rtl: boolean;
  submitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-lg text-center">
        {examTitle ? (
          <p className="mb-2 text-sm descriptionColor">{examTitle}</p>
        ) : null}
        <DialogTitle className="text-xl font-semibold mainColor sm:text-2xl">
          {labels.confirmTitle}
        </DialogTitle>
        <DialogDescription className="mt-3 text-sm leading-relaxed descriptionColor">
          {labels.confirmDescription}
        </DialogDescription>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#efe7d8] bg-[#faf7f1]/70 text-sm">
          <SummaryRow
            label={labels.totalQuestions}
            value={totalQuestions}
            rtl={rtl}
          />
          <SummaryRow
            label={labels.answeredQuestions}
            value={answeredCount}
            rtl={rtl}
          />
          <SummaryRow
            label={labels.remainingQuestions}
            value={remainingCount}
            rtl={rtl}
            last
          />
        </div>

        <div
          className={cn(
            "mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center",
            rtl ? "sm:flex-row-reverse" : "",
          )}
        >
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 bg-white"
            disabled={submitting}
            onClick={onBack}
          >
            {labels.backToReview}
          </Button>
          <Button
            type="button"
            className="bkMainColor text-white hover:opacity-90"
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>{labels.confirmSubmit}</span>
              </span>
            ) : (
              labels.confirmSubmit
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  rtl,
  last = false,
}: {
  label: string;
  value: number;
  rtl: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3",
        !last && "border-b border-[#efe7d8]",
        rtl ? "flex-row-reverse" : "",
      )}
    >
      <span className="descriptionColor">{label}</span>
      <span className="font-semibold mainColor tabular-nums">{value}</span>
    </div>
  );
}

/** Hide submission-success messages on the failure screen. */
function resolveFailureDescription(
  message: string | undefined,
  fallback: string,
): string {
  const trimmed = message?.trim();
  if (!trimmed) return fallback;

  const isSubmissionAcknowledgement =
    /تم تسليم|تسليم .* بنجاح|submitted successfully|submission successful/i.test(
      trimmed,
    );

  return isSubmissionAcknowledgement ? fallback : trimmed;
}

function resolveDisplayScore(score?: number): number | null {
  if (score === undefined || score === null || Number.isNaN(score)) {
    return null;
  }
  return Math.round(score);
}

function ExamResultScoreCircle({
  score,
  variant,
}: {
  score: number;
  variant: "passed" | "failed";
}) {
  const isPassed = variant === "passed";

  return (
    <div
      className={cn(
        "mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4",
        isPassed
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50",
      )}
    >
      <span
        className={cn(
          "text-3xl font-bold tabular-nums",
          isPassed ? "text-emerald-600" : "text-red-600",
        )}
      >
        {Math.round(score)}%
      </span>
    </div>
  );
}

function ExamResultView({
  result,
  labels,
  rtl,
  onClose,
  onRetake,
}: {
  result: ExamModalResult;
  labels: ExamModalLabels;
  rtl: boolean;
  onClose: () => void;
  onRetake: () => void;
}) {
  if (result.pendingReview) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#ece7db] bg-[#faf7f1]">
          <Clock3
            className="h-10 w-10 scoundColor"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
        <DialogTitle className="text-xl font-semibold mainColor sm:text-2xl">
          {labels.pendingReviewTitle}
        </DialogTitle>
        <DialogDescription className="mt-3 max-w-md text-sm leading-relaxed descriptionColor">
          {result.message?.trim() || labels.pendingReviewDescription}
        </DialogDescription>
        <Button
          type="button"
          className="mt-8 scoundBgColor px-8 text-white hover:opacity-90"
          onClick={onClose}
        >
          {labels.close}
        </Button>
      </div>
    );
  }

  const displayScore = resolveDisplayScore(result.score);

  if (result.passed) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
        {displayScore !== null ? (
          <ExamResultScoreCircle score={displayScore} variant="passed" />
        ) : (
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf7f1]">
            <CircleCheck
              className="h-10 w-10 scoundColor"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
        )}
        <DialogTitle className="text-xl font-semibold text-emerald-700 sm:text-2xl">
          {labels.passedTitle}
        </DialogTitle>
        {result.message &&
        result.message.trim() !== labels.passedTitle.trim() ? (
          <DialogDescription className="mt-3 max-w-md text-sm leading-relaxed descriptionColor">
            {result.message}
          </DialogDescription>
        ) : null}
        <Button
          type="button"
          className="mt-8 scoundBgColor px-8 text-white hover:opacity-90"
          onClick={onClose}
        >
          {labels.close}
        </Button>
      </div>
    );
  }

  const failureDescription = resolveFailureDescription(
    result.message,
    labels.failedDescription,
  );

  return (
    <div className="flex flex-col items-center px-6 py-10 text-center sm:py-14">
      {displayScore !== null ? (
        <ExamResultScoreCircle score={displayScore} variant="failed" />
      ) : (
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-red-200 bg-red-50">
          <XCircle
            className="h-14 w-14 fill-red-600 text-white"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      )}
      <DialogTitle className="max-w-md text-xl font-semibold mainColor sm:text-2xl">
        {labels.failedTitle}
      </DialogTitle>
      <DialogDescription className="mt-3 max-w-lg text-sm leading-relaxed descriptionColor">
        {failureDescription}
      </DialogDescription>

      <div
        className={cn(
          "mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center",
          rtl ? "sm:flex-row-reverse" : "",
        )}
      >
        <Button
          type="button"
          variant="outline"
          className="border-gray-300 bg-white"
          onClick={onClose}
        >
          {labels.backToLesson}
        </Button>
        <Button
          type="button"
          className="bkMainColor text-white hover:opacity-90"
          onClick={onRetake}
        >
          {labels.retake}
        </Button>
      </div>
    </div>
  );
}
