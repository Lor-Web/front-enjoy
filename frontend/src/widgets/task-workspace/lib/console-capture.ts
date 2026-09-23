export type ConsoleLevel = "log" | "info" | "warn" | "error";

export type ConsoleEntry = {
  id: string;
  level: ConsoleLevel;
  message: string;
};

const LEVELS: ConsoleLevel[] = ["log", "info", "warn", "error"];

export function formatConsoleArg(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof Error) {
    return value.message;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function createConsoleCapture(
  onEntry: (entry: Omit<ConsoleEntry, "id">) => void,
  base: Console = window.console,
): Console {
  const captured = Object.create(base) as Console;
  for (const level of LEVELS) {
    captured[level] = (...args: unknown[]) => {
      base[level](...args);
      onEntry({
        level,
        message: args.map(formatConsoleArg).join(" "),
      });
    };
  }
  return captured;
}
