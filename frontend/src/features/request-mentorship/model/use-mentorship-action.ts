import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Mentorship } from "@/entities/user";
import { api } from "@/shared/lib/api";
import { toastSuccess } from "@/shared/lib/toast";

export function useMentorshipAction() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["mentorships"] });
  };

  const accept = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Mentorship>(`/mentorships/${id}/accept`);
      return data;
    },
    onSuccess: () => {
      invalidate();
      toastSuccess("Заявка принята");
    },
  });

  const decline = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Mentorship>(`/mentorships/${id}/decline`);
      return data;
    },
    onSuccess: () => {
      invalidate();
      toastSuccess("Заявка отклонена");
    },
  });

  const end = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Mentorship>(`/mentorships/${id}/end`);
      return data;
    },
    onSuccess: () => {
      invalidate();
      toastSuccess("Менторство завершено");
    },
  });

  return { accept, decline, end };
}
