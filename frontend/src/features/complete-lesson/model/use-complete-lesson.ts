import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { progressAtom } from "@/entities/progress";

export function useCompleteLesson() {
  const setProgress = useSetAtom(progressAtom);

  return useCallback(
    (slug: string) => {
      setProgress((prev) => {
        if (prev.readLessonIds.includes(slug)) {
          return prev;
        }
        return {
          ...prev,
          readLessonIds: [...prev.readLessonIds, slug],
        };
      });
    },
    [setProgress],
  );
}
