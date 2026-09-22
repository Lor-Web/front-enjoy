import {
  type ContactKey,
  emptyContacts,
  type UserContacts,
} from "../model/types";

export const CONTACT_FIELDS: Array<{
  key: ContactKey;
  label: string;
  placeholder: string;
  hint: string;
}> = [
  {
    key: "telegram",
    label: "Telegram",
    placeholder: "@username или t.me/username",
    hint: "Имя пользователя или ссылка t.me",
  },
  {
    key: "vk",
    label: "ВКонтакте",
    placeholder: "vk.com/username",
    hint: "Короткое имя или ссылка vk.com",
  },
  {
    key: "discord",
    label: "Discord",
    placeholder: "имя или discord.gg/invite",
    hint: "Ник или ссылка-приглашение",
  },
  {
    key: "website",
    label: "Сайт",
    placeholder: "example.com",
    hint: "Личный сайт или портфолио",
  },
];

export function contactHref(key: ContactKey, value: string) {
  if (key === "discord" && !/^https?:\/\//i.test(value)) {
    return null;
  }
  return value;
}

export function contactCaption(key: ContactKey, value: string) {
  if (key === "telegram") {
    return value.replace(/^https?:\/\/t\.me\//i, "@");
  }
  if (key === "vk") {
    return value.replace(/^https?:\/\/(?:www\.)?vk\.com\//i, "");
  }
  if (key === "website") {
    return value.replace(/^https?:\/\/(?:www\.)?/i, "").replace(/\/$/, "");
  }
  return value.replace(/^https?:\/\/(?:www\.)?discord\.gg\//i, "discord.gg/");
}

export function listedContacts(contacts: UserContacts | null | undefined) {
  const source = { ...emptyContacts, ...contacts };
  return CONTACT_FIELDS.flatMap((field) => {
    const value = source[field.key];
    if (!value) {
      return [];
    }
    return [
      {
        ...field,
        value,
        href: contactHref(field.key, value),
        caption: contactCaption(field.key, value),
      },
    ];
  });
}

export function contactError(key: ContactKey, input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  const field = CONTACT_FIELDS.find((item) => item.key === key);
  if (looksValid(key, trimmed)) {
    return null;
  }
  return field ? `Проверьте ${field.label.toLowerCase()}` : "Проверьте контакт";
}

function looksValid(key: ContactKey, trimmed: string) {
  if (key === "telegram") {
    return (
      /^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/@?([a-zA-Z0-9_]{5,32})\/?$/i.test(
        trimmed,
      ) || /^@?([a-zA-Z0-9_]{5,32})$/.test(trimmed)
    );
  }
  if (key === "vk") {
    return (
      /^(?:https?:\/\/)?(?:www\.)?vk\.com\/([a-zA-Z0-9_.]+)$/i.test(trimmed) ||
      /^@?([a-zA-Z0-9_.]{2,})$/.test(trimmed)
    );
  }
  if (key === "discord") {
    return (
      /^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9-]+)$/i.test(
        trimmed,
      ) || /^[\w.# ]{2,64}$/.test(trimmed)
    );
  }
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}
