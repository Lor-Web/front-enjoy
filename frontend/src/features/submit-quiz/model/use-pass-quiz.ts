import { useSetAtom, useStore } from "jotai";
import { persistProgress, progressAtom } from "@/entities/progress";

export function useSubmitQuiz() {
  const store = useStore();
  const setProgress = useSetAtom(progressAtom);

  return (slug: string, passed: boolean) => {
    const prev = store.get(progressAtom);
    const alreadyPassed = prev.passedQuizIds.includes(slug);
    const attempts = alreadyPassed
      ? (prev.quizAttempts[slug] ?? 0)
      : (prev.quizAttempts[slug] ?? 0) + 1;
    const next = {
      ...prev,
      quizAttempts: { ...prev.quizAttempts, [slug]: attempts },
      passedQuizIds:
        passed && !alreadyPassed
          ? [...prev.passedQuizIds, slug]
          : prev.passedQuizIds,
    };
    setProgress(next);
    void persistProgress(next);
  };
}
