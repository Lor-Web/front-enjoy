export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export type Quiz = {
  slug: string;
  lessonSlug: string;
  title: string;
  questions: QuizQuestion[];
  readingMinutes: number;
};
