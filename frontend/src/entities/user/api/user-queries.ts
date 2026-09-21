import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";
import type { Grade, MeProfile, PublicProfile } from "../model/types";

export type UsersListParams = {
  page?: number;
  q?: string;
  mentors?: boolean;
  grade?: Grade | "";
};

export type UsersListResponse = {
  items: PublicProfile[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

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

export const usersQueryOptions = (params: UsersListParams) =>
  queryOptions({
    queryKey: ["users", params],
    staleTime: 15_000,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<UsersListResponse>("/users", {
        params: {
          page: params.page,
          q: params.q || undefined,
          mentors: params.mentors ? true : undefined,
          grade: params.grade || undefined,
        },
      });
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
