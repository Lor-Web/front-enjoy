import type { ComponentType } from "react";
import { transform } from "sucrase";

const HOOKS = `const { useState, useEffect, useMemo, useRef, useCallback, useReducer, useId, Fragment } = React;`;

function stripReactImports(source: string) {
  return source.replace(
    /^import\s+[\s\S]*?from\s+['"]react(?:\/[^'"]+)?['"]\s*;?\s*$/gm,
    "",
  );
}

export function cssFromFiles(files: Record<string, string>) {
  return Object.entries(files)
    .filter(([path]) => path.endsWith(".css"))
    .map(([, code]) => code)
    .join("\n");
}

export function compileTaskComponent(
  source: string,
  React: typeof import("react"),
  console: Console,
): ComponentType {
  const js = transform(stripReactImports(source), {
    transforms: ["jsx"],
  }).code;
  const body = js.replace(/export\s+default\s+/, "return ");
  const factory = new Function(
    "React",
    "console",
    `"use strict";\n${HOOKS}\n${body}`,
  ) as (react: typeof React, taskConsole: Console) => ComponentType;
  const component = factory(React, console);
  if (typeof component !== "function") {
    throw new Error("Нужен export default компонента");
  }
  return component;
}
