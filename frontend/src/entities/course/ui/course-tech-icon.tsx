import type { SVGProps } from "react";
import {
  type SimpleIcon,
  siJavascript,
  siReact,
  siTypescript,
} from "simple-icons";
import type { CourseTechId } from "../model/types";

const icons: Record<CourseTechId, SimpleIcon> = {
  react: siReact,
  javascript: siJavascript,
  typescript: siTypescript,
};

type CourseTechIconProps = SVGProps<SVGSVGElement> & {
  id: CourseTechId;
};

export function CourseTechIcon({ id, ...props }: CourseTechIconProps) {
  const icon = icons[id];
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d={icon.path} />
    </svg>
  );
}
