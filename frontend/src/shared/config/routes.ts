import type { To } from "react-router";
import { TRACK_VERSION_LATEST } from "./tracks";

type LessonLinkOptions = {
  view?: string;
  hash?: string;
  version?: string;
};

function linkSearch(options?: { view?: string; version?: string }) {
  const params = new URLSearchParams();
  if (options?.view && options.view !== "short") {
    params.set("view", options.view);
  }
  if (options?.version && options.version !== TRACK_VERSION_LATEST) {
    params.set("v", options.version);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

function lessonPath(slug: string) {
  return `/docs/react/${slug}`;
}

export const routes = {
  home: "/",
  catalog: "/docs/react",
  toCatalog: (version?: string): To => ({
    pathname: "/docs/react",
    search: linkSearch({ version }),
  }),
  lesson: (slug: string, options?: LessonLinkOptions) => {
    const hash = options?.hash ? `#${options.hash}` : "";
    return `${lessonPath(slug)}${linkSearch(options)}${hash}`;
  },
  toLesson: (slug: string, options?: LessonLinkOptions): To => ({
    pathname: lessonPath(slug),
    search: linkSearch(options),
    hash: options?.hash ? `#${options.hash}` : "",
  }),
  quiz: (slug: string) => `/docs/react/${slug}/quiz`,
  toQuiz: (slug: string, version?: string): To => ({
    pathname: `/docs/react/${slug}/quiz`,
    search: linkSearch({ version }),
  }),
  login: "/login",
  signup: "/signup",
  docs: "/docs",
  docsReact: "/docs/react",
  docsJavascript: "/docs/javascript",
  users: "/users",
  mentors: "/users?mentors=1",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  profile: (slug: string) => `/u/${slug}`,
  me: "/me",
  cabinet: "/cabinet",
  studentProgress: (id: string) => `/cabinet/students/${id}`,
} as const;
