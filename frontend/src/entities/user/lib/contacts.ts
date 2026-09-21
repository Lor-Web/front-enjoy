import {
  type ContactKey,
  emptyContacts,
  type UserContacts,
} from "../model/types";

export const CONTACT_FIELDS: Array<{
  key: ContactKey;
  label: string;
  placeholder: string;
}> = [
  {
    key: "telegram",
    label: "Telegram",
    placeholder: "@username или t.me/username",
  },
  {
    key: "vk",
    label: "ВКонтакте",
    placeholder: "vk.com/username",
  },
  {
    key: "discord",
    label: "Discord",
    placeholder: "имя или discord.gg/invite",
  },
  {
    key: "github",
    label: "GitHub",
    placeholder: "github.com/username",
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
  if (key === "github") {
    return value.replace(/^https?:\/\/(?:www\.)?github\.com\//i, "");
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
