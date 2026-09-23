import { POLKA_COURSE } from "./polka";
import type { Course } from "./types";

export const COURSES: Course[] = [POLKA_COURSE];

export function findCourse(slug: string) {
  return COURSES.find((course) => course.slug === slug) ?? null;
}
