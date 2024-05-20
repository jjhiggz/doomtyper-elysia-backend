import { db } from "./db/db";
import { games, scores, users } from "./db/schema";
import { sql } from "drizzle-orm";

const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const [game1] = await db
  .insert(games)
  .values({
    name: "game1",
    words: ["word1", "word2"],
  })
  .returning();

const [user1] = await db
  .insert(users)
  .values({ username: "jon@jon.com" })
  .returning();

const [jonPlaysGame1] = await db
  .insert(scores)
  .values({
    game_id: game1.id,
    accuracy: 100,
    time_complete: 45,
    user_id: user1.id,
    words_correct: 45,
    words_incorrect: 0,
    wpm: 60,
    characters_missed: 0,
  })
  .returning();

const jonsScores = await db.query.users.findFirst({
  where: sql`${users.id} = ${user1.id}`,
  with: {
    scores: {
      with: {
        games: true,
      },
    },
  },
});

const jonsGames = jonsScores?.scores.map(
  (score) => score.games.name
);

console.log(jonsGames);
