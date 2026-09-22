export const COURSE_HOMEWORK_REPOS: Record<string, string> = {
  "react-s-nulya": "hw-react-s-nulya",
  "javascript-stazher": "hw-javascript-stazher",
  "react-sostoyanie": "hw-react-sostoyanie",
  "typescript-dlya-react": "hw-typescript-dlya-react",
  "javascript-async": "hw-javascript-async",
  "react-formy-i-dannye": "hw-react-formy-i-dannye",
};

export function homeworkRepoName(courseSlug: string) {
  return COURSE_HOMEWORK_REPOS[courseSlug] ?? null;
}
