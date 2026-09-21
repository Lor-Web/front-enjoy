import { atomWithStorage } from "jotai/utils";
import type { LessonView } from "@/entities/lesson";

export const lessonViewAtom = atomWithStorage<LessonView>(
  "fe-lesson-view",
  "short",
  undefined,
  { getOnInit: true },
);
