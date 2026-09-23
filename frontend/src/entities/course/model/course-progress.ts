export const LOCAL_COURSE_PROGRESS_KEY = "fe-course-progress";

export type CourseProgressState = {
  startedAt: string | null;
  completed: string[];
  answers: Record<string, number[]>;
};

export const emptyCourseProgress: CourseProgressState = {
  startedAt: null,
  completed: [],
  answers: {},
};

export function normalizeCourseProgress(
  value: Partial<CourseProgressState> | null | undefined,
): CourseProgressState {
  const answers: Record<string, number[]> = {};
  if (value?.answers && typeof value.answers === "object") {
    for (const [key, item] of Object.entries(value.answers)) {
      if (
        Array.isArray(item) &&
        item.every((entry) => typeof entry === "number")
      ) {
        answers[key] = item;
      }
    }
  }
  return {
    startedAt:
      typeof value?.startedAt === "string" && value.startedAt
        ? value.startedAt
        : null,
    completed: Array.isArray(value?.completed)
      ? value.completed.filter((item) => typeof item === "string")
      : [],
    answers,
  };
}
