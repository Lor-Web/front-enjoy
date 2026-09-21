import type { ComponentProps, ElementType } from "react";
import { cn } from "@/shared/lib/utils";
import { CopyLinkButton } from "@/shared/ui/copy-link-button";

type ArticleHeadingProps = ComponentProps<"h1"> & {
  as?: ElementType;
};

export function ArticleHeading({
  as: Tag = "h1",
  id,
  className,
  children,
  ...props
}: ArticleHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn("group flex items-center gap-1.5", className)}
      {...props}
    >
      <span className="min-w-0">{children}</span>
      <CopyLinkButton hash={id} />
    </Tag>
  );
}
