import type { To } from "react-router";

function lessonSearch(view?: string) {
  if (!view || view === "short") {
    return "";
  }
  return `?view=${view}`;
}

function lessonPath(slug: string) {
  return `/learn/react/${slug}`;
}

export const routes = {
  home: "/",
  catalog: "/learn/react",
  lesson: (slug: string, options?: { view?: string; hash?: string }) => {
    const hash = options?.hash ? `#${options.hash}` : "";
    return `${lessonPath(slug)}${lessonSearch(options?.view)}${hash}`;
  },
  toLesson: (slug: string, options?: { view?: string; hash?: string }): To => ({
    pathname: lessonPath(slug),
    search: lessonSearch(options?.view),
    hash: options?.hash ? `#${options.hash}` : "",
  }),
  quiz: (slug: string) => `/learn/react/${slug}/quiz`,
  login: "/login",
  signup: "/signup",
  users: "/users",
  mentors: "/users?mentors=1",
  profile: (slug: string) => `/u/${slug}`,
  me: "/me",
  cabinet: "/cabinet",
  studentProgress: (id: string) => `/cabinet/students/${id}`,
} as const;
