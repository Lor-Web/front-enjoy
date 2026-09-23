import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  filterTasks,
  formatTasks,
  TASK_LEVELS,
  TASK_TECHS,
  TASKS,
  TaskCard,
  type TaskFilters,
  type TaskLevelId,
  type TaskTechId,
  useTasksProgress,
} from "@/entities/task";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { AppShell } from "@/widgets/app-shell";
import { TaskFiltersForm } from "./task-filters";

const TECHS = new Set<TaskTechId>(TASK_TECHS.map((item) => item.id));
const LEVELS = new Set<TaskLevelId>(TASK_LEVELS.map((item) => item.id));
const STATUSES = new Set<TaskFilters["status"]>(["open", "done"]);

function readFilters(params: URLSearchParams): TaskFilters {
  const tech = params.get("tech") ?? "";
  const level = params.get("level") ?? "";
  const status = params.get("status") ?? "";
  return {
    q: params.get("q") ?? "",
    tech: TECHS.has(tech as TaskTechId) ? (tech as TaskTechId) : "",
    level: LEVELS.has(level as TaskLevelId) ? (level as TaskLevelId) : "",
    status: STATUSES.has(status as TaskFilters["status"])
      ? (status as TaskFilters["status"])
      : "",
  };
}

function writeFilters(
  setParams: ReturnType<typeof useSearchParams>[1],
  filters: TaskFilters,
) {
  setParams(
    (current) => {
      const next = new URLSearchParams(current);
      setOrDelete(next, "q", filters.q);
      setOrDelete(next, "tech", filters.tech);
      setOrDelete(next, "level", filters.level);
      setOrDelete(next, "status", filters.status);
      return next;
    },
    { replace: true },
  );
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const { q, tech, level, status } = filters;
  const [qInput, setQInput] = useState(q);
  const progress = useTasksProgress();

  useEffect(() => {
    setQInput(q);
  }, [q]);

  useEffect(() => {
    const next = qInput.trim();
    if (next === q) {
      return;
    }
    const timer = window.setTimeout(() => {
      writeFilters(setSearchParams, { q: next, tech, level, status });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [qInput, q, tech, level, status, setSearchParams]);

  const visible = filterTasks(TASKS, filters, progress);
  const hasExtraFilters = Boolean(
    filters.tech || filters.level || filters.status,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-3xl sm:text-4xl">Задачи</h1>
        <p className="text-muted-foreground mb-6 text-[17px] leading-7">
          Короткие упражнения в браузере: пишете код, смотрите превью и
          проверяете тестами.
        </p>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <Input
              icon={Search}
              value={qInput}
              onChange={(event) => setQInput(event.target.value)}
              placeholder="Название задачи"
              aria-label="Поиск задач по названию"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter />
                Фильтры
                {hasExtraFilters ? (
                  <span className="bg-primary size-1.5 rounded-full" />
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto p-4">
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <TaskFiltersForm
                  idPrefix="mobile"
                  filters={filters}
                  onChange={(next) => writeFilters(setSearchParams, next)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-52 shrink-0 lg:block">
            <TaskFiltersForm
              idPrefix="desktop"
              filters={filters}
              onChange={(next) => writeFilters(setSearchParams, next)}
            />
          </aside>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-3 text-sm">
              {formatTasks(visible.length)}
            </p>
            {visible.length === 0 ? (
              <p className="text-muted-foreground border-y py-10 text-sm">
                Нет задач по этим фильтрам. Сбросьте уровень или прогресс.
              </p>
            ) : (
              <ul className="divide-y border-y">
                {visible.map((task) => (
                  <li key={task.slug}>
                    <TaskCard
                      task={task}
                      done={Boolean(progress[task.slug]?.done)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
