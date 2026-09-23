import type { Task, TaskFile } from "../model/types";

export function taskCodes(files: TaskFile[]) {
  return Object.fromEntries(files.map((file) => [file.path, file.code]));
}

export function visibleTaskFiles(task: Task) {
  return task.files.filter((file) => !file.hidden);
}

export function findTaskFile(task: Task, path: string) {
  return task.files.find((file) => file.path === path) ?? null;
}

export function taskCodesDiffer(
  codes: Record<string, string> | undefined,
  files: TaskFile[],
) {
  if (!codes) {
    return false;
  }
  return files.some((file) => (codes[file.path] ?? file.code) !== file.code);
}
