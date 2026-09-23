import { reactSandboxFiles } from "../lib/react-sandbox";
import type { Task } from "./types";

const SOLUTION = `import { useState } from "react";

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
    { type: "code", lang: "jsx", text: SOLUTION.trim() },
  ],
  files: reactSandboxFiles({
    name: "counter",
    title: "Счётчик",
    app: `export default function App() {
  return (
    <div>
      <button>Кликов: 0</button>
    </div>
  );
}
`,
  }),
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
