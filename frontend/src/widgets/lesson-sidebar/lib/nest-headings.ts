import type { LessonHeading } from "@/entities/lesson";

export type HeadingNode = LessonHeading & {
  children: LessonHeading[];
};

export function nestHeadings(headings: LessonHeading[]): HeadingNode[] {
  const roots: HeadingNode[] = [];

  for (const heading of headings) {
    if (heading.depth === 2) {
      roots.push({ ...heading, children: [] });
      continue;
    }
    if (heading.depth === 3 && roots.length > 0) {
      roots[roots.length - 1].children.push(heading);
    }
  }

  return roots;
}
