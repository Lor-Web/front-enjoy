import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toastError, toastSuccess } from "@/shared/lib/toast";
import { fetchCourseHomework, submitCourseHomework } from "../api";

export function useCourseHomework(
  courseSlug: string,
  moduleSlug: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["course-homework", courseSlug, moduleSlug],
    enabled,
    refetchInterval: (query) => {
      const row = query.state.data;
      if (!row || row.status !== "pending") {
        return false;
      }
      return 8000;
    },
    queryFn: async () => {
      try {
        return (await fetchCourseHomework(courseSlug, moduleSlug)) ?? null;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useSubmitCourseHomework(
  courseSlug: string,
  moduleSlug: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { prUrl: string; mentorId?: string }) =>
      submitCourseHomework(courseSlug, moduleSlug, payload),
    onSuccess: (row) => {
      queryClient.setQueryData(
        ["course-homework", courseSlug, moduleSlug],
        row,
      );
      toastSuccess(
        row.mentorId
          ? "Работа отправлена ментору"
          : "Работа сдана. Ждём тесты на pull request",
      );
    },
    onError: toastError,
  });
}
