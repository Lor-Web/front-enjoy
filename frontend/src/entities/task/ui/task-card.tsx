import { Check } from "lucide-react";
import { Link } from "react-router";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { taskLevelTitle, taskTechTitle } from "../model/tasks";
import type { Task } from "../model/types";
import { TaskLevelIcon } from "./task-level-icon";
import { TaskTechIcon } from "./task-tech-icon";

type TaskCardProps = {
  task: Task;
  done: boolean;
};

export function TaskCard({ task, done }: TaskCardProps) {
  return (
    <Link
      to={routes.task(task.slug)}
      className="hover:bg-accent/40 -mx-3 flex flex-col gap-2 rounded-lg px-3 py-4 transition-colors"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[17px] leading-6 font-semibold">{task.title}</h2>
        {done ? (
          <Badge variant="success" className="gap-1.5">
            <Check className="size-3" />
            Выполнена
          </Badge>
        ) : null}
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm leading-5">
        {task.summary}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <TaskTechIcon tech={task.tech} className="size-3.5" />
          {taskTechTitle(task.tech)}
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <TaskLevelIcon level={task.level} className="size-3.5" />
          {taskLevelTitle(task.level)}
        </Badge>
      </div>
    </Link>
  );
}
