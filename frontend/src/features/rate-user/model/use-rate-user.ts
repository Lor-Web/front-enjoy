import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Mentorship, RatingAspect } from "@/entities/user";
import { api } from "@/shared/lib/api";
import { toastSuccess } from "@/shared/lib/toast";

export function useRateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      mentorshipId: string;
      aspect: RatingAspect;
      score: number;
      comment?: string;
    }) => {
      const { data } = await api.post<Mentorship>(
        `/mentorships/${payload.mentorshipId}/ratings`,
        {
          aspect: payload.aspect,
          score: payload.score,
          comment: payload.comment,
        },
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mentorships"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toastSuccess("Оценка сохранена");
    },
  });
}
