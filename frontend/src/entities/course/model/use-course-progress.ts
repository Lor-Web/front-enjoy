import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { tokenAtom } from "@/features/auth";
import {
  completeCourseSection,
  fetchCourseProgress,
  startCourseProgress,
} from "../api/course-progress-api";
import { sectionKey } from "../lib/course-format";
import {
  type CourseProgressState,
  emptyCourseProgress,
} from "./course-progress";

export function courseProgressQueryKey(courseSlug: string) {
  return ["course-progress", courseSlug] as const;
}

export function useCourseProgress(courseSlug: string) {
  const token = useAtomValue(tokenAtom);
  const queryClient = useQueryClient();
  const queryKey = courseProgressQueryKey(courseSlug);
  const query = useQuery({
    queryKey,
    enabled: Boolean(token && courseSlug),
    queryFn: () => fetchCourseProgress(courseSlug),
  });
  const entry = query.data ?? emptyCourseProgress;
  const completed = useMemo(() => new Set(entry.completed), [entry.completed]);
  const started = Boolean(entry.startedAt);

  const startMutation = useMutation({
    mutationFn: () => startCourseProgress(courseSlug),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prev =
        queryClient.getQueryData<CourseProgressState>(queryKey) ??
        emptyCourseProgress;
      queryClient.setQueryData(queryKey, {
        ...prev,
        startedAt: prev.startedAt ?? new Date().toISOString(),
      });
      return { prev };
    },
    onError: (_error, _value, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

  const completeMutation = useMutation({
    mutationFn: (input: {
      moduleSlug: string;
      sectionSlug: string;
      answers?: number[];
    }) =>
      completeCourseSection(
        courseSlug,
        input.moduleSlug,
        input.sectionSlug,
        input.answers,
      ),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey });
      const prev =
        queryClient.getQueryData<CourseProgressState>(queryKey) ??
        emptyCourseProgress;
      const key = sectionKey(input.moduleSlug, input.sectionSlug);
      queryClient.setQueryData(queryKey, {
        startedAt: prev.startedAt ?? new Date().toISOString(),
        completed: prev.completed.includes(key)
          ? prev.completed
          : [...prev.completed, key],
        answers: input.answers
          ? { ...prev.answers, [key]: input.answers }
          : prev.answers,
      });
      return { prev };
    },
    onError: (_error, _value, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

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

  const startCourse = startMutation.mutate;
  const completeSection = completeMutation.mutate;

  const start = useCallback(() => {
    if (!token || started) {
      return;
    }
    startCourse();
  }, [startCourse, started, token]);

  const complete = useCallback(
    (moduleSlug: string, sectionSlug: string, answers?: number[]) => {
      if (!token) {
        return;
      }
      const key = sectionKey(moduleSlug, sectionSlug);
      if (completed.has(key) && !answers) {
        return;
      }
      completeSection({ moduleSlug, sectionSlug, answers });
    },
    [completeSection, completed, token],
  );

  return {
    completed,
    started,
    isDone,
    quizAnswers,
    start,
    complete,
    isPending: Boolean(token) && query.isPending,
    isError: query.isError,
  };
}
