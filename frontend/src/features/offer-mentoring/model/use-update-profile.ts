import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MeProfile, UserContacts } from "@/entities/user";
import { api } from "@/shared/lib/api";
import { toastSuccess } from "@/shared/lib/toast";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name?: string;
      mentorOffered?: boolean;
      mentorBio?: string | null;
      contacts?: Partial<UserContacts>;
    }) => {
      const { data } = await api.patch<MeProfile>("/users/me", payload);
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      void queryClient.invalidateQueries({ queryKey: ["mentors"] });
      void queryClient.invalidateQueries({ queryKey: ["profile", user.slug] });
      toastSuccess("Профиль сохранён");
    },
  });
}
