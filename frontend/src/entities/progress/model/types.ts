export type ProgressState = {
  readLessonIds: string[];
  passedQuizIds: string[];
};

export const emptyProgress: ProgressState = {
  readLessonIds: [],
  passedQuizIds: [],
};
