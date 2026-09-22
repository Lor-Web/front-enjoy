import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toastError, toastSuccess } from "@/shared/lib/toast";
import {
  createCourseRepository,
  disconnectGithub,
  fetchCourseRepository,
  startGithubConnect,
} from "../api";

export function useGithubConnect() {
  const queryClient = useQueryClient();

  const connect = useMutation({
    mutationFn: (next?: string) => startGithubConnect(next),
    onSuccess: (url) => {
      window.location.assign(url);
    },
    onError: toastError,
  });

  const disconnect = useMutation({
    mutationFn: disconnectGithub,
    onSuccess: (me) => {
      queryClient.setQueryData(["auth", "me"], me);
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toastSuccess("GitHub отключён");
    },
    onError: toastError,
  });

  return { connect, disconnect };
}

export function useCourseRepository(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: ["course-repository", slug],
    enabled,
    queryFn: async () => {
      try {
        return (await fetchCourseRepository(slug)) ?? null;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useCreateCourseRepository(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createCourseRepository(slug),
    onSuccess: (repo) => {
      queryClient.setQueryData(["course-repository", slug], repo);
      toastSuccess("Репозиторий создан");
    },
    onError: toastError,
  });
}
