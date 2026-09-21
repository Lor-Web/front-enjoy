import { useState } from "react";
import { ratingGate } from "@/entities/mentorship";
import type { Mentorship, RatingAspect } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { useRateUser } from "../model/use-rate-user";

type RateUserFormProps = {
  mentorship: Mentorship;
  aspect: RatingAspect;
  hideHeading?: boolean;
};

export function RateUserForm({
  mentorship,
  aspect,
  hideHeading = false,
}: RateUserFormProps) {
  const rate = useRateUser();
  const current = mentorship.myRatings.find((item) => item.aspect === aspect);
  const [score, setScore] = useState(current?.score ?? 5);
  const [comment, setComment] = useState(current?.comment ?? "");
  const gate = ratingGate(mentorship.startedAt, current?.updatedAt);
  const label = aspect === "asMentor" ? "Оценка ментору" : "Оценка ученику";

  return (
    <div className="space-y-3">
      {hideHeading ? null : <p className="text-sm font-medium">{label}</p>}
      {current ? (
        <p className="text-muted-foreground text-sm">
          Сейчас: {current.score} из 5
          {current.comment ? ` · ${current.comment}` : ""}
        </p>
      ) : null}
      {gate.canSubmit ? (
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            rate.mutate({
              mentorshipId: mentorship.id,
              aspect,
              score,
              comment: comment.trim() || undefined,
            });
          }}
        >
          <div className="flex flex-wrap gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`size-8 rounded-md border text-sm ${
                  score === value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => setScore(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Комментарий — по желанию"
            maxLength={500}
          />
          <Button type="submit" size="sm" disabled={rate.isPending}>
            {current ? "Обновить оценку" : "Поставить оценку"}
          </Button>
        </form>
      ) : (
        <p className="text-muted-foreground text-sm">{gate.message}</p>
      )}
    </div>
  );
}
