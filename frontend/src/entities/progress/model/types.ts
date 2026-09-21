export type ProgressState = {
  readLessonIds: string[];
  passedQuizIds: string[];
  quizAttempts: Record<string, number>;
};

export const emptyProgress: ProgressState = {
  readLessonIds: [],
  passedQuizIds: [],
  quizAttempts: {},
};

export function normalizeProgress(
  value: Partial<ProgressState> | null | undefined,
): ProgressState {
  return {
    readLessonIds: value?.readLessonIds ?? [],
    passedQuizIds: value?.passedQuizIds ?? [],
    quizAttempts: value?.quizAttempts ?? {},
  };
}
