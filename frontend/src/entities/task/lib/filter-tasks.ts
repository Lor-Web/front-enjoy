import type { TaskProgressMap } from "../model/task-progress";
import type { Task, TaskFilters, TaskLevelId } from "../model/types";

const LEVEL_ORDER: Record<TaskLevelId, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  expert: 3,
};

export function filterTasks(
  tasks: Task[],
  filters: TaskFilters,
  progress: TaskProgressMap,
) {
  const query = filters.q.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    if (query) {
      const haystack = `${task.title} ${task.summary}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (filters.tech && task.tech !== filters.tech) {
      return false;
    }
    if (filters.level && task.level !== filters.level) {
      return false;
    }
    const done = Boolean(progress[task.slug]?.done);
    if (filters.status === "done" && !done) {
      return false;
    }
    if (filters.status === "open" && done) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    const byLevel = LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
    if (byLevel !== 0) {
      return byLevel;
    }
    return a.title.localeCompare(b.title, "ru");
  });
}

export function formatTasks(count: number) {
  return `${count} ${plural(count, "задача", "задачи", "задач")}`;
}

function plural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }
  return many;
}
