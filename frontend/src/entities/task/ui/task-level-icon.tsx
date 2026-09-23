import { Flame, Skull, Sprout, Zap } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { TaskLevelId } from "../model/types";

const LEVELS = {
  easy: { icon: Sprout, className: "text-emerald-600 dark:text-emerald-400" },
  medium: { icon: Zap, className: "text-amber-600 dark:text-amber-400" },
  hard: { icon: Flame, className: "text-orange-600 dark:text-orange-400" },
  expert: { icon: Skull, className: "text-red-600 dark:text-red-400" },
} as const;

type TaskLevelIconProps = {
  level: TaskLevelId;
  className?: string;
};

export function TaskLevelIcon({ level, className }: TaskLevelIconProps) {
  const { icon: Icon, className: tone } = LEVELS[level];
  return <Icon aria-hidden className={cn(tone, className)} />;
}
