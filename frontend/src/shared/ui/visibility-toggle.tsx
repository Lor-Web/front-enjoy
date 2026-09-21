import { Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type VisibilityToggleProps = {
  label: string;
  visible: boolean;
  onChange: (visible: boolean) => void;
};

export function VisibilityToggle({
  label,
  visible,
  onChange,
}: VisibilityToggleProps) {
  const hint = visible ? "Видно в профиле" : "Скрыто в профиле";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 active:bg-accent/80 rounded-md p-1 transition-colors outline-none focus-visible:ring-[3px]"
          aria-pressed={visible}
          aria-label={`${label}: ${hint.toLowerCase()}`}
          onClick={() => onChange(!visible)}
        >
          {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  );
}
