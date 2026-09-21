import type { ComponentProps, ComponentType, SVGProps } from "react";
import { cn } from "@/shared/lib/utils";

type InputProps = ComponentProps<"input"> & {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

function Input({ className, icon: Icon, ...props }: InputProps) {
  const input = (
    <input
      data-slot="input"
      className={cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:hover:border-destructive read-only:bg-muted/40 read-only:hover:border-input h-9 w-full rounded-md border px-3 text-sm outline-none transition-[color,box-shadow,border-color] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
        Icon && "pl-9",
        className,
      )}
      {...props}
    />
  );

  if (!Icon) {
    return input;
  }

  return (
    <div className="relative">
      <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      {input}
    </div>
  );
}

export { Input };
