export const COURSE_HOMEWORK_REPOS: Record<string, string> = {
  polka: "hw-polka",
};

export function homeworkRepoName(courseSlug: string) {
  return COURSE_HOMEWORK_REPOS[courseSlug] ?? null;
}
