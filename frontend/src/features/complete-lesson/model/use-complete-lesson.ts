import { useSetAtom, useStore } from "jotai";
import { useCallback } from "react";
import { persistProgress, progressAtom } from "@/entities/progress";

export function useCompleteLesson() {
  const store = useStore();
  const setProgress = useSetAtom(progressAtom);

  return useCallback(
    (slug: string) => {
      const prev = store.get(progressAtom);
      if (prev.readLessonIds.includes(slug)) {
        return;
      }
      const next = {
        ...prev,
        readLessonIds: [...prev.readLessonIds, slug],
      };
      setProgress(next);
      void persistProgress(next);
    },
    [setProgress, store],
  );
}
