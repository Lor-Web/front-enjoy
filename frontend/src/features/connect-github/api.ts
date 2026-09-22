import type { MeProfile } from "@/entities/user";
import { api } from "@/shared/lib/api";

export type CourseRepository = {
  courseSlug: string;
  owner: string;
  name: string;
  htmlUrl: string;
  createdAt: string;
};

export async function startGithubConnect() {
  const { data } = await api.post<{ url: string }>("/auth/github/connect");
  return data.url;
}

export async function disconnectGithub() {
  const { data } = await api.delete<MeProfile>("/auth/github");
  return data;
}

export async function fetchCourseRepository(slug: string) {
  const { data } = await api.get<CourseRepository>(
    `/courses/${slug}/repository`,
  );
  return data;
}

export async function createCourseRepository(slug: string) {
  const { data } = await api.post<CourseRepository>(
    `/courses/${slug}/repository`,
  );
  return data;
}
