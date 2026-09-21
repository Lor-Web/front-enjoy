import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

type SwitchProps = Omit<ComponentProps<"button">, "onChange" | "role"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function Switch({
  checked,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "relative h-6 w-10 shrink-0 cursor-pointer rounded-full transition-[background-color,transform,box-shadow] outline-none hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50",
        checked ? "bg-primary" : "bg-input hover:bg-input/80",
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <span
        className={cn(
          "bg-background pointer-events-none absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

export { Switch };
