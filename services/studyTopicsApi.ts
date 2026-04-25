import api from "@/services/api";
import type { StudyTopic } from "@/types/studyTopic";

/**
 * Study topics (axes) — REST helpers.
 * Endpoints are placeholders: align paths with the backend when ready.
 * Example: GET /study-topics, GET /study-topics/:id
 */

const BASE_PATH = "study-topics";

export async function fetchStudyTopics(): Promise<StudyTopic[]> {
  const { data } = await api.get<StudyTopic[]>(`/${BASE_PATH}`);
  return data;
}

export async function fetchStudyTopicById(id: string | number): Promise<StudyTopic> {
  const { data } = await api.get<StudyTopic>(`/${BASE_PATH}/${id}`);
  return data;
}
