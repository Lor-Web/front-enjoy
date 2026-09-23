import { Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import type { ConsoleEntry } from "../lib/console-capture";

type TaskConsoleProps = {
  entries: ConsoleEntry[];
  onClear: () => void;
};

const LEVEL_CLASS = {
  log: "text-foreground",
  info: "text-foreground",
  warn: "text-amber-700 dark:text-amber-300",
  error: "text-red-700 dark:text-red-300",
} as const;

export function TaskConsole({ entries, onClear }: TaskConsoleProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-2 py-1">
        <p className="text-muted-foreground text-xs">Консоль</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={onClear}
        >
          <Trash2 />
          Очистить
        </Button>
      </div>
      <ol className="min-h-0 flex-1 overflow-y-auto font-mono text-xs">
        {entries.length === 0 ? (
          <li className="text-muted-foreground px-3 py-3">
            Вывод console.log из кода появится здесь.
          </li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.id}
              className={cn(
                "border-b px-3 py-1.5 whitespace-pre-wrap",
                LEVEL_CLASS[entry.level],
              )}
            >
              <span className="text-muted-foreground mr-2 uppercase">
                {entry.level}
              </span>
              {entry.message}
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
