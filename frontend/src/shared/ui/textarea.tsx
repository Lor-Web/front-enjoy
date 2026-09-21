import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:hover:border-destructive min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[color,box-shadow,border-color] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
