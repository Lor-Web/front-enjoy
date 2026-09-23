import type { TaskFile } from "../model/types";

const DEFAULT_CSS = `button {
  font: inherit;
  padding: 8px 14px;
  cursor: pointer;
}
`;

export function reactSandboxFiles(options: {
  name: string;
  title: string;
  app: string;
  css?: string;
}): TaskFile[] {
  return [
    {
      path: "/package.json",
      readOnly: true,
      code: `{
  "name": "${options.name}",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
`,
    },
    {
      path: "/public/index.html",
      readOnly: true,
      code: `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>${options.title}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`,
    },
    {
      path: "/src/index.js",
      readOnly: true,
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
    },
    {
      path: "/src/App.js",
      code: options.app,
    },
    {
      path: "/src/styles.css",
      code: options.css ?? DEFAULT_CSS,
    },
  ];
}
