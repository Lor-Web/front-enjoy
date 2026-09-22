import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import type { MeProfile } from "@/entities/user";
import { api } from "@/shared/lib/api";
import { tokenAtom } from "./token-atom";

type AuthResponse = {
  token: string;
  user: MeProfile;
};

export function useAuth() {
  const queryClient = useQueryClient();
  const setToken = useSetAtom(tokenAtom);

  const applySession = async (response: AuthResponse) => {
    setToken(response.token);
    queryClient.setQueryData(["auth", "me"], response.user);
    await queryClient.invalidateQueries({ queryKey: ["progress"] });
    await queryClient.invalidateQueries({ queryKey: ["content-vote"] });
  };

  const login = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      return data;
    },
    onSuccess: applySession,
  });

  const register = useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      return data;
    },
    onSuccess: applySession,
  });

  return { login, register };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const setToken = useSetAtom(tokenAtom);

  return () => {
    setToken(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
    queryClient.removeQueries({ queryKey: ["mentorships"] });
    queryClient.removeQueries({ queryKey: ["progress"] });
    queryClient.removeQueries({ queryKey: ["content-vote"] });
  };
}
