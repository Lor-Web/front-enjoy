import { useAtom } from "jotai";
import { useCallback } from "react";
import {
  applyVote,
  type ContentVote,
  contentVotesAtom,
  emptyRating,
} from "./votes-atom";

export function useContentVote(targetId: string) {
  const [votes, setVotes] = useAtom(contentVotesAtom);
  const rating = votes[targetId] ?? emptyRating();

  const setVote = useCallback(
    (next: ContentVote) => {
      setVotes((prev) => ({
        ...prev,
        [targetId]: applyVote(prev[targetId] ?? emptyRating(), next),
      }));
    },
    [setVotes, targetId],
  );

  return { rating, setVote };
}
