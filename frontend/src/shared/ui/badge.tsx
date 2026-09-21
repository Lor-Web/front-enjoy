import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "outline" | "success";
}) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variant === "default" &&
          "border-transparent bg-primary text-primary-foreground",
        variant === "secondary" &&
          "border-transparent bg-secondary text-secondary-foreground",
        variant === "outline" && "text-foreground",
        variant === "success" &&
          "border-transparent bg-primary/15 text-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
