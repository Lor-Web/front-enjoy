import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/shared/lib/toast";
import { fetchHomeworkInbox, reviewHomework } from "../api";

export function useHomeworkInbox(enabled: boolean) {
  return useQuery({
    queryKey: ["course-homework-inbox"],
    enabled,
    refetchInterval: 15_000,
    queryFn: fetchHomeworkInbox,
  });
}

export function useReviewHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      decision,
    }: {
      id: string;
      decision: "accepted" | "rejected";
    }) => reviewHomework(id, decision),
    onSuccess: (row) => {
      void queryClient.invalidateQueries({
        queryKey: ["course-homework-inbox"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["course-homework", row.courseSlug, row.moduleSlug],
      });
      toastSuccess(
        row.status === "accepted" ? "Работа принята" : "Работа отклонена",
      );
    },
    onError: toastError,
  });
}
