export const VISIBILITY_KEYS = [
  "email",
  "grade",
  "experience",
  "workplace",
  "country",
  "city",
  "otherContacts",
  "mentorBio",
  "telegram",
  "vk",
  "discord",
  "website",
] as const;

export type VisibilityKey = (typeof VISIBILITY_KEYS)[number];

export type ProfileVisibility = Record<VisibilityKey, boolean>;

export const defaultVisibility: ProfileVisibility = {
  email: false,
  grade: true,
  experience: true,
  workplace: true,
  country: true,
  city: true,
  otherContacts: true,
  mentorBio: true,
  telegram: true,
  vk: true,
  discord: true,
  website: true,
};

export function parseVisibility(value: unknown): ProfileVisibility {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const next = { ...defaultVisibility };
  for (const key of VISIBILITY_KEYS) {
    if (typeof raw[key] === "boolean") {
      next[key] = raw[key];
    }
  }
  return next;
}

export function mergeVisibility(
  current: ProfileVisibility,
  incoming?: Partial<Record<VisibilityKey, boolean>>,
): ProfileVisibility {
  if (!incoming) {
    return current;
  }
  const next = { ...current };
  for (const key of VISIBILITY_KEYS) {
    const value = incoming[key];
    if (typeof value === "boolean") {
      next[key] = value;
    }
  }
  return next;
}

export function isVisible(
  visibility: ProfileVisibility,
  key: VisibilityKey,
): boolean {
  return visibility[key];
}
