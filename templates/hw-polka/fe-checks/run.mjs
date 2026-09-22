import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const ref = process.env.GITHUB_HEAD_REF ?? "";
const match = ref.match(/module_(\d+)/i);
const upto = match ? Number(match[1]) : 1;

let failed = false;
for (let i = 1; i <= upto; i += 1) {
  const file = join(dir, `module-${i}.mjs`);
  if (!existsSync(file)) {
    console.log(`Модуль ${i}: проверок пока нет, пропускаем.`);
    continue;
  }
  const result = spawnSync(process.execPath, [file], { stdio: "inherit" });
  if (result.status !== 0) {
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
