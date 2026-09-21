export const GRADES = ["intern", "junior", "middle", "senior", "lead"] as const;

export type Grade = (typeof GRADES)[number];

export type ProfileDetails = {
  grade: Grade | null;
  experience: string | null;
  workplace: string | null;
  country: string | null;
  city: string | null;
  otherContacts: string | null;
};

export function isGrade(value: unknown): value is Grade {
  return GRADES.includes(value as Grade);
}

export function emptyToNull(value?: string | null) {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}
