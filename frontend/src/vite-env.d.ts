/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const headings: Array<{
    id: string;
    text: string;
    depth: 2 | 3;
  }>;
  export const readingMinutes: number;

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
