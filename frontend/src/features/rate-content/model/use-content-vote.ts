import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { api } from "@/shared/lib/api";
import { getVoterId } from "../lib/voter-id";
import {
  applyVote,
  type ContentRatingState,
  type ContentVote,
  emptyRating,
} from "./votes-atom";

const empty = emptyRating();

function voteHeaders() {
  return { "X-Voter-Id": getVoterId() };
}

export function useContentVote(targetId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["content-vote", targetId] as const;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<ContentRatingState>("/content-votes", {
        params: { targetId },
        headers: voteHeaders(),
      });
      return data;
    },
    placeholderData: empty,
  });

  const mutation = useMutation({
    mutationFn: async (vote: ContentVote) => {
      const { data } = await api.put<ContentRatingState>(
        "/content-votes",
        { targetId, vote },
        { headers: voteHeaders() },
      );
      return data;
    },
    onMutate: async (vote) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<ContentRatingState>(queryKey);
      queryClient.setQueryData(
        queryKey,
        applyVote(prev ?? emptyRating(), vote),
      );
      return { prev };
    },
    onError: (_error, _vote, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKey, context.prev);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });

  const setVote = useCallback(
    (next: ContentVote) => {
      mutation.mutate(next);
    },
    [mutation],
  );

  return { rating: query.data ?? emptyRating(), setVote };
}
