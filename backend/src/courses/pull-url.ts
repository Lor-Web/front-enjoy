import { BadRequestException } from "@nestjs/common";

export function parseGithubPullPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const owner = parts[0];
  const name = parts[1];
  const number = parts[3];
  if (
    parts.length < 4 ||
    parts[2] !== "pull" ||
    !owner ||
    !name ||
    !number ||
    !/^\d+$/.test(number)
  ) {
    return null;
  }
  return { owner, name, number };
}

export function parseHomeworkPullUrl(raw: string) {
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== "https:") {
      return null;
    }
    const host = parsed.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") {
      return null;
    }
    return parseGithubPullPath(parsed.pathname);
  } catch {
    return null;
  }
}

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

  const parsedPull = parseGithubPullPath(parsed.pathname);
  if (!parsedPull) {
    throw new BadRequestException(
      "Это не ссылка на pull request. Нужен адрес вида github.com/владелец/репо/pull/номер",
    );
  }

  const { owner, name, number } = parsedPull;
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
