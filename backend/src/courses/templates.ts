export const COURSE_HOMEWORK_REPOS: Record<string, string> = {
  polka: "front-enjoy-polka",
};

export function homeworkRepoName(courseSlug: string) {
  return COURSE_HOMEWORK_REPOS[courseSlug] ?? null;
}
