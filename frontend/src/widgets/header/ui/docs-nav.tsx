import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  DOC_TECHS,
  type DocTechId,
  isDocsSection,
  isDocTechActive,
} from "@/shared/config/docs";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { TechIcon } from "@/shared/ui/tech-icon";

const itemTone: Record<
  DocTechId,
  { icon: string; idle: string; selected: string }
> = {
  react: {
    icon: "text-[#61DAFB]",
    idle: "data-[highlighted]:bg-[#61DAFB]/40 data-[highlighted]:text-foreground",
    selected:
      "bg-[#61DAFB] text-black data-[highlighted]:bg-[#61DAFB] data-[highlighted]:text-black",
  },
  javascript: {
    icon: "text-[#F7DF1E]",
    idle: "data-[highlighted]:bg-[#F7DF1E]/50 data-[highlighted]:text-foreground",
    selected:
      "bg-[#F7DF1E] text-black data-[highlighted]:bg-[#F7DF1E] data-[highlighted]:text-black",
  },
};

export function DocsNav() {
  const { pathname } = useLocation();
  const inDocs = isDocsSection(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className={cn(
          "group inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          inDocs
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
          "data-[state=open]:bg-accent data-[state=open]:text-foreground",
        )}
      >
        Документация
        <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {DOC_TECHS.map((tech) => {
          const selected = isDocTechActive(tech.id, pathname);
          const tone = itemTone[tech.id];
          return (
            <DropdownMenuItem
              key={tech.id}
              asChild
              className={cn(selected ? tone.selected : tone.idle)}
            >
              <Link to={tech.href} aria-current={selected ? "page" : undefined}>
                <TechIcon
                  id={tech.id}
                  className={cn("size-4", selected ? "text-black" : tone.icon)}
                />
                {tech.title}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
