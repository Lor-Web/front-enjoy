import { queryOptions, useQuery } from "@tanstack/react-query";
import { loadQuiz } from "../api/load-quizzes";

export const quizQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["quiz", slug],
    queryFn: () => {
      const quiz = loadQuiz(slug);
      if (!quiz) {
        throw new Error(`Квиз не найден: ${slug}`);
      }
      return quiz;
    },
  });

export function useQuiz(slug: string) {
  return useQuery(quizQueryOptions(slug));
}
