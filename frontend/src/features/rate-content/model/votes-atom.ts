export type ContentVote = "up" | "down";

export type ContentRatingState = {
  mine?: ContentVote;
  up: number;
  down: number;
};

export function emptyRating(): ContentRatingState {
  return { up: 0, down: 0 };
}

export function lessonVoteKey(slug: string, view: string) {
  return `lesson:${slug}:${view}`;
}

export function quizVoteKey(slug: string) {
  return `quiz:${slug}`;
}

export function applyVote(
  current: ContentRatingState,
  next: ContentVote,
): ContentRatingState {
  if (current.mine === next) {
    return {
      mine: undefined,
      up: next === "up" ? Math.max(0, current.up - 1) : current.up,
      down: next === "down" ? Math.max(0, current.down - 1) : current.down,
    };
  }

  let { up, down } = current;
  if (current.mine === "up") {
    up = Math.max(0, up - 1);
  }
  if (current.mine === "down") {
    down = Math.max(0, down - 1);
  }
  if (next === "up") {
    up += 1;
  } else {
    down += 1;
  }
  return { mine: next, up, down };
}
