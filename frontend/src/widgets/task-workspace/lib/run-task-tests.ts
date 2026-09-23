import { flushSync } from "react-dom";
import type { Task, TaskTestContext } from "@/entities/task";
import { createConsoleCapture } from "./console-capture";
import { mountTask, unmountTask } from "./mount-task";

export type TaskTestResult = {
  id: string;
  title: string;
  ok: boolean;
  message?: string;
};

export function runTaskTests(
  task: Task,
  files: Record<string, string>,
): TaskTestResult[] {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
  iframe.title = "Проверка задачи";
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:400px;height:300px;opacity:0;pointer-events:none;border:0";
  document.body.append(iframe);

  const root = { current: null };
  const results: TaskTestResult[] = [];

  const remount = () => {
    unmountTask(root);
    mountTask(iframe, {
      files,
      entry: task.entry,
      theme: "light",
      console: createConsoleCapture(() => undefined),
      root,
    });
  };

  const context = (): TaskTestContext => {
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      throw new Error("Превью тестов не готово");
    }
    return {
      document: doc,
      window: win,
      click(selector, times = 1) {
        const el = doc.querySelector<HTMLElement>(selector);
        if (!el) {
          throw new Error(`Нет элемента ${selector}`);
        }
        for (let step = 0; step < times; step += 1) {
          flushSync(() => {
            el.click();
          });
        }
      },
      text(selector) {
        const el = doc.querySelector(selector);
        if (!el) {
          throw new Error(`Нет элемента ${selector}`);
        }
        return (el.textContent ?? "").trim();
      },
    };
  };

  try {
    for (const test of task.tests) {
      try {
        flushSync(() => {
          remount();
        });
        test.run(context());
        results.push({ id: test.id, title: test.title, ok: true });
      } catch (caught) {
        results.push({
          id: test.id,
          title: test.title,
          ok: false,
          message: caught instanceof Error ? caught.message : String(caught),
        });
      }
    }
  } finally {
    unmountTask(root);
    iframe.remove();
  }

  return results;
}
