import type { ReactNode } from "react";

const INLINE_CODE_CLASS =
  "bg-muted rounded px-1.5 py-0.5 font-mono text-[0.9em]";

export function InlineMarkup({ text }: { text: string }) {
  return parseLinks(text);
}

function parseLinks(text: string) {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let match = pattern.exec(text);
  let chunk = 0;
  while (match) {
    if (match.index > last) {
      nodes.push(...parseCode(text.slice(last, match.index), `c${chunk}`));
    }
    nodes.push(
      <a
        key={`l${match.index}`}
        href={match[2]}
        className="text-primary underline-offset-4 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {match[1]}
      </a>,
    );
    last = match.index + match[0].length;
    chunk += 1;
    match = pattern.exec(text);
  }
  if (last < text.length) {
    nodes.push(...parseCode(text.slice(last), `c${chunk}`));
  }
  return nodes;
}

function parseCode(text: string, prefix: string) {
  const nodes: ReactNode[] = [];
  const pattern = /`([^`]+)`/g;
  let last = 0;
  let match = pattern.exec(text);
  let index = 0;
  while (match) {
    if (match.index > last) {
      nodes.push(
        ...parseBold(text.slice(last, match.index), `${prefix}b${index}`),
      );
    }
    nodes.push(
      <code key={`${prefix}-${index}`} className={INLINE_CODE_CLASS}>
        {match[1]}
      </code>,
    );
    last = match.index + match[0].length;
    index += 1;
    match = pattern.exec(text);
  }
  if (last < text.length) {
    nodes.push(...parseBold(text.slice(last), `${prefix}b${index}`));
  }
  return nodes;
}

function parseBold(text: string, prefix: string) {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let match = pattern.exec(text);
  let index = 0;
  while (match) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    nodes.push(
      <strong key={`${prefix}-${index}`} className="font-semibold">
        {match[1]}
      </strong>,
    );
    last = match.index + match[0].length;
    index += 1;
    match = pattern.exec(text);
  }
  if (last < text.length) {
    nodes.push(text.slice(last));
  }
  return nodes;
}
