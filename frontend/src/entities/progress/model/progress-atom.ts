import { atomWithStorage } from "jotai/utils";
import { emptyProgress, type ProgressState } from "./types";

export const progressAtom = atomWithStorage<ProgressState>(
  "fe-progress",
  emptyProgress,
  undefined,
  { getOnInit: true },
);

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
