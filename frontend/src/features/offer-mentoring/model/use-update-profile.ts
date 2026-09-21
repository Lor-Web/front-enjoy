import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Grade,
  MeProfile,
  ProfileVisibility,
  UserContacts,
} from "@/entities/user";
import { api } from "@/shared/lib/api";
import { toastSuccess } from "@/shared/lib/toast";

export type UpdateProfilePayload = {
  name?: string;
  mentorOffered?: boolean;
  mentorBio?: string | null;
  grade?: Grade | null;
  experience?: string | null;
  workplace?: string | null;
  country?: string | null;
  city?: string | null;
  otherContacts?: string | null;
  contacts?: Partial<UserContacts>;
  visibility?: Partial<ProfileVisibility>;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.patch<MeProfile>("/users/me", payload);
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      void queryClient.invalidateQueries({ queryKey: ["profile", user.slug] });
      toastSuccess("Профиль сохранён");
    },
  });
}
