import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { gradeLabel } from "../lib/profile-fields";
import type { Grade } from "../model/types";

const gradeClass: Record<Grade, string> = {
  intern: "border-transparent bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
  junior:
    "border-transparent bg-emerald-500/15 text-emerald-800 dark:text-emerald-400",
  middle:
    "border-transparent bg-orange-500/20 text-orange-800 dark:text-orange-400",
  senior:
    "border-transparent bg-violet-500/15 text-violet-800 dark:text-violet-400",
  lead: "border-transparent bg-amber-500/20 text-amber-800 dark:text-amber-400",
};

type GradeBadgeProps = {
  grade: Grade | null | undefined;
  className?: string;
};

export function GradeBadge({ grade, className }: GradeBadgeProps) {
  const label = gradeLabel(grade);
  if (!grade || !label) {
    return null;
  }
  return <Badge className={cn(gradeClass[grade], className)}>{label}</Badge>;
}
