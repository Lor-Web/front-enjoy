import { api } from "@/shared/lib/api";
import {
  type CourseProgressState,
  emptyCourseProgress,
  LOCAL_COURSE_PROGRESS_KEY,
  normalizeCourseProgress,
} from "../model/course-progress";

export async function fetchCourseProgress(courseSlug: string) {
  const { data } = await api.get<CourseProgressState>(
    `/progress/courses/${courseSlug}`,
  );
  const remote = normalizeCourseProgress(data);
  if (remote.startedAt || remote.completed.length > 0) {
    dropLocalCourseProgress(courseSlug);
    return remote;
  }

  const local = takeLocalCourseProgress(courseSlug);
  if (!local) {
    return remote;
  }

  try {
    const imported = await putCourseProgress(courseSlug, local);
    dropLocalCourseProgress(courseSlug);
    return imported;
  } catch {
    return local;
  }
}

export async function startCourseProgress(courseSlug: string) {
  const { data } = await api.post<CourseProgressState>(
    `/progress/courses/${courseSlug}/start`,
  );
  return normalizeCourseProgress(data);
}

export async function completeCourseSection(
  courseSlug: string,
  moduleSlug: string,
  sectionSlug: string,
  answers?: number[],
) {
  const { data } = await api.post<CourseProgressState>(
    `/progress/courses/${courseSlug}/sections`,
    { moduleSlug, sectionSlug, answers },
  );
  return normalizeCourseProgress(data);
}

async function putCourseProgress(
  courseSlug: string,
  payload: CourseProgressState,
) {
  const { data } = await api.put<CourseProgressState>(
    `/progress/courses/${courseSlug}`,
    {
      startedAt: payload.startedAt ?? undefined,
      completed: payload.completed,
      answers: payload.answers,
    },
  );
  return normalizeCourseProgress(data);
}

function takeLocalCourseProgress(courseSlug: string) {
  const raw = localStorage.getItem(LOCAL_COURSE_PROGRESS_KEY);
  if (!raw) {
    return null;
  }
  try {
    const map = JSON.parse(raw) as Record<string, unknown>;
    const entry = normalizeCourseProgress(readLegacyEntry(map[courseSlug]));
    if (!entry.startedAt && entry.completed.length === 0) {
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function dropLocalCourseProgress(courseSlug: string) {
  const raw = localStorage.getItem(LOCAL_COURSE_PROGRESS_KEY);
  if (!raw) {
    return;
  }
  try {
    const map = JSON.parse(raw) as Record<string, unknown>;
    if (!(courseSlug in map) && Object.keys(map).length > 0) {
      return;
    }
    delete map[courseSlug];
    if (Object.keys(map).length === 0) {
      localStorage.removeItem(LOCAL_COURSE_PROGRESS_KEY);
      return;
    }
    localStorage.setItem(LOCAL_COURSE_PROGRESS_KEY, JSON.stringify(map));
  } catch {
    localStorage.removeItem(LOCAL_COURSE_PROGRESS_KEY);
  }
}

function readLegacyEntry(value: unknown): CourseProgressState {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return {
      ...emptyCourseProgress,
      startedAt: value.length > 0 ? new Date().toISOString() : null,
      completed: value,
    };
  }
  if (!value || typeof value !== "object") {
    return emptyCourseProgress;
  }
  const row = value as {
    startedAt?: unknown;
    completed?: unknown;
    answers?: unknown;
  };
  return {
    startedAt:
      typeof row.startedAt === "string" && row.startedAt ? row.startedAt : null,
    completed: Array.isArray(row.completed)
      ? row.completed.filter((item) => typeof item === "string")
      : [],
    answers:
      row.answers &&
      typeof row.answers === "object" &&
      !Array.isArray(row.answers)
        ? (row.answers as Record<string, number[]>)
        : {},
  };
}
