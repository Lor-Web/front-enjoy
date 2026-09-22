import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useMemo } from "react";
import { sectionKey } from "../lib/course-format";

type CourseProgressEntry = {
  startedAt: string | null;
  completed: string[];
  answers: Record<string, number[]>;
};

type CourseProgressMap = Record<string, CourseProgressEntry | string[]>;

const progressAtom = atomWithStorage<CourseProgressMap>(
  "fe-course-progress",
  {},
  undefined,
  { getOnInit: true },
);

function readAnswers(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number[]>;
  }
  const result: Record<string, number[]> = {};
  for (const [key, item] of Object.entries(value)) {
    if (
      Array.isArray(item) &&
      item.every((entry) => typeof entry === "number")
    ) {
      result[key] = item;
    }
  }
  return result;
}

function readEntry(value: CourseProgressEntry | string[] | undefined) {
  if (Array.isArray(value)) {
    return {
      startedAt: value.length > 0 ? "legacy" : null,
      completed: value,
      answers: {} as Record<string, number[]>,
    };
  }
  if (value && Array.isArray(value.completed)) {
    return {
      startedAt:
        typeof value.startedAt === "string" && value.startedAt
          ? value.startedAt
          : value.completed.length > 0
            ? "legacy"
            : null,
      completed: value.completed.filter((item) => typeof item === "string"),
      answers: readAnswers(value.answers),
    };
  }
  return {
    startedAt: null,
    completed: [] as string[],
    answers: {} as Record<string, number[]>,
  };
}

export function useCourseProgress(courseSlug: string) {
  const [map, setMap] = useAtom(progressAtom);
  const entry = useMemo(() => readEntry(map[courseSlug]), [map, courseSlug]);
  const completed = useMemo(() => new Set(entry.completed), [entry.completed]);
  const started = Boolean(entry.startedAt);

  const isDone = useCallback(
    (moduleSlug: string, sectionSlug: string) =>
      completed.has(sectionKey(moduleSlug, sectionSlug)),
    [completed],
  );

  const quizAnswers = useCallback(
    (moduleSlug: string, sectionSlug: string) =>
      entry.answers[sectionKey(moduleSlug, sectionSlug)] ?? null,
    [entry.answers],
  );

  const start = useCallback(() => {
    setMap((current) => {
      const currentEntry = readEntry(current[courseSlug]);
      if (currentEntry.startedAt) {
        return current;
      }
      return {
        ...current,
        [courseSlug]: {
          startedAt: new Date().toISOString(),
          completed: currentEntry.completed,
          answers: currentEntry.answers,
        },
      };
    });
  }, [courseSlug, setMap]);

  const complete = useCallback(
    (moduleSlug: string, sectionSlug: string, answers?: number[]) => {
      const key = sectionKey(moduleSlug, sectionSlug);
      setMap((current) => {
        const currentEntry = readEntry(current[courseSlug]);
        const already = currentEntry.completed.includes(key);
        const nextAnswers = answers
          ? { ...currentEntry.answers, [key]: answers }
          : currentEntry.answers;
        if (already && currentEntry.startedAt && !answers) {
          return current;
        }
        return {
          ...current,
          [courseSlug]: {
            startedAt: currentEntry.startedAt ?? new Date().toISOString(),
            completed: already
              ? currentEntry.completed
              : [...currentEntry.completed, key],
            answers: nextAnswers,
          },
        };
      });
    },
    [courseSlug, setMap],
  );

  return { completed, started, isDone, quizAnswers, start, complete };
}
