import { queryOptions, useQuery } from "@tanstack/react-query";
import { loadLesson, loadLessons } from "../api/load-lessons";

export const lessonsQueryOptions = queryOptions({
  queryKey: ["lessons"],
  queryFn: () => loadLessons(),
});

export const lessonQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["lesson", slug],
    queryFn: () => {
      const lesson = loadLesson(slug);
      if (!lesson) {
        throw new Error(`Урок не найден: ${slug}`);
      }
      return lesson;
    },
  });

export function useLessons() {
  return useQuery(lessonsQueryOptions);
}

export function useLesson(slug: string) {
  return useQuery(lessonQueryOptions(slug));
}
