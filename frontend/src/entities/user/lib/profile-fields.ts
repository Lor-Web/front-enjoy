import {
  defaultVisibility,
  type Grade,
  type ProfileVisibility,
  VISIBILITY_KEYS,
} from "../model/types";

export const GRADE_OPTIONS: Array<{ value: Grade; label: string }> = [
  { value: "intern", label: "Стажёр" },
  { value: "junior", label: "Junior" },
  { value: "middle", label: "Middle" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

export function gradeLabel(grade: Grade | null | undefined) {
  if (!grade) {
    return null;
  }
  return GRADE_OPTIONS.find((item) => item.value === grade)?.label ?? grade;
}

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
