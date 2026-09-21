import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import { remarkExportHeadings } from "./vite/remark-export-headings.ts";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkExportHeadings,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              keepBackground: false,
              theme: {
                light: "github-light",
                dark: "github-dark",
              },
            },
          ],
        ],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
});
