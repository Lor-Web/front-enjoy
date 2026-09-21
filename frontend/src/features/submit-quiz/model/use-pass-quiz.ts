import { useSetAtom } from "jotai";
import { progressAtom } from "@/entities/progress";

export function usePassQuiz() {
  const setProgress = useSetAtom(progressAtom);

  return (slug: string) => {
    setProgress((prev) => {
      if (prev.passedQuizIds.includes(slug)) {
        return prev;
      }
      return {
        ...prev,
        passedQuizIds: [...prev.passedQuizIds, slug],
      };
    });
  };
}
