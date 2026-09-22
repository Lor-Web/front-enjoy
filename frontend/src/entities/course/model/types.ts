import type { Grade } from "@/entities/user";

export const COURSE_TECHS = [
  { id: "react", title: "React", hex: "#61DAFB" },
  { id: "javascript", title: "JavaScript", hex: "#F7DF1E" },
  { id: "typescript", title: "TypeScript", hex: "#3178C6" },
] as const;

export type CourseTechId = (typeof COURSE_TECHS)[number]["id"];

export type CoursePublisher = "platform" | "author";

export type CourseQuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type CourseWork =
  | {
      type: "quiz";
      title: string;
      questions: CourseQuizQuestion[];
    }
  | {
      type: "task";
      title: string;
      criteria: string[];
    }
  | {
      type: "homework";
      title: string;
      branch: string;
    };

export type CourseBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang?: string; text: string };

export type CourseSection = {
  slug: string;
  title: string;
  summary: string;
  body: CourseBlock[];
  work?: CourseWork;
};

export type CourseModule = {
  slug: string;
  title: string;
  summary: string;
  sections: CourseSection[];
};

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string[];
  tech: CourseTechId;
  publisher: CoursePublisher;
  authorId: string;
  authorName: string;
  grade: Grade;
  language: string;
  requirements: string[];
  learnings: string[];
  modules: CourseModule[];
};

export type CourseSort = "new" | "title";

export type CourseFilters = {
  q: string;
  grade: Grade | "";
  tech: CourseTechId | "";
  publisher: CoursePublisher | "";
  sort: CourseSort;
};

export const PLATFORM_AUTHOR_ID = "front-enjoy";
