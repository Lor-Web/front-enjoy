import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const passed = [];
const failed = [];

function ok(message) {
  passed.push(message);
}

function fail(message) {
  failed.push(message);
}

function read(relative) {
  const file = join(root, relative);
  if (!existsSync(file)) {
    return null;
  }
  return readFileSync(file, "utf8");
}

function firstExisting(names) {
  for (const name of names) {
    const text = read(name);
    if (text !== null) {
      return { name, text };
    }
  }
  return null;
}

function hasSrc(name) {
  return existsSync(join(root, "src", name));
}

const pkgText = read("package.json");
if (!pkgText) {
  fail(
    "В корне нет package.json. Создайте Vite-приложение в корне репозитория: npm create vite@latest . -- --template react",
  );
} else {
  let pkg = null;
  try {
    pkg = JSON.parse(pkgText);
  } catch {
    fail("package.json не читается как JSON.");
  }

  if (pkg) {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const scripts = pkg.scripts ?? {};

    for (const name of ["react", "react-dom", "vite", "@vitejs/plugin-react"]) {
      if (deps[name]) {
        ok(`Зависимость ${name}`);
      } else {
        fail(`В package.json нет ${name}. Нужен шаблон react на JavaScript.`);
      }
    }

    if (deps.eslint || deps["@eslint/js"]) {
      ok("ESLint есть в зависимостях");
    } else {
      fail("Нет ESLint в package.json. Поставьте его и добавьте скрипт lint.");
    }

    for (const name of ["dev", "build", "lint"]) {
      if (typeof scripts[name] === "string" && scripts[name].trim()) {
        ok(`Скрипт ${name}`);
      } else {
        fail(`В package.json нет скрипта "${name}".`);
      }
    }
  }
}

const html = read("index.html");
if (html && /src\/main\.(jsx|js)/.test(html)) {
  ok("index.html подключает src/main.jsx");
} else if (html) {
  fail("index.html есть, но не ссылается на src/main.jsx (или src/main.js).");
} else {
  fail("В корне нет index.html. Так устроен шаблон Vite: html лежит рядом с package.json.");
}

if (hasSrc("main.jsx") || hasSrc("main.js")) {
  ok("Точка входа JavaScript: src/main.jsx");
} else if (hasSrc("main.tsx") || hasSrc("main.ts")) {
  fail(
    "Найден TypeScript-вход (src/main.tsx). В курсе нужен JavaScript: шаблон react, файл src/main.jsx.",
  );
} else {
  fail("Нет src/main.jsx.");
}

const vite = firstExisting([
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.ts",
]);
if (!vite) {
  fail("Нет vite.config.js в корне.");
} else if (vite.name.endsWith(".ts")) {
  fail("vite.config.ts — это TypeScript. Нужен vite.config.js.");
} else {
  ok(`Найден ${vite.name}`);
  if (/@vitejs\/plugin-react/.test(vite.text)) {
    ok("В Vite подключён @vitejs/plugin-react");
  } else {
    fail("В vite.config.js нет @vitejs/plugin-react.");
  }
  if (/\balias\b/.test(vite.text) && /['"`]@['"`]\s*:/.test(vite.text)) {
    ok("В Vite задан alias @");
  } else {
    fail(
      'В vite.config.js нет resolve.alias с ключом "@" на папку src. Документация: https://vite.dev/config/shared-options.html#resolve-alias',
    );
  }
}

const eslint = firstExisting([
  "eslint.config.js",
  "eslint.config.mjs",
  "eslint.config.ts",
]);
if (!eslint) {
  fail("Нет eslint.config.js. Подключите ESLint, как в уроке модуля.");
} else if (eslint.name.endsWith(".ts")) {
  fail("eslint.config.ts — TypeScript. Нужен eslint.config.js.");
} else {
  ok(`Найден ${eslint.name}`);
  if (
    /eqeqeq\s*:\s*\[?\s*['"`]error['"`]/.test(eslint.text) ||
    /['"`]eqeqeq['"`]\s*:\s*['"`]error['"`]/.test(eslint.text)
  ) {
    ok("Правило eqeqeq: error");
  } else {
    fail('В eslint.config.js нет правила eqeqeq: "error".');
  }
  if (
    /no-var\s*:\s*\[?\s*['"`]error['"`]/.test(eslint.text) ||
    /['"`]no-var['"`]\s*:\s*['"`]error['"`]/.test(eslint.text)
  ) {
    ok("Правило no-var: error");
  } else {
    fail('В eslint.config.js нет правила no-var: "error".');
  }
  if (/eslint-plugin-react-hooks/.test(eslint.text)) {
    ok("Подключён eslint-plugin-react-hooks");
  } else {
    fail("В eslint.config.js нет eslint-plugin-react-hooks.");
  }
}

const readme = read("README.md") ?? "";
if (readme.trim().length < 80) {
  fail(
    "README.md пустой или слишком короткий. Опишите проект, стек и как запустить.",
  );
} else {
  ok("README.md не пустой");
  if (/react/i.test(readme)) {
    ok("README упоминает React");
  } else {
    fail("В README нет слова React.");
  }
  if (/vite/i.test(readme)) {
    ok("README упоминает Vite");
  } else {
    fail("В README нет слова Vite.");
  }
}

console.log("Проверка модуля 1\n");
for (const line of passed) {
  console.log(`  ok  ${line}`);
}
for (const line of failed) {
  console.log(`  fail  ${line}`);
}
console.log("");
if (failed.length > 0) {
  console.log(`Не пройдено: ${failed.length}.`);
  process.exit(1);
}
console.log("Модуль 1: файлы на месте.");
