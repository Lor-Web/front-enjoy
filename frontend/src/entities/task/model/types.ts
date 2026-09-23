export const TASK_TECHS = [
  { id: "react", title: "React", hex: "#61DAFB" },
] as const;

export type TaskTechId = (typeof TASK_TECHS)[number]["id"];

export const TASK_LEVELS = [
  { id: "easy", title: "Легкий" },
  { id: "medium", title: "Средний" },
  { id: "hard", title: "Сложный" },
  { id: "expert", title: "Очень сложный" },
] as const;

export type TaskLevelId = (typeof TASK_LEVELS)[number]["id"];

export const TASK_HINT_AFTER = 2;
export const TASK_SOLUTION_AFTER = 5;

export type TaskBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang?: string; text: string };

export type TaskFile = {
  path: string;
  code: string;
  hidden?: boolean;
  readOnly?: boolean;
};

export type TaskTestContext = {
  document: Document;
  window: Window;
  click: (selector: string, times?: number) => void;
  text: (selector: string) => string;
};

export type TaskTest = {
  id: string;
  title: string;
  run: (ctx: TaskTestContext) => void;
};

export type Task = {
  slug: string;
  title: string;
  tech: TaskTechId;
  level: TaskLevelId;
  summary: string;
  description: TaskBlock[];
  hint: TaskBlock[];
  solution: TaskBlock[];
  files: TaskFile[];
  entry: string;
  activeFile: string;
  tests: TaskTest[];
};
