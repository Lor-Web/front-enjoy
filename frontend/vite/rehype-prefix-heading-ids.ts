import { visit } from "unist-util-visit";
import { lessonSlugFromPath, prefixedHeadingId } from "./heading-id.ts";

type HeadingElement = {
  type: "element";
  tagName: string;
  properties?: {
    id?: unknown;
  };
};

export function rehypePrefixHeadingIds() {
  return (
    tree: unknown,
    file: { path?: string; history?: string[]; data?: unknown },
  ) => {
    const data =
      file.data && typeof file.data === "object"
        ? (file.data as { lessonSlug?: string })
        : {};
    const lessonSlug =
      data.lessonSlug || lessonSlugFromPath(file.path ?? file.history?.[0]);
    if (!lessonSlug) {
      return;
    }

    visit(tree as never, "element", (node) => {
      const element = node as HeadingElement;
      if (!/^h[1-6]$/.test(element.tagName)) {
        return;
      }
      const id = element.properties?.id;
      if (typeof id === "string" && id) {
        element.properties = {
          ...element.properties,
          id: prefixedHeadingId(lessonSlug, id),
        };
      }
    });
  };
}
