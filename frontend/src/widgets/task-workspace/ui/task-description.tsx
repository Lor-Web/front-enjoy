import { Check, Lock } from "lucide-react";
import { useState } from "react";
import {
  TASK_HINT_AFTER,
  TASK_SOLUTION_AFTER,
  type Task,
  type TaskBlock,
  TaskLevelIcon,
  TaskTechIcon,
  taskLevelTitle,
  taskTechTitle,
} from "@/entities/task";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { CodeBlock } from "@/shared/ui/code-block";
import { InlineMarkup } from "@/shared/ui/inline-markup";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type TabId = "description" | "hint" | "solution";

const TABS: {
  id: TabId;
  label: string;
  after?: number;
}[] = [
  { id: "description", label: "Описание" },
  { id: "hint", label: "Подсказка", after: TASK_HINT_AFTER },
  { id: "solution", label: "Решение", after: TASK_SOLUTION_AFTER },
];

type TaskDescriptionProps = {
  task: Task;
  fails: number;
  done: boolean;
};

export function TaskDescription({ task, fails, done }: TaskDescriptionProps) {
  const [tab, setTab] = useState<TabId>("description");
  const [lockTip, setLockTip] = useState<TabId | null>(null);

  const blocks =
    tab === "hint"
      ? task.hint
      : tab === "solution"
        ? task.solution
        : task.description;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-4 pt-5 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <TaskTechIcon tech={task.tech} className="size-3.5" />
            {taskTechTitle(task.tech)}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <TaskLevelIcon level={task.level} className="size-3.5" />
            {taskLevelTitle(task.level)}
          </Badge>
          {done ? (
            <Badge variant="success" className="gap-1.5">
              <Check className="size-3" />
              Выполнена
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-3 text-2xl leading-tight sm:text-3xl">
          {task.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {task.summary}
        </p>
        <div
          role="tablist"
          aria-label="Материалы задачи"
          className="mt-5 flex flex-wrap gap-x-1 border-b"
        >
          {TABS.map((item) => {
            const locked = Boolean(item.after && fails < item.after);
            const selected = tab === item.id;
            const tabButton = (
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                aria-disabled={locked}
                className={cn(
                  "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm",
                  selected
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground",
                  locked
                    ? "pointer-events-none cursor-not-allowed opacity-60"
                    : "hover:text-foreground",
                )}
                onClick={() => {
                  if (!locked) {
                    setTab(item.id);
                  }
                }}
              >
                {locked ? <Lock className="size-3.5" aria-hidden /> : null}
                {item.label}
              </button>
            );
            if (!locked || !item.after) {
              return <span key={item.id}>{tabButton}</span>;
            }
            return (
              <Tooltip
                key={item.id}
                delayDuration={0}
                open={lockTip === item.id}
                onOpenChange={(open) => setLockTip(open ? item.id : null)}
              >
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex"
                    onPointerEnter={() => setLockTip(item.id)}
                    onPointerLeave={() => setLockTip(null)}
                  >
                    {tabButton}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {lockReason(item.id, item.after, fails)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
        <TaskBlocks blocks={blocks} />
      </div>
    </div>
  );
}

function lockReason(id: TabId, after: number, fails: number) {
  const name = id === "solution" ? "Авторское решение" : "Подсказка";
  const left = after - fails;
  if (left <= 1) {
    return `${name} откроется после ещё одной неверной попытки`;
  }
  return `${name} откроется после ${after} неверных попыток`;
}

function TaskBlocks({ blocks }: { blocks: TaskBlock[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-7">
      {blocks.map((block) => {
        if (block.type === "h2") {
          return (
            <h2 key={block.text} className="pt-2 text-lg">
              {block.text}
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={block.items.join()} className="list-disc space-y-1.5 pl-5">
              {block.items.map((item) => (
                <li key={item}>
                  <InlineMarkup text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "code") {
          return (
            <CodeBlock key={block.text} data-language={block.lang ?? "jsx"}>
              {block.text}
            </CodeBlock>
          );
        }
        return (
          <p key={block.text}>
            <InlineMarkup text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
