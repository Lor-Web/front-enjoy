import type { ProgressState } from "./types";

export function isLessonRead(progress: ProgressState, slug: string) {
  return progress.readLessonIds.includes(slug);
}

export function isQuizPassed(progress: ProgressState, slug: string) {
  return progress.passedQuizIds.includes(slug);
}

export function trackProgressPercent(
  progress: ProgressState,
  lessonSlugs: string[],
) {
  if (lessonSlugs.length === 0) {
    return 0;
  }
  const done = lessonSlugs.filter(
    (slug) => isLessonRead(progress, slug) || isQuizPassed(progress, slug),
  ).length;
  return Math.round((done / lessonSlugs.length) * 100);
}

export function courseProgressPercent(
  progress: Pick<ProgressState, "readLessonIds" | "passedQuizIds">,
  lessons: Array<{ slug: string; quizSlug: string }>,
) {
  if (lessons.length === 0) {
    return 0;
  }
  const total = lessons.length * 2;
  const done = lessons.reduce((sum, lesson) => {
    const read = progress.readLessonIds.includes(lesson.slug) ? 1 : 0;
    const passed = progress.passedQuizIds.includes(lesson.quizSlug) ? 1 : 0;
    return sum + read + passed;
  }, 0);
  return Math.round((done / total) * 100);
}
