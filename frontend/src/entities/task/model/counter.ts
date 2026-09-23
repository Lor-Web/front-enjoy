import type { Task } from "./types";

const SOLUTION_APP = `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Кликов: {count}
      </button>
    </div>
  );
}
`;

export const COUNTER_TASK: Task = {
  slug: "counter",
  title: "Счётчик",
  tech: "react",
  level: "easy",
  summary: "Соберите счётчик кликов на React.",
  description: [
    {
      type: "p",
      text: "Соберите простой счётчик. Кнопка показывает, сколько раз по ней кликнули. Стартовый код уже есть — допишите состояние.",
    },
    {
      type: "h2",
      text: "Что должно получиться",
    },
    {
      type: "ul",
      items: [
        "На кнопке текст «Кликов: N», где N — число кликов.",
        "В начале N равно 0.",
        "Каждый клик увеличивает N на 1.",
      ],
    },
  ],
  hint: [
    {
      type: "p",
      text: "Число кликов должно жить между перерисовками. В функциональном компоненте для этого нужен useState.",
    },
    {
      type: "p",
      text: "Заведите состояние со стартом 0 и в onClick вызывайте сеттер с новым значением. В разметке кнопки подставьте это состояние вместо нуля.",
    },
  ],
  solution: [
    {
      type: "p",
      text: "Один useState хранит счётчик. Клик вызывает setCount с предыдущим значением плюс один, а кнопка показывает актуальное число.",
    },
    {
      type: "code",
      lang: "jsx",
      text: SOLUTION_APP.trim(),
    },
  ],
  files: [
    {
      path: "/package.json",
      readOnly: true,
      code: `{
  "name": "counter",
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
    <title>Счётчик</title>
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
      code: `export default function App() {
  return (
    <div>
      <button>Кликов: 0</button>
    </div>
  );
}
`,
    },
    {
      path: "/src/styles.css",
      code: `button {
  font: inherit;
  padding: 8px 14px;
  cursor: pointer;
}
`,
    },
  ],
  entry: "/src/App.js",
  activeFile: "/src/App.js",
  tests: [
    {
      id: "initial",
      title: "В начале на кнопке «Кликов: 0»",
      run: ({ text }) => {
        if (text("button") !== "Кликов: 0") {
          throw new Error("Ожидали «Кликов: 0»");
        }
      },
    },
    {
      id: "one-click",
      title: "После клика на кнопке «Кликов: 1»",
      run: ({ click, text }) => {
        click("button");
        if (text("button") !== "Кликов: 1") {
          throw new Error("Ожидали «Кликов: 1»");
        }
      },
    },
    {
      id: "four-clicks",
      title: "После четырёх кликов на кнопке «Кликов: 4»",
      run: ({ click, text }) => {
        click("button", 4);
        if (text("button") !== "Кликов: 4") {
          throw new Error("Ожидали «Кликов: 4»");
        }
      },
    },
  ],
};
