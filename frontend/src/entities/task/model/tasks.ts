import { COUNTER_TASK } from "./counter";
import type { Task, TaskLevelId, TaskTechId } from "./types";
import { TASK_LEVELS, TASK_TECHS } from "./types";

export const TASKS: Task[] = [COUNTER_TASK];

export function findTask(slug: string) {
  return TASKS.find((task) => task.slug === slug) ?? null;
}

export function taskTechTitle(id: TaskTechId) {
  return TASK_TECHS.find((tech) => tech.id === id)?.title ?? id;
}

export function taskLevelTitle(id: TaskLevelId) {
  return TASK_LEVELS.find((level) => level.id === id)?.title ?? id;
}
