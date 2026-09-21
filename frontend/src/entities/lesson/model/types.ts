import type { ComponentType } from "react";

export const LESSON_VIEWS = ["short", "detailed", "practices"] as const;

export type LessonView = (typeof LESSON_VIEWS)[number];

export type LessonHeading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type LessonSubtopic = {
  id: string;
  title: string;
};

export type LessonMeta = {
  slug: string;
  title: string;
  order: number;
  sourceUrl: string;
  sourceLicense: string;
  quizSlug: string;
  subtopics: LessonSubtopic[];
};

export type LessonVariant = {
  view: LessonView;
  Content: ComponentType;
  headings: LessonHeading[];
  readingMinutes: number;
};

export type Lesson = LessonMeta & {
  variants: Partial<Record<LessonView, LessonVariant>>;
};

export function isLessonView(value: string): value is LessonView {
  return (LESSON_VIEWS as readonly string[]).includes(value);
}
