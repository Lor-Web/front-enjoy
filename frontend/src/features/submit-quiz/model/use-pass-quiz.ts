import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { recordQuizProgress } from "@/entities/progress";
import { tokenAtom } from "@/features/auth";

export function useSubmitQuiz() {
  const token = useAtomValue(tokenAtom);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ slug, passed }: { slug: string; passed: boolean }) =>
      recordQuizProgress(slug, passed),
    onSuccess: (data) => {
      queryClient.setQueryData(["progress", "me"], data);
    },
  });

  return (slug: string, passed: boolean) => {
    if (!token) {
      return;
    }
    mutation.mutate({ slug, passed });
  };
}
