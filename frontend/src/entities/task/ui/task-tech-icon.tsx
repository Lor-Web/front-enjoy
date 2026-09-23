import type { SVGProps } from "react";
import { siReact } from "simple-icons";
import { TASK_TECHS, type TaskTechId } from "../model/types";

const ICONS = {
  react: siReact,
} as const;

type TaskTechIconProps = SVGProps<SVGSVGElement> & {
  tech: TaskTechId;
};

export function TaskTechIcon({ tech, style, ...props }: TaskTechIconProps) {
  const meta = TASK_TECHS.find((item) => item.id === tech);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={{ color: meta?.hex, ...style }}
      {...props}
    >
      <path d={ICONS[tech].path} />
    </svg>
  );
}
