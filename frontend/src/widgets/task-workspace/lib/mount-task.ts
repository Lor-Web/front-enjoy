import * as React from "react";
import { type ComponentType, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { compileTaskComponent, cssFromFiles } from "./compile-task";

export const TASK_FRAME_HTML = `<!doctype html>
<html>
  <head>
    <style data-task-base>
      html, body, #root { height: 100%; margin: 0; }
      body {
        font-family: system-ui, sans-serif;
        background: #fff;
        color: #111;
      }
      html.dark body { background: #151518; color: #eee; }
      #root { box-sizing: border-box; padding: 16px; }
    </style>
    <style data-task-css></style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

type MountTaskOptions = {
  files: Record<string, string>;
  entry: string;
  theme: "light" | "dark";
  console: Console;
  root: { current: Root | null };
};

export function ensureTaskDocument(iframe: HTMLIFrameElement) {
  const doc = iframe.contentDocument;
  if (!doc) {
    throw new Error("Превью не готово");
  }
  if (!doc.getElementById("root")) {
    doc.open();
    doc.write(TASK_FRAME_HTML);
    doc.close();
  }
  return doc;
}

export function mountTask(
  iframe: HTMLIFrameElement,
  options: MountTaskOptions,
) {
  const doc = ensureTaskDocument(iframe);
  doc.documentElement.classList.toggle("dark", options.theme === "dark");
  const cssNode = doc.querySelector("[data-task-css]");
  if (cssNode) {
    cssNode.textContent = cssFromFiles(options.files);
  }

  const mount = doc.getElementById("root");
  if (!mount) {
    throw new Error("В превью нет #root");
  }

  options.root.current ??= createRoot(mount);
  const source = options.files[options.entry];
  if (source === undefined) {
    throw new Error(`Нет файла ${options.entry}`);
  }
  const App = compileTaskComponent(source, React, options.console);
  options.root.current.render(createElement(App as ComponentType));
}

export function unmountTask(root: { current: Root | null }) {
  root.current?.unmount();
  root.current = null;
}
