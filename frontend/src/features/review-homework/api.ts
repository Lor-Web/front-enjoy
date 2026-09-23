import type { CourseHomework } from "@/entities/course";
import { api } from "@/shared/lib/api";

export async function fetchHomeworkInbox() {
  const { data } = await api.get<CourseHomework[]>("/courses/inbox");
  return data;
}

export async function reviewHomework(
  id: string,
  decision: "accepted" | "rejected",
) {
  const { data } = await api.post<CourseHomework>(`/courses/inbox/${id}`, {
    decision,
  });
  return data;
}
