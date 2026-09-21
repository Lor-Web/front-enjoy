export const CONTACT_KEYS = ["telegram", "vk", "discord", "github"] as const;

export type ContactKey = (typeof CONTACT_KEYS)[number];

export type UserContacts = Record<ContactKey, string | null>;

export const emptyContacts: UserContacts = {
  telegram: null,
  vk: null,
  discord: null,
  github: null,
};

const messages: Record<ContactKey, string> = {
  telegram: "Укажите Telegram как @username или ссылку t.me",
  vk: "Укажите ВКонтакте как ссылку vk.com или короткое имя",
  discord: "Укажите Discord как имя или ссылку-приглашение",
  github: "Укажите GitHub как имя пользователя или ссылку github.com",
};

export function parseContacts(value: unknown): UserContacts {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return {
    telegram: stringOrNull(raw.telegram),
    vk: stringOrNull(raw.vk),
    discord: stringOrNull(raw.discord),
    github: stringOrNull(raw.github),
  };
}

export function mergeContacts(
  current: UserContacts,
  incoming?: Partial<Record<ContactKey, string>>,
): UserContacts {
  if (!incoming) {
    return current;
  }
  const next = { ...current };
  for (const key of CONTACT_KEYS) {
    const value = incoming[key];
    if (value === undefined) {
      continue;
    }
    next[key] = normalizeContact(key, value);
  }
  return next;
}

function normalizeContact(key: ContactKey, input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  const normalized =
    key === "telegram"
      ? normalizeTelegram(trimmed)
      : key === "vk"
        ? normalizeVk(trimmed)
        : key === "discord"
          ? normalizeDiscord(trimmed)
          : normalizeGithub(trimmed);
  if (!normalized) {
    throw new Error(messages[key]);
  }
  return normalized;
}

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeTelegram(trimmed: string) {
  const fromUrl = trimmed.match(
    /^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/@?([a-zA-Z0-9_]{5,32})\/?$/i,
  );
  const fromHandle = trimmed.match(/^@?([a-zA-Z0-9_]{5,32})$/);
  const username = fromUrl?.[1] ?? fromHandle?.[1];
  return username ? `https://t.me/${username}` : null;
}

function normalizeVk(trimmed: string) {
  const fromUrl = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?vk\.com\/([a-zA-Z0-9_.]+)$/i,
  );
  const fromHandle = trimmed.match(/^@?([a-zA-Z0-9_.]+)$/);
  const username = fromUrl?.[1] ?? fromHandle?.[1];
  if (!username || username.length < 2) {
    return null;
  }
  return `https://vk.com/${username}`;
}

function normalizeDiscord(trimmed: string) {
  const invite = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9-]+)$/i,
  );
  if (invite?.[1]) {
    return `https://discord.gg/${invite[1]}`;
  }
  if (/^[\w.# ]{2,64}$/.test(trimmed)) {
    return trimmed.replace(/^@/, "");
  }
  return null;
}

function normalizeGithub(trimmed: string) {
  const fromUrl = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/i,
  );
  const fromHandle = trimmed.match(
    /^@?([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/,
  );
  const username = fromUrl?.[1] ?? fromHandle?.[1];
  return username ? `https://github.com/${username}` : null;
}
