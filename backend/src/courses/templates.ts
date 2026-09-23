export const COURSE_HOMEWORK_REPOS: Record<string, string> = {
  polka: "front-enjoy-polka",
};

const COURSE_HOMEWORK_MODULES: Record<string, string[]> = {
  polka: ["vite", "komponenty", "sostoyanie", "hooki", "memo", "routing"],
};

const COURSE_HOMEWORK_DIRS: Record<string, string> = {
  polka: "hw-polka",
};

export function homeworkRepoName(courseSlug: string) {
  return COURSE_HOMEWORK_REPOS[courseSlug] ?? null;
}

export function homeworkModuleNumber(courseSlug: string, moduleSlug: string) {
  const modules = COURSE_HOMEWORK_MODULES[courseSlug];
  if (!modules) {
    return null;
  }
  const index = modules.indexOf(moduleSlug);
  return index >= 0 ? index + 1 : null;
}

export function homeworkTemplateDir(courseSlug: string) {
  return COURSE_HOMEWORK_DIRS[courseSlug] ?? null;
}
