import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homeworkTemplateDir } from "./templates";

export function localHomeworkCheck(courseSlug: string, moduleNumber: number) {
  const dir = homeworkTemplateDir(courseSlug);
  if (!dir) {
    return null;
  }
  const file = join(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    dir,
    "fe-checks",
    `module-${moduleNumber}.mjs`,
  );
  if (!existsSync(file)) {
    return null;
  }
  return readFileSync(file, "utf8");
}
