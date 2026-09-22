import { queryOptions, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { tokenAtom } from "@/features/auth/model/token-atom";
import { api } from "@/shared/lib/api";
import {
  emptyProgress,
  normalizeProgress,
  type ProgressState,
} from "../model/types";

export const progressQueryOptions = (token: string | null) =>
  queryOptions({
    queryKey: ["progress", "me"],
    enabled: Boolean(token),
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await api.get<ProgressState>("/progress/me");
      return normalizeProgress(data);
    },
  });

export function useProgress() {
  const token = useAtomValue(tokenAtom);
  const query = useQuery(progressQueryOptions(token));
  return {
    ...query,
    progress: query.data ?? emptyProgress,
    isSignedIn: Boolean(token),
  };
}

export async function markLessonRead(slug: string) {
  const { data } = await api.post<ProgressState>(
    `/progress/lessons/${encodeURIComponent(slug)}`,
  );
  return normalizeProgress(data);
}

export async function recordQuizProgress(slug: string, passed: boolean) {
  const { data } = await api.post<ProgressState>(
    `/progress/quizzes/${encodeURIComponent(slug)}`,
    { passed },
  );
  return normalizeProgress(data);
}
