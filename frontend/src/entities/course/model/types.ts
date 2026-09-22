import type { Grade } from "@/entities/user";

export const COURSE_TECHS = [
  { id: "react", title: "React", hex: "#61DAFB" },
  { id: "javascript", title: "JavaScript", hex: "#F7DF1E" },
  { id: "typescript", title: "TypeScript", hex: "#3178C6" },
] as const;

export type CourseTechId = (typeof COURSE_TECHS)[number]["id"];

export type CourseLecture = {
  title: string;
  minutes: number;
  preview?: boolean;
};

export type CourseSection = {
  title: string;
  lectures: CourseLecture[];
};

export type CourseReview = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

export type CourseInstructor = {
  name: string;
  role: string;
  bio: string;
  courses: number;
  students: number;
  rating: number;
};

export const PLATFORM_AUTHOR_ID = "front-enjoy";

export const PLATFORM_INSTRUCTOR: CourseInstructor = {
  name: "Front Enjoy",
  role: "Команда платформы",
  bio: "Курсы площадки: текстовые уроки и домашние задания с автотестами. Без видео — читаете, пишете код, сдаёте репозиторий.",
  courses: 4,
  students: 21600,
  rating: 4.8,
};

export type CoursePublisher = "platform" | "author";

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string[];
  tech: CourseTechId;
  publisher: CoursePublisher;
  authorId: string;
  grade: Grade;
  priceRub: number;
  rating: number;
  ratingCount: number;
  students: number;
  hours: number;
  updatedAt: string;
  language: string;
  badge?: "bestseller" | "new";
  learnings: string[];
  requirements: string[];
  includes: string[];
  sections: CourseSection[];
  reviews: CourseReview[];
  instructor: CourseInstructor;
};

export type CoursePriceFilter = "free" | "paid";

export type CourseRatingFilter = "3.5" | "4" | "4.5";

export type CourseSort =
  | "popular"
  | "rating"
  | "new"
  | "price-asc"
  | "price-desc";

export type CourseFilters = {
  q: string;
  grade: Grade | "";
  tech: CourseTechId | "";
  publisher: CoursePublisher | "";
  price: CoursePriceFilter | "";
  rating: CourseRatingFilter | "";
  sort: CourseSort;
};
