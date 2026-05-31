/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { axiosBaseQuery } from "@/store/base/axiosBaseQuery";
import {
  extractLessonExamAttempt,
  resolveLessonExamUiState,
} from "@/lib/studyLesson/lessonExamState";
import type {
  StudyLessonAttachment,
  StudyLessonDetail,
  StudyLessonVideo,
  StudyLessonVideosProgress,
} from "@/types/studyLessonDetail";
import type {
  VideoExam,
  VideoExamAnswerPayload,
  VideoExamOption,
  VideoExamQuestion,
  VideoExamSubmitResult,
} from "@/types/studyVideoExam";

const BASE_PATH = "lessons";
const VIDEO_BASE_PATH = "lesson-videos";

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

type DoctorApiPayload = {
  id?: number | string;
  name?: string;
  avatar?: string;
  image?: string;
  photo?: string;
  profile_image?: string;
  cover?: string;
  image_url?: string;
  photo_url?: string;
};

const DefaultDoctorAvatar = "/assets/images/doctor.svg";

function resolveDoctorImage(doctor?: DoctorApiPayload): string {
  if (!doctor || typeof doctor !== "object") return DefaultDoctorAvatar;

  const candidates = [
    doctor.avatar,
    doctor.image,
    doctor.photo,
    doctor.profile_image,
    doctor.cover,
    doctor.image_url,
    doctor.photo_url,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return DefaultDoctorAvatar;
}

type SubjectRefApiPayload = {
  id?: number | string;
  name?: string;
};

type VideoApiPayload = {
  id?: number | string;
  title?: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  video_title?: string;
  video_number?: string;
  youtube_id?: string;
  youtubeId?: string;
  youtube?: string;
  youtube_url?: string;
  youtube_link?: string;
  video_id?: string;
  video_url?: string;
  url?: string;
  link?: string;
  video_link?: string;
  video_path?: string;
  path?: string;
  file?: string;
  source?: string;
  external_url?: string;
  embed_url?: string;
  embedUrl?: string;
  embed_code?: string;
  content?: string;
  link_video?: string;
  file_url?: string;
  original_url?: string;
  media?: {
    url?: string;
    file?: string;
    original_url?: string;
  };
  duration?: string;
  duration_formatted?: string;
  video_duration?: string;
  brief_content?: string;
  description?: string;
  order_index?: number;
  is_watch_completed?: boolean;
  is_completed?: boolean;
  is_locked?: boolean;
  can_access_video?: boolean;
  has_active_video_exam?: boolean;
  student_has_passed_video_exam?: boolean;
  can_access_video_exam?: boolean;
  [key: string]: unknown;
};

type AttachmentApiPayload = {
  id?: number | string;
  title?: string;
  name?: string;
  file?: string;
  url?: string;
  file_url?: string;
  download_url?: string;
};

export type LessonDetailApiPayload = {
  id?: number | string;
  lesson_number?: string;
  title?: string;
  content?: string;
  brief_content?: string;
  subject?: SubjectRefApiPayload;
  doctor?: DoctorApiPayload;
  order_index?: number;
  is_active?: number | boolean;
  videos_count?: number;
  attachments_count?: number;
  is_watch_completed?: boolean;
  has_active_lesson_exam?: boolean;
  can_access_lesson_exam?: boolean;
  can_retake_lesson_exam?: boolean | number;
  lesson_exam_status?: string;
  student_lesson_exam_status?: string;
  lesson_exam_is_passed?: boolean | null;
  student_lesson_exam_is_passed?: boolean | null;
  is_lesson_exam_under_review?: boolean | number;
  all_videos_completed?: boolean;
  student_has_passed_lesson_exam?: boolean;
  videos_progress?: {
    completed?: number;
    total?: number;
    percentage?: number;
  };
  videos?: VideoApiPayload[];
  Videos?: VideoApiPayload[];
  attachments?: AttachmentApiPayload[];
  Attachments?: AttachmentApiPayload[];
};

function unwrapLessonPayload(response: unknown): LessonDetailApiPayload | null {
  if (!response || typeof response !== "object") return null;

  const r = response as Record<string, unknown>;
  const direct = r.lesson ?? r.Lesson;
  if (direct && typeof direct === "object") {
    return direct as LessonDetailApiPayload;
  }

  const data = r.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const nested = data as Record<string, unknown>;
    const lesson = nested.lesson ?? nested.Lesson;
    if (lesson && typeof lesson === "object") {
      return lesson as LessonDetailApiPayload;
    }
  }

  return null;
}

function parseYoutubeIdFromValue(value: string): string {
  let trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) trimmed = `https:${trimmed}`;

  const bare = trimmed.split("?")[0].split("#")[0];
  if (/^[\w-]{11}$/.test(bare)) return bare;

  const patterns = [
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/v\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return "";
}

function extractYoutubeFromHtml(html: string): string {
  if (!html.trim()) return "";
  const iframeMatch = html.match(/src=["']([^"']+)["']/i);
  if (iframeMatch?.[1]) {
    const id = parseYoutubeIdFromValue(iframeMatch[1]);
    if (id) return id;
  }
  const idMatch = html.match(
    /(?:youtube\.com\/embed\/|youtu\.be\/|watch\?v=)([\w-]{11})/,
  );
  return idMatch?.[1] ?? "";
}

function collectStringsFromObject(obj: unknown, depth = 0): string[] {
  if (depth > 4 || obj == null) return [];
  if (typeof obj === "string") return [obj];
  if (typeof obj !== "object") return [];

  const out: string[] = [];
  for (const value of Object.values(obj as Record<string, unknown>)) {
    if (typeof value === "string") out.push(value);
    else if (value && typeof value === "object") {
      out.push(...collectStringsFromObject(value, depth + 1));
    }
  }
  return out;
}

function resolveYoutubeId(raw: VideoApiPayload): string {
  const nested = raw.video ?? raw.Video;
  if (typeof nested === "string" && nested.trim()) {
    const id = parseYoutubeIdFromValue(nested);
    if (id) return id;
  }
  if (nested && typeof nested === "object") {
    const fromNested = resolveYoutubeId(nested as VideoApiPayload);
    if (fromNested) return fromNested;
  }

  const candidates = [
    raw.youtube_id,
    raw.youtubeId,
    raw.youtube,
    raw.youtube_url,
    raw.youtube_link,
    raw.video_id,
    raw.video_url,
    raw.url,
    raw.link,
    raw.video_link,
    raw.video_path,
    raw.path,
    raw.file,
    raw.source,
    raw.external_url,
    raw.embed_url,
    raw.embedUrl,
    raw.link_video,
    raw.file_url,
    raw.original_url,
    raw.media?.url,
    raw.media?.file,
    raw.media?.original_url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      const id = parseYoutubeIdFromValue(candidate);
      if (id) return id;
    }
  }

  if (typeof raw.embed_code === "string" && raw.embed_code.trim()) {
    const id = extractYoutubeFromHtml(raw.embed_code);
    if (id) return id;
  }
  if (typeof raw.content === "string" && raw.content.trim()) {
    const id = extractYoutubeFromHtml(raw.content);
    if (id) return id;
  }

  for (const str of collectStringsFromObject(raw)) {
    if (!/youtube|youtu\.be/i.test(str)) continue;
    const id = parseYoutubeIdFromValue(str);
    if (id) return id;
  }

  return "";
}

function resolveEmbedUrl(
  raw: VideoApiPayload,
  youtubeId: string,
): string | undefined {
  const direct = [raw.embed_url, raw.embedUrl].find(
    (v) => typeof v === "string" && v.trim(),
  );
  if (typeof direct === "string") return direct.trim();

  if (typeof raw.content === "string" && raw.content.includes("<iframe")) {
    const match = raw.content.match(/src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
  }
  if (
    typeof raw.embed_code === "string" &&
    raw.embed_code.includes("<iframe")
  ) {
    const match = raw.embed_code.match(/src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
  }

  if (youtubeId) return undefined;
  return undefined;
}

function resolveStreamUrl(
  raw: VideoApiPayload,
  youtubeId: string,
  embedUrl?: string,
): string | undefined {
  if (youtubeId || embedUrl) return undefined;

  const nested = raw.video ?? raw.Video;
  const candidates = [
    typeof nested === "string" ? nested : undefined,
    raw.video_url,
    raw.url,
    raw.link,
    raw.video_link,
    raw.video_path,
    raw.path,
    raw.file,
    raw.source,
    raw.external_url,
    raw.link_video,
    raw.file_url,
    raw.original_url,
    raw.media?.url,
    raw.media?.file,
    raw.media?.original_url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;
    const value = candidate.trim();
    if (/youtube|youtu\.be/i.test(value)) continue;
    if (
      value.startsWith("http") ||
      value.startsWith("/storage/") ||
      /\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(value)
    ) {
      return value.startsWith("/")
        ? `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${value}`
        : value;
    }
  }

  return undefined;
}

function normalizeVideoRow(item: unknown): VideoApiPayload | null {
  if (!item || typeof item !== "object") return null;
  const rec = item as Record<string, unknown>;
  const inner = rec.Video ?? rec.video;
  if (inner && typeof inner === "object") {
    return inner as VideoApiPayload;
  }
  if (typeof inner === "string") {
    return { ...rec, video_url: inner } as VideoApiPayload;
  }
  return rec as VideoApiPayload;
}

function resolveDuration(raw: VideoApiPayload): string {
  const value =
    raw.duration_formatted ?? raw.duration ?? raw.video_duration ?? "";
  return typeof value === "string" ? value.trim() : "";
}

function mapVideo(raw: VideoApiPayload): StudyLessonVideo | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  const title =
    (typeof raw.title === "string" && raw.title.trim()) ||
    (typeof raw.video_title === "string" && raw.video_title.trim()) ||
    (typeof raw.video_number === "string" && raw.video_number.trim()) ||
    (typeof raw.name === "string" && raw.name.trim()) ||
    (typeof raw.name_ar === "string" && raw.name_ar.trim()) ||
    (typeof raw.name_en === "string" && raw.name_en.trim()) ||
    "";
  const briefContent =
    typeof raw.brief_content === "string"
      ? raw.brief_content.trim()
      : typeof raw.description === "string"
        ? raw.description.trim()
        : "";

  const youtubeId = resolveYoutubeId(raw);
  const embedUrl = resolveEmbedUrl(raw, youtubeId);
  const streamUrl = resolveStreamUrl(raw, youtubeId, embedUrl);

  return {
    id,
    title,
    youtubeId,
    embedUrl,
    streamUrl,
    duration: resolveDuration(raw),
    briefContent: briefContent || undefined,
    isWatchCompleted: raw.is_watch_completed === true,
    isCompleted: raw.is_completed === true,
    isLocked: raw.is_locked === true,
    canAccessVideo: raw.can_access_video !== false,
    hasActiveVideoExam: raw.has_active_video_exam === true,
    studentHasPassedVideoExam: raw.student_has_passed_video_exam === true,
    canAccessVideoExam: raw.can_access_video_exam === true,
    orderIndex: Number(raw.order_index) || 0,
  };
}

function mapAttachment(
  raw: AttachmentApiPayload,
): StudyLessonAttachment | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;

  const title =
    (typeof raw.title === "string" && raw.title.trim()) ||
    (typeof raw.name === "string" && raw.name.trim()) ||
    "";
  if (!title) return null;

  const url =
    (typeof raw.url === "string" && raw.url.trim()) ||
    (typeof raw.file === "string" && raw.file.trim()) ||
    (typeof raw.file_url === "string" && raw.file_url.trim()) ||
    (typeof raw.download_url === "string" && raw.download_url.trim()) ||
    undefined;

  return { id, title, url };
}

function sortVideos(list: StudyLessonVideo[]): StudyLessonVideo[] {
  return [...list].sort((a, b) => {
    if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
    return a.id - b.id;
  });
}

function unwrapVideos(raw: LessonDetailApiPayload): VideoApiPayload[] {
  const list = Array.isArray(raw.videos)
    ? raw.videos
    : Array.isArray(raw.Videos)
      ? raw.Videos
      : [];
  return list
    .map((item) => normalizeVideoRow(item))
    .filter((item): item is VideoApiPayload => item !== null);
}

function unwrapAttachments(
  raw: LessonDetailApiPayload,
): AttachmentApiPayload[] {
  if (Array.isArray(raw.attachments)) return raw.attachments;
  if (Array.isArray(raw.Attachments)) return raw.Attachments;
  return [];
}

function mapPayloadToStudyLessonDetail(
  raw: LessonDetailApiPayload,
  lang: string,
  fullResponse?: unknown,
): StudyLessonDetail {
  const id = toNumericId(raw.id) ?? 0;
  const lessonNumber =
    typeof raw.lesson_number === "string" ? raw.lesson_number.trim() : "";
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const content = typeof raw.content === "string" ? raw.content.trim() : "";
  const briefContent =
    typeof raw.brief_content === "string" ? raw.brief_content.trim() : "";

  const videos = sortVideos(
    unwrapVideos(raw)
      .map((item) => mapVideo(item))
      .filter((v): v is StudyLessonVideo => v !== null),
  );

  const attachments = unwrapAttachments(raw)
    .map((item) => mapAttachment(item))
    .filter((a): a is StudyLessonAttachment => a !== null);

  const doctorName =
    raw.doctor && typeof raw.doctor.name === "string"
      ? raw.doctor.name.trim()
      : undefined;
  const doctorImage = raw.doctor ? resolveDoctorImage(raw.doctor) : undefined;

  const displayTitle =
    title || lessonNumber || (lang === "ar" ? "الدرس" : "Lesson");

  const completedCount = videos.filter((v) => v.isCompleted).length;
  const progressRaw = raw.videos_progress;
  const videosProgress: StudyLessonVideosProgress = {
    completed: Number(progressRaw?.completed) || completedCount,
    total: Number(progressRaw?.total) || videos.length,
    percentage:
      progressRaw?.percentage !== undefined && progressRaw?.percentage !== null
        ? Number(progressRaw.percentage)
        : videos.length > 0
          ? Math.round((completedCount / videos.length) * 100)
          : 0,
  };

  const attempt = extractLessonExamAttempt(
    fullResponse ? { ...raw, ...(fullResponse as object) } : raw,
  );
  const examState = resolveLessonExamUiState(attempt, {
    apiPassed: raw.student_has_passed_lesson_exam === true,
    canAccessFromApi: raw.can_access_lesson_exam === true,
    canRetakeFromApi:
      raw.can_retake_lesson_exam === true || raw.can_retake_lesson_exam === 1,
  });

  return {
    id,
    lessonNumber,
    title: displayTitle,
    content,
    briefContent,
    subjectId: toNumericId(raw.subject?.id),
    subjectName:
      typeof raw.subject?.name === "string"
        ? raw.subject.name.trim()
        : undefined,
    doctorName,
    doctorImage,
    videosCount: Number(raw.videos_count) || videos.length,
    attachmentsCount: Number(raw.attachments_count) || attachments.length,
    isWatchCompleted: raw.is_watch_completed === true,
    hasActiveLessonExam: raw.has_active_lesson_exam === true,
    canAccessLessonExam: raw.can_access_lesson_exam === true,
    lessonExamStatus: examState.status,
    lessonExamIsPassed:
      attempt.isPassed === undefined ? undefined : attempt.isPassed,
    isLessonExamUnderReview: examState.underReview,
    canRetakeLessonExam: examState.canRetake,
    canOpenLessonFinalExam: examState.canOpenFinalExam,
    allVideosCompleted: raw.all_videos_completed === true,
    studentHasPassedLessonExam: examState.passed,
    videosProgress,
    videos,
    attachments,
  };
}

type ExamOptionApiPayload = {
  id?: number | string;
  answer?: string;
  text?: string;
  title?: string;
  name?: string;
  option_text?: string;
  choice_text?: string;
  label?: string;
  [key: string]: unknown;
};

type ExamQuestionApiPayload = {
  id?: number | string;
  type?: string;
  question?: string;
  question_text?: string;
  text?: string;
  title?: string;
  order_index?: number;
  answers?: ExamOptionApiPayload[];
  options?: ExamOptionApiPayload[];
  choices?: ExamOptionApiPayload[];
  [key: string]: unknown;
};

type ExamApiPayload = {
  id?: number | string;
  title?: string;
  name?: string;
  questions?: ExamQuestionApiPayload[];
  [key: string]: unknown;
};

/** GET exam responses: `{ data: { exam: {...}, questions: [...] } }`. */
function unwrapExamResponse(response: unknown): ExamApiPayload | null {
  if (!response || typeof response !== "object") return null;
  const r = response as Record<string, unknown>;

  const data =
    r.data && typeof r.data === "object" && !Array.isArray(r.data)
      ? (r.data as Record<string, unknown>)
      : r;

  const examRaw = data.exam ?? data.Exam;
  const examMeta =
    examRaw && typeof examRaw === "object"
      ? (examRaw as ExamApiPayload)
      : ({} as ExamApiPayload);

  const questionsRaw =
    data.questions ??
    data.Questions ??
    examMeta.questions ??
    examMeta.Questions;

  const questions = Array.isArray(questionsRaw)
    ? (questionsRaw as ExamQuestionApiPayload[])
    : [];

  if (!examMeta.id && !examMeta.title && questions.length === 0) {
    return null;
  }

  return { ...examMeta, questions };
}

function mapExamOption(raw: ExamOptionApiPayload): VideoExamOption | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;
  const text =
    (typeof raw.option_text === "string" && raw.option_text.trim()) ||
    (typeof raw.choice_text === "string" && raw.choice_text.trim()) ||
    (typeof raw.answer === "string" && raw.answer.trim()) ||
    (typeof raw.text === "string" && raw.text.trim()) ||
    (typeof raw.label === "string" && raw.label.trim()) ||
    (typeof raw.title === "string" && raw.title.trim()) ||
    (typeof raw.name === "string" && raw.name.trim()) ||
    "";
  if (!text) return null;
  return { id, text };
}

function mapExamQuestion(
  raw: ExamQuestionApiPayload,
): (VideoExamQuestion & { orderIndex: number }) | null {
  const id = toNumericId(raw.id);
  if (id === undefined) return null;
  const text =
    (typeof raw.question_text === "string" && raw.question_text.trim()) ||
    (typeof raw.question === "string" && raw.question.trim()) ||
    (typeof raw.text === "string" && raw.text.trim()) ||
    (typeof raw.title === "string" && raw.title.trim()) ||
    "";
  if (!text) return null;

  const type =
    typeof raw.type === "string" && raw.type.trim()
      ? raw.type.trim()
      : "multiple_choice";

  const optionsRaw = [
    ...(Array.isArray(raw.options) ? raw.options : []),
    ...(Array.isArray(raw.answers) ? raw.answers : []),
    ...(Array.isArray(raw.choices) ? raw.choices : []),
  ];

  const options = optionsRaw
    .map((item) => mapExamOption(item))
    .filter((o): o is VideoExamOption => o !== null);

  return {
    id,
    text,
    type,
    options,
    orderIndex: Number(raw.order_index) || 0,
  };
}

function mapPayloadToVideoExam(raw: ExamApiPayload): VideoExam {
  const id = toNumericId(raw.id) ?? 0;
  const title =
    (typeof raw.title === "string" && raw.title.trim()) ||
    (typeof raw.name === "string" && raw.name.trim()) ||
    "";

  const questions = (Array.isArray(raw.questions) ? raw.questions : [])
    .map((item) => mapExamQuestion(item))
    .filter((q): q is VideoExamQuestion & { orderIndex: number } => q !== null)
    .sort((a, b) => {
      if (a.orderIndex !== b.orderIndex) {
        return a.orderIndex - b.orderIndex;
      }
      return a.id - b.id;
    })
    .map(({ id, text, type, options }) => ({ id, text, type, options }));

  return { id, title, questions };
}

function unwrapSubmitExamResult(response: unknown): VideoExamSubmitResult {
  if (!response || typeof response !== "object") {
    return { passed: false };
  }
  const r = response as Record<string, unknown>;
  const data =
    r.data && typeof r.data === "object" && !Array.isArray(r.data)
      ? (r.data as Record<string, unknown>)
      : r;

  const message =
    (typeof data.message === "string" && data.message.trim()) ||
    (typeof r.message === "string" && r.message.trim()) ||
    undefined;

  const attempt = extractLessonExamAttempt(response);
  const pendingReview =
    attempt.status?.trim().toLowerCase() === "submitted" ||
    attempt.isPassed === null;

  const scoreBlock =
    data.result && typeof data.result === "object" && !Array.isArray(data.result)
      ? (data.result as Record<string, unknown>)
      : data;

  const score =
    typeof scoreBlock.percentage_score === "number"
      ? scoreBlock.percentage_score
      : typeof data.score === "number"
        ? data.score
        : typeof data.percentage === "number"
          ? data.percentage
          : typeof data.obtained_percentage === "number"
            ? data.obtained_percentage
            : typeof data.result_percentage === "number"
              ? data.result_percentage
              : undefined;

  if (pendingReview) {
    return {
      passed: false,
      pendingReview: true,
      score,
      message,
      attemptStatus: attempt.status,
      isPassed: attempt.isPassed ?? null,
    };
  }

  if (attempt.isPassed === false) {
    return {
      passed: false,
      canRetake: true,
      score,
      message,
      attemptStatus: attempt.status,
      isPassed: false,
    };
  }

  const passed =
    attempt.isPassed === true ||
    data.passed === true ||
    data.is_passed === true ||
    data.passed_exam === true ||
    data.student_has_passed_exam === true ||
    data.student_has_passed_video_exam === true ||
    data.student_has_passed_lesson_exam === true ||
    data.result === "passed" ||
    data.result === true;

  return {
    passed,
    score,
    message,
    attemptStatus: attempt.status,
    isPassed: attempt.isPassed,
  };
}

/** Backend expects multipart keys like `answers[0][exam_question_id]`. */
function buildExamSubmitFormData(answers: VideoExamAnswerPayload[]): FormData {
  const formData = new FormData();

  answers.forEach((answer, index) => {
    formData.append(
      `answers[${index}][exam_question_id]`,
      String(answer.examQuestionId),
    );

    if (answer.type === "true_false") {
      formData.append(
        `answers[${index}][true_false_answer]`,
        String(answer.trueFalseAnswer ?? 0),
      );
      return;
    }

    if (answer.selectedOptionId !== undefined) {
      formData.append(
        `answers[${index}][selected_option_id]`,
        String(answer.selectedOptionId),
      );
    }
  });

  return formData;
}

export const lessonsApi = createApi({
  reducerPath: "lessonsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Lesson"],
  endpoints: (builder) => ({
    /** GET `/lessons/{id}` → `{ data: { lesson: { …, videos: [...] } } }`. */
    getLessonDetail: builder.query<
      StudyLessonDetail,
      { id: string | number; lang: string }
    >({
      query: ({ id, lang }) => ({
        url: `/${BASE_PATH}/${id}`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown, _meta, arg) => {
        const lang = resolveAcceptLanguage(arg?.lang);
        const raw = unwrapLessonPayload(response);
        if (!raw || toNumericId(raw.id) === undefined) {
          throw new Error("Invalid lesson detail response");
        }
        return mapPayloadToStudyLessonDetail(raw, lang, response);
      },
      providesTags: (_result, _err, arg) => [
        { type: "Lesson", id: String(arg.id) },
      ],
    }),

    /** POST `/lesson-videos/{id}/complete-watch`. */
    completeVideoWatch: builder.mutation<
      unknown,
      { videoId: string | number; lessonId: string | number; lang: string }
    >({
      query: ({ videoId, lang }) => ({
        url: `/${VIDEO_BASE_PATH}/${videoId}/complete-watch`,
        method: "POST",
        data: {},
        withCsrf: true,
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      invalidatesTags: (_result, _err, arg) => [
        { type: "Lesson", id: String(arg.lessonId) },
      ],
    }),

    /** GET `/lesson-videos/{id}/exam`. */
    getVideoExam: builder.query<
      VideoExam,
      { videoId: string | number; lang: string }
    >({
      query: ({ videoId, lang }) => ({
        url: `/${VIDEO_BASE_PATH}/${videoId}/exam`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown) => {
        const raw = unwrapExamResponse(response);
        if (!raw) throw new Error("Invalid video exam response");
        return mapPayloadToVideoExam(raw);
      },
    }),

    /** GET `/lessons/{id}/exam`. */
    getLessonExam: builder.query<
      VideoExam,
      { lessonId: string | number; lang: string }
    >({
      query: ({ lessonId, lang }) => ({
        url: `/${BASE_PATH}/${lessonId}/exam`,
        method: "GET",
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown) => {
        const raw = unwrapExamResponse(response);
        if (!raw) throw new Error("Invalid lesson exam response");
        return mapPayloadToVideoExam(raw);
      },
    }),

    /** POST `/lesson-videos/{id}/submit-exam`. */
    submitVideoExam: builder.mutation<
      VideoExamSubmitResult,
      {
        videoId: string | number;
        lessonId: string | number;
        lang: string;
        answers: VideoExamAnswerPayload[];
      }
    >({
      query: ({ videoId, lang, answers }) => ({
        url: `/${VIDEO_BASE_PATH}/${videoId}/submit-exam`,
        method: "POST",
        data: buildExamSubmitFormData(answers),
        withCsrf: true,
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown) =>
        unwrapSubmitExamResult(response),
      invalidatesTags: (_result, _err, arg) => [
        { type: "Lesson", id: String(arg.lessonId) },
      ],
    }),

    /** POST `/lessons/{id}/submit-exam`. */
    submitLessonExam: builder.mutation<
      VideoExamSubmitResult,
      {
        lessonId: string | number;
        lang: string;
        answers: VideoExamAnswerPayload[];
      }
    >({
      query: ({ lessonId, lang, answers }) => ({
        url: `/${BASE_PATH}/${lessonId}/submit-exam`,
        method: "POST",
        data: buildExamSubmitFormData(answers),
        withCsrf: true,
        headers: {
          "Accept-Language": resolveAcceptLanguage(lang),
        },
      }),
      transformResponse: (response: unknown) =>
        unwrapSubmitExamResult(response),
      invalidatesTags: (_result, _err, arg) => [
        { type: "Lesson", id: String(arg.lessonId) },
      ],
    }),
  }),
});

export const {
  useGetLessonDetailQuery,
  useCompleteVideoWatchMutation,
  useGetVideoExamQuery,
  useLazyGetVideoExamQuery,
  useLazyGetLessonExamQuery,
  useSubmitVideoExamMutation,
  useSubmitLessonExamMutation,
} = lessonsApi;
