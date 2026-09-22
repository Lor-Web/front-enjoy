import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type CourseRatingProps = {
  value: number;
  count?: number;
  className?: string;
};

export function CourseRating({ value, count, className }: CourseRatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="text-sm font-semibold tabular-nums text-amber-700 dark:text-amber-400">
        {value.toFixed(1)}
      </span>
      <span className="flex gap-px" aria-hidden>
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.min(1, Math.max(0, value - index));
          return (
            <span key={index} className="relative size-3.5">
              <Star className="text-muted-foreground/25 size-3.5" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
              </span>
            </span>
          );
        })}
      </span>
      {count !== undefined ? (
        <span className="text-muted-foreground text-xs">
          ({count.toLocaleString("ru-RU")})
        </span>
      ) : null}
    </span>
  );
}
