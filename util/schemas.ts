import { Static, t } from "elysia";

const userTransaction = t.Object({
  user: t.Object({
    username: t.String(),
    password: t.String(),
  }),
});

const createScore = t.Object({
  time_complete: t.Number(),
  accuracy: t.Number(),
  wpm: t.Number(),
  words_correct: t.Number(),
  // words_incorrect: t.Number(),
  game_id: t.Number(),
});

export type CreateScoreDto = Static<typeof createScore>;

export const schemas = { userTransaction, createScore };
