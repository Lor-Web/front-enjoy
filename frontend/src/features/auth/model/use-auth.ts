import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { persistProgress, progressAtom } from "@/entities/progress";
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
  const [progress, setProgress] = useAtom(progressAtom);

  const applySession = async (response: AuthResponse) => {
    setToken(response.token);
    queryClient.setQueryData(["auth", "me"], response.user);
    const merged = await persistProgress(progress, response.token);
    if (merged) {
      setProgress(merged);
    }
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
  };
}
