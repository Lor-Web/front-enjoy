import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Mentorship } from "@/entities/user";
import { api } from "@/shared/lib/api";
import { toastSuccess } from "@/shared/lib/toast";

export function useRequestMentorship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mentorSlug: string) => {
      const { data } = await api.post<Mentorship>("/mentorships", {
        mentorSlug,
      });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mentorships"] });
      toastSuccess("Заявка отправлена");
    },
  });
}
