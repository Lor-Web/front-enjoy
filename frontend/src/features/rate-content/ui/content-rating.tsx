import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useContentVote } from "../model/use-content-vote";

type ContentRatingProps = {
  targetId: string;
};

export function ContentRating({ targetId }: ContentRatingProps) {
  const { rating, setVote } = useContentVote(targetId);

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t pt-6">
      <p className="text-muted-foreground mr-1 text-sm">Материал полезен?</p>
      <Button
        type="button"
        size="sm"
        variant={rating.mine === "up" ? "secondary" : "ghost"}
        aria-pressed={rating.mine === "up"}
        aria-label={`Нравится, ${rating.up}`}
        onClick={() => setVote("up")}
      >
        <ThumbsUp className={cn(rating.mine === "up" && "fill-current")} />
        <span className="tabular-nums">{rating.up}</span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant={rating.mine === "down" ? "secondary" : "ghost"}
        aria-pressed={rating.mine === "down"}
        aria-label={`Не нравится, ${rating.down}`}
        onClick={() => setVote("down")}
      >
        <ThumbsDown className={cn(rating.mine === "down" && "fill-current")} />
        <span className="tabular-nums">{rating.down}</span>
      </Button>
    </div>
  );
}
