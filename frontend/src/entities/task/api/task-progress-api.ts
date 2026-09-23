import { api } from "@/shared/lib/api";

export type TaskProgressDto = {
  codes: Record<string, string> | null;
  fails: number;
  done: boolean;
  updatedAt: string | null;
};

export async function getTaskProgress(slug: string) {
  const { data } = await api.get<TaskProgressDto>(
    `/progress/tasks/${encodeURIComponent(slug)}`,
  );
  return data;
}

export async function putTaskProgress(
  slug: string,
  payload: {
    codes?: Record<string, string> | null;
    fails?: number;
    done?: boolean;
  },
) {
  const { data } = await api.put<TaskProgressDto>(
    `/progress/tasks/${encodeURIComponent(slug)}`,
    payload,
  );
  return data;
}
