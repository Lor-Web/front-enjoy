import { Star } from "lucide-react";
import type { RatingSummary } from "../model/types";

type RatingLabelProps = {
  label: string;
  rating: RatingSummary;
};

export function RatingLabel({ label, rating }: RatingLabelProps) {
  const hasRating = rating.count > 0 && rating.average !== null;
  const average = hasRating ? rating.average : 0;

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="sr-only">
        {hasRating
          ? `${formatAverage(rating.average ?? 0)} из 5, ${ratingCountLabel(rating.count)}`
          : "пока нет оценок"}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <StarRow value={average} />
        {hasRating ? (
          <>
            <span className="text-lg leading-none font-medium tabular-nums">
              {formatAverage(rating.average ?? 0)}
            </span>
            <span className="text-muted-foreground text-sm">
              из 5 · {ratingCountLabel(rating.count)}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground text-sm">Пока нет оценок</span>
        )}
      </div>
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.min(1, Math.max(0, value - index));
        return (
          <span key={index} className="relative size-4">
            <Star className="text-muted-foreground/25 size-4" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="fill-primary text-primary size-4" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function formatAverage(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ratingCountLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} оценка`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} оценки`;
  }
  return `${count} оценок`;
}
