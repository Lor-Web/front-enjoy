import { BadRequestException } from "@nestjs/common";

export function normalizeHomeworkPullUrl(
  raw: string,
  expected: { owner: string; name: string },
) {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new BadRequestException("Вставьте ссылку на pull request");
  }

  if (parsed.protocol !== "https:") {
    throw new BadRequestException("Ссылка должна начинаться с https://");
  }

  const host = parsed.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") {
    throw new BadRequestException("Нужна ссылка на GitHub");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  const number = parts[3];
  if (
    parts.length < 4 ||
    parts[2] !== "pull" ||
    !number ||
    !/^\d+$/.test(number)
  ) {
    throw new BadRequestException(
      "Это не ссылка на pull request. Нужен адрес вида github.com/владелец/репо/pull/номер",
    );
  }

  const owner = parts[0];
  const name = parts[1];
  if (!owner || !name) {
    throw new BadRequestException("Вставьте ссылку на pull request");
  }
  if (
    owner.toLowerCase() !== expected.owner.toLowerCase() ||
    name.toLowerCase() !== expected.name.toLowerCase()
  ) {
    throw new BadRequestException(
      "PR должен быть в вашем репозитории этого курса",
    );
  }

  return `https://github.com/${owner}/${name}/pull/${number}`;
}
