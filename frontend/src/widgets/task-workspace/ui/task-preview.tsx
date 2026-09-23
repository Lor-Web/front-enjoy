import { useAtomValue } from "jotai";
import { useEffect, useId, useRef, useState } from "react";
import { themeAtom } from "@/features/toggle-theme";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  type ConsoleEntry,
  createConsoleCapture,
} from "../lib/console-capture";
import { mountTask, unmountTask } from "../lib/mount-task";
import { TaskConsole } from "./task-console";

type TaskPreviewProps = {
  files: Record<string, string>;
  entry: string;
  showConsole: boolean;
  onToggleConsole: () => void;
};

export function TaskPreview({
  files,
  entry,
  showConsole,
  onToggleConsole,
}: TaskPreviewProps) {
  const theme = useAtomValue(themeAtom);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rootRef = useRef(null);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const nextId = useId();
  const logCount = useRef(0);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    setEntries([]);
    logCount.current = 0;

    const taskConsole = createConsoleCapture((entry) => {
      logCount.current += 1;
      setEntries((current) => [
        ...current,
        { ...entry, id: `${nextId}-${logCount.current}` },
      ]);
    });

    try {
      mountTask(iframe, {
        files,
        entry,
        theme,
        console: taskConsole,
        root: rootRef,
      });
      setError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setError(message);
      logCount.current += 1;
      setEntries((current) => [
        ...current,
        { id: `${nextId}-${logCount.current}`, level: "error", message },
      ]);
    }
  }, [entry, files, nextId, theme]);

  useEffect(() => {
    return () => {
      unmountTask(rootRef);
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-end border-b px-2 py-1">
        <Button
          type="button"
          variant={showConsole ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7",
            entries.some((item) => item.level === "error") &&
              !showConsole &&
              "text-destructive",
          )}
          onClick={onToggleConsole}
        >
          Консоль
          {entries.length > 0 ? (
            <span className="text-muted-foreground tabular-nums">
              {entries.length}
            </span>
          ) : null}
        </Button>
      </div>
      <div className="relative min-h-0 flex-1">
        <iframe
          ref={iframeRef}
          title="Превью"
          sandbox="allow-scripts allow-same-origin"
          className="h-full w-full border-0 bg-background"
        />
        {error ? (
          <p className="text-destructive sr-only" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      {showConsole ? (
        <div className="h-40 shrink-0 border-t">
          <TaskConsole entries={entries} onClear={() => setEntries([])} />
        </div>
      ) : null}
    </div>
  );
}
