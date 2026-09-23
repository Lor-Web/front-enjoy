import { CheckCircle2, CircleHelp, LoaderCircle, XCircle } from "lucide-react";
import { checksLabel, type HomeworkChecks } from "../model/homework";

export function HomeworkChecksStatus({ checks }: { checks: HomeworkChecks }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <ChecksIcon checks={checks} />
      {checksLabel(checks)}
    </span>
  );
}

function ChecksIcon({ checks }: { checks: HomeworkChecks }) {
  if (checks === "success") {
    return (
      <CheckCircle2
        className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      />
    );
  }
  if (checks === "failure") {
    return (
      <XCircle
        className="size-4 shrink-0 text-red-600 dark:text-red-400"
        aria-hidden
      />
    );
  }
  if (checks === "pending") {
    return (
      <LoaderCircle
        className="text-muted-foreground size-4 shrink-0 animate-spin"
        aria-hidden
      />
    );
  }
  return (
    <CircleHelp className="text-muted-foreground size-4 shrink-0" aria-hidden />
  );
}
