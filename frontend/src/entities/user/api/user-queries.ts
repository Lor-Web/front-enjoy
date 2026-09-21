import { queryOptions } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";
import type { MeProfile, PublicProfile } from "../model/types";

export const meQueryOptions = (token: string | null) =>
  queryOptions({
    queryKey: ["auth", "me"],
    enabled: Boolean(token),
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await api.get<MeProfile>("/auth/me");
      return data;
    },
  });

export const mentorsQueryOptions = queryOptions({
  queryKey: ["mentors"],
  staleTime: 15_000,
  queryFn: async () => {
    const { data } = await api.get<PublicProfile[]>("/mentors");
    return data;
  },
});

export const profileQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["profile", slug],
    staleTime: 15_000,
    queryFn: async () => {
      const { data } = await api.get<PublicProfile>(`/users/${slug}`);
      return data;
    },
  });
