import { queryOptions, useQuery } from "@tanstack/react-query";
import { COURSES } from "../model/courses";

export const coursesQueryOptions = queryOptions({
  queryKey: ["courses"],
  queryFn: () => COURSES,
});

export const courseQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["course", slug],
    queryFn: () => COURSES.find((item) => item.slug === slug) ?? null,
  });

export function useCourses() {
  return useQuery(coursesQueryOptions);
}

export function useCourse(slug: string) {
  return useQuery(courseQueryOptions(slug));
}
