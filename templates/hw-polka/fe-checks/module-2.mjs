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

function defaultExport(text, name) {
  return new RegExp(`export\\s+default\\s+function\\s+${name}\\b`).test(text);
}

function aliasImport(text, name) {
  return new RegExp(
    `from\\s+['"\`]@/components/${name}(?:\\.jsx)?['"\`]`,
  ).test(text);
}

const files = [
  ["src/components/Header.jsx", "Header"],
  ["src/components/BookCard.jsx", "BookCard"],
  ["src/components/BookList.jsx", "BookList"],
];

for (const [path, name] of files) {
  const text = read(path);
  if (!text) {
    fail(`Нет файла ${path}.`);
    continue;
  }
  ok(`Найден ${path}`);
  if (defaultExport(text, name)) {
    ok(`${name}: export default function`);
  } else {
    fail(
      `В ${path} нет \`export default function ${name}\`. Один файл — один компонент.`,
    );
  }
}

const header = read("src/components/Header.jsx") ?? "";
if (header && /\bchildren\b/.test(header)) {
  ok("Header использует children");
} else if (header) {
  fail(
    "В Header.jsx нет children. Шапка — обёртка: рисует то, что передали между тегами.",
  );
}

const card = read("src/components/BookCard.jsx") ?? "";
if (card) {
  if (/\bbook\.title\b/.test(card) && /\bbook\.author\b/.test(card)) {
    ok("BookCard читает book.title и book.author");
  } else {
    fail(
      "BookCard должна брать название и автора из пропа book: book.title и book.author.",
    );
  }
  if (/from\s+['"`]@\/books/.test(card) || /from\s+['"`]\.\.?\/.*books/.test(card)) {
    fail(
      "BookCard не должна импортировать массив книг. Список приходит сверху.",
    );
  } else {
    ok("BookCard не импортирует список книг");
  }
}

const list = read("src/components/BookList.jsx") ?? "";
if (list) {
  if (aliasImport(list, "BookCard")) {
    ok("BookList импортирует BookCard через @/");
  } else {
    fail(
      "BookList.jsx должен импортировать карточку: `import BookCard from '@/components/BookCard.jsx'`.",
    );
  }
  if (/\.map\s*\(/.test(list) && /<BookCard\b/.test(list)) {
    ok("BookList рисует BookCard в map");
  } else {
    fail("BookList должен делать map по книгам и рендерить <BookCard />.");
  }
}

const app = read("src/App.jsx") ?? read("src/App.js") ?? "";
if (!app) {
  fail("Нет src/App.jsx.");
} else {
  if (aliasImport(app, "Header")) {
    ok("App импортирует Header через @/");
  } else {
    fail("App.jsx должен импортировать Header через `@/components/Header`.");
  }
  if (aliasImport(app, "BookList")) {
    ok("App импортирует BookList через @/");
  } else {
    fail("App.jsx должен импортировать BookList через `@/components/BookList`.");
  }
  if (/<Header[\s>]/.test(app) && /<BookList\b/.test(app)) {
    ok("App вставляет Header и BookList");
  } else {
    fail("В разметке App должны быть <Header> и <BookList />.");
  }
  if (/Get started|Count is/.test(app)) {
    fail(
      "В App.jsx ещё заставка Vite (Get started / Count is). Замените её на Полку.",
    );
  } else {
    ok("Заставка Vite из App убрана");
  }
}

const books = read("src/books.js") ?? read("src/books.jsx");
if (!books) {
  fail("Нет src/books.js с массивом книг.");
} else {
  const titles = books.match(/\btitle\s*:/g) ?? [];
  if (titles.length >= 3) {
    ok(`В books.js не меньше трёх книг (${titles.length})`);
  } else {
    fail(
      "В src/books.js нужно не меньше трёх объектов с полем title. Это статичный массив, не состояние.",
    );
  }
  if (/\bauthor\s*:/.test(books)) {
    ok("У книг есть поле author");
  } else {
    fail("У книг в src/books.js должно быть поле author.");
  }
}

console.log("Проверка модуля 2\n");
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
console.log("Модуль 2: каркас Полки на месте.");
