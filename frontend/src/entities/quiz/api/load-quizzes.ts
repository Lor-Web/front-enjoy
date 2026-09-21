import { estimateQuizMinutes } from "@/shared/lib/reading-time";
import type { Quiz } from "../model/types";

type QuizFile = Omit<Quiz, "readingMinutes">;

const modules = import.meta.glob<{ default: QuizFile }>(
  "../../../../content/tracks/react/quizzes/*.json",
  { eager: true },
);

let quizzesCache: Quiz[] | undefined;

export function loadQuizzes(): Quiz[] {
  if (quizzesCache) {
    return quizzesCache;
  }

  quizzesCache = Object.values(modules).map((mod) => ({
    ...mod.default,
    readingMinutes: estimateQuizMinutes(mod.default.questions.length),
  }));

  return quizzesCache;
}

export function loadQuiz(slug: string): Quiz | undefined {
  return loadQuizzes().find((quiz) => quiz.slug === slug);
}
