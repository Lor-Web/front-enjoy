import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { isLessonRead, markLessonRead, useProgress } from "@/entities/progress";
import { tokenAtom } from "@/features/auth";

export function useCompleteLesson() {
  const token = useAtomValue(tokenAtom);
  const queryClient = useQueryClient();
  const { progress } = useProgress();
  const mutation = useMutation({
    mutationFn: markLessonRead,
    onSuccess: (data) => {
      queryClient.setQueryData(["progress", "me"], data);
    },
  });

  return useCallback(
    (slug: string) => {
      if (!token || isLessonRead(progress, slug)) {
        return;
      }
      mutation.mutate(slug);
    },
    [mutation, progress, token],
  );
}
