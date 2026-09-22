import type { ReactNode } from "react";

const INLINE_CODE_CLASS =
  "bg-muted rounded px-1.5 py-0.5 font-mono text-[0.9em]";

export function InlineMarkup({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const pattern = /`([^`]+)`/g;
  let last = 0;
  let match = pattern.exec(text);
  while (match) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    nodes.push(
      <code key={match.index} className={INLINE_CODE_CLASS}>
        {match[1]}
      </code>,
    );
    last = match.index + match[0].length;
    match = pattern.exec(text);
  }
  if (last < text.length) {
    nodes.push(text.slice(last));
  }
  return nodes;
}
