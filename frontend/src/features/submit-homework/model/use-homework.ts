import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { type Course, unlockedHomeworkModules } from "@/entities/course";
import { tokenAtom } from "@/features/auth";
import { useCourseRepository } from "@/features/connect-github";
import { toastError, toastSuccess } from "@/shared/lib/toast";
import {
  ensureHomeworkChecks,
  fetchCourseHomework,
  submitCourseHomework,
} from "../api";

export function useEnsureHomeworkChecks(
  course: Course | undefined,
  completed: ReadonlySet<string>,
) {
  const token = useAtomValue(tokenAtom);
  const signedIn = Boolean(token);
  const slug = course?.slug ?? "";
  const { data: repo } = useCourseRepository(slug, signedIn && Boolean(course));
  const sent = useRef(new Set<string>());
  const completedKey = Array.from(completed).sort().join("\0");
  const modules = useMemo(() => {
    if (!course) {
      return [];
    }
    const done = new Set(completedKey ? completedKey.split("\0") : []);
    return unlockedHomeworkModules(course, done);
  }, [course, completedKey]);

  useEffect(() => {
    if (!course || !repo) {
      return;
    }
    for (const moduleSlug of modules) {
      const key = `${course.slug}/${moduleSlug}`;
      if (sent.current.has(key)) {
        continue;
      }
      sent.current.add(key);
      void ensureHomeworkChecks(course.slug, moduleSlug).catch(() => {
        sent.current.delete(key);
      });
    }
  }, [course, modules, repo]);
}

export function useCourseHomework(
  courseSlug: string,
  moduleSlug: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["course-homework", courseSlug, moduleSlug],
    enabled,
    refetchInterval: (query) => {
      const row = query.state.data;
      if (!row || row.status !== "pending") {
        return false;
      }
      return 8000;
    },
    queryFn: async () => {
      try {
        return (await fetchCourseHomework(courseSlug, moduleSlug)) ?? null;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useSubmitCourseHomework(
  courseSlug: string,
  moduleSlug: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { prUrl: string; mentorId?: string }) =>
      submitCourseHomework(courseSlug, moduleSlug, payload),
    onSuccess: (row) => {
      queryClient.setQueryData(
        ["course-homework", courseSlug, moduleSlug],
        row,
      );
      toastSuccess(
        row.mentorId
          ? "Работа отправлена ментору"
          : "Работа сдана. Ждём тесты на pull request",
      );
    },
    onError: toastError,
  });
}
