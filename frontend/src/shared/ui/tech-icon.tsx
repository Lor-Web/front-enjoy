import type { SVGProps } from "react";
import { type SimpleIcon, siJavascript, siReact } from "simple-icons";
import type { DocTechId } from "@/shared/config/docs";

const icons: Record<DocTechId, SimpleIcon> = {
  react: siReact,
  javascript: siJavascript,
};

type TechIconProps = SVGProps<SVGSVGElement> & {
  id: DocTechId;
};

export function TechIcon({ id, ...props }: TechIconProps) {
  const icon = icons[id];
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d={icon.path} />
    </svg>
  );
}
