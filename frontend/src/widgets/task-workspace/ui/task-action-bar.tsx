import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  LoaderCircle,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import type { TaskTestResult } from "../lib/run-task-tests";

type TaskActionBarProps = {
  running: boolean;
  canReset: boolean;
  results: TaskTestResult[] | null;
  onReset: () => void;
  onSubmit: () => void;
};

export function TaskActionBar({
  running,
  canReset,
  results,
  onReset,
  onSubmit,
}: TaskActionBarProps) {
  const [open, setOpen] = useState(true);
  const passed = results?.filter((item) => item.ok).length ?? 0;
  const total = results?.length ?? 0;
  const allOk = results !== null && passed === total;

  useEffect(() => {
    if (results) {
      setOpen(true);
    }
  }, [results]);

  return (
    <div className="bg-background shrink-0 border-t">
      {results && open ? (
        <ul className="max-h-40 overflow-y-auto border-b px-3 py-2 text-sm sm:px-4">
          {results.map((item) => (
            <li key={item.id} className="flex items-start gap-2 py-1">
              {item.ok ? (
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <XCircle
                  className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400"
                  aria-hidden
                />
              )}
              <span>
                {item.title}
                {item.message ? (
                  <span className="text-muted-foreground mt-0.5 block text-xs">
                    {item.message}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canReset}
          onClick={onReset}
        >
          <RotateCcw />
          Сбросить код
        </Button>
        {results ? (
          <button
            type="button"
            className="hover:bg-accent flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <ChevronDown className="size-4 shrink-0" />
            ) : (
              <ChevronRight className="size-4 shrink-0" />
            )}
            <span
              className={cn(
                "truncate",
                allOk
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-red-700 dark:text-red-400",
              )}
            >
              {allOk
                ? `Тесты пройдены · ${passed} из ${total}`
                : `Тесты не пройдены · ${passed} из ${total}`}
            </span>
          </button>
        ) : null}
        <Button
          type="button"
          size="sm"
          className="ml-auto"
          disabled={running}
          onClick={onSubmit}
        >
          {running ? <LoaderCircle className="animate-spin" /> : <Play />}
          Отправить на проверку
        </Button>
      </div>
    </div>
  );
}
