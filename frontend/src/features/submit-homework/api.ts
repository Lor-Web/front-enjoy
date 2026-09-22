import { api } from "@/shared/lib/api";

export type CourseHomework = {
  courseSlug: string;
  moduleSlug: string;
  prUrl: string;
  submittedAt: string;
  mentorId: string | null;
  mentorName: string | null;
};

export async function fetchCourseHomework(
  courseSlug: string,
  moduleSlug: string,
) {
  const { data } = await api.get<CourseHomework | null>(
    `/courses/${courseSlug}/modules/${moduleSlug}/homework`,
  );
  return data;
}

export async function submitCourseHomework(
  courseSlug: string,
  moduleSlug: string,
  payload: { prUrl: string; mentorId: string },
) {
  const { data } = await api.post<CourseHomework>(
    `/courses/${courseSlug}/modules/${moduleSlug}/homework`,
    payload,
  );
  return data;
}
