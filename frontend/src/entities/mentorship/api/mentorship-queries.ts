import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Mentorship } from "@/entities/user";
import { api } from "@/shared/lib/api";

export type StudentProgress = {
  readLessonIds: string[];
  passedQuizIds: string[];
};

export type StudentProgressDetail = {
  reads: Array<{ slug: string; readAt: string }>;
  quizzes: Array<{
    slug: string;
    attempts: number;
    passed: boolean;
    passedAt: string | null;
  }>;
};

export type StudentMentorship = Mentorship & {
  progress: StudentProgress;
};

export type StudentMentorshipDetail = Mentorship & {
  progress: StudentProgressDetail;
};

export const incomingQueryOptions = (token: string | null) =>
  queryOptions({
    queryKey: ["mentorships", "incoming"],
    enabled: Boolean(token),
    staleTime: 10_000,
    queryFn: async () => {
      const { data } = await api.get<Mentorship[]>("/mentorships/incoming");
      return data;
    },
  });

export const studentsQueryOptions = (token: string | null) =>
  queryOptions({
    queryKey: ["mentorships", "students"],
    enabled: Boolean(token),
    staleTime: 10_000,
    queryFn: async () => {
      const { data } = await api.get<StudentMentorship[]>(
        "/mentorships/students",
      );
      return data;
    },
  });

export const myMentorsQueryOptions = (token: string | null) =>
  queryOptions({
    queryKey: ["mentorships", "mentors"],
    enabled: Boolean(token),
    staleTime: 10_000,
    queryFn: async () => {
      const { data } = await api.get<Mentorship[]>("/mentorships/mentors");
      return data;
    },
  });

export const studentMentorshipQueryOptions = (
  token: string | null,
  id: string,
) =>
  queryOptions({
    queryKey: ["mentorships", "student", id],
    enabled: Boolean(token && id),
    staleTime: 10_000,
    queryFn: async () => {
      const { data } = await api.get<StudentMentorshipDetail>(
        `/mentorships/${id}`,
      );
      return data;
    },
  });

export function useIncoming(token: string | null) {
  return useQuery(incomingQueryOptions(token));
}

export function useStudents(token: string | null) {
  return useQuery(studentsQueryOptions(token));
}

export function useMyMentors(token: string | null) {
  return useQuery(myMentorsQueryOptions(token));
}

export function useStudentMentorship(token: string | null, id: string) {
  return useQuery(studentMentorshipQueryOptions(token, id));
}
