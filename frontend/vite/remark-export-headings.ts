import { valueToEstree } from "estree-util-value-to-estree";
import GithubSlugger from "github-slugger";
import type { Heading, Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import { define } from "unist-util-mdx-define";
import { visit } from "unist-util-visit";
import {
  countWords,
  estimateLessonMinutes,
} from "../src/shared/lib/reading-time.ts";
import { lessonSlugFromPath, prefixedHeadingId } from "./heading-id.ts";

export type ExportedHeading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export function remarkExportHeadings() {
  return (tree: Root, file: Parameters<typeof define>[1]) => {
    const slugger = new GithubSlugger();
    const headings: ExportedHeading[] = [];
    const lessonSlug = lessonSlugFromPath(file.path ?? file.history?.[0]);
    Object.assign(file.data, { lessonSlug });
    let words = 0;
    let codeBlocks = 0;

    visit(tree, "heading", (node: Heading) => {
      if (node.depth !== 2 && node.depth !== 3) {
        return;
      }
      const text = mdastToString(node).trim();
      headings.push({
        id: prefixedHeadingId(lessonSlug, slugger.slug(text)),
        text,
        depth: node.depth,
      });
    });

    visit(tree, "text", (node) => {
      words += countWords(node.value);
    });

    visit(tree, "code", () => {
      codeBlocks += 1;
    });

    define(tree, file, {
      headings: valueToEstree(headings, { preserveReferences: true }),
      readingMinutes: valueToEstree(estimateLessonMinutes(words, codeBlocks), {
        preserveReferences: true,
      }),
    });
  };
}
