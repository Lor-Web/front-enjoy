import { formatRuDate } from "@/shared/lib/format-date";

export const RATE_AFTER_MS = 3 * 24 * 60 * 60 * 1000;
export const RATE_UPDATE_EVERY_MS = 24 * 60 * 60 * 1000;

export type RatingGate =
  | { canSubmit: true }
  | { canSubmit: false; message: string };

export function ratingGate(
  startedAt: string | null,
  existingUpdatedAt?: string | null,
): RatingGate {
  if (!startedAt) {
    return {
      canSubmit: false,
      message: "Оценку можно оставить после начала менторства",
    };
  }

  const openAt = new Date(startedAt).getTime() + RATE_AFTER_MS;
  if (Date.now() < openAt) {
    return {
      canSubmit: false,
      message: `Оценку и отзыв можно оставить с ${formatRuDate(new Date(openAt).toISOString())}`,
    };
  }

  if (existingUpdatedAt) {
    const nextAt = new Date(existingUpdatedAt).getTime() + RATE_UPDATE_EVERY_MS;
    if (Date.now() < nextAt) {
      return {
        canSubmit: false,
        message: `Обновить оценку можно с ${formatRuDate(new Date(nextAt).toISOString())}`,
      };
    }
  }

  return { canSubmit: true };
}
