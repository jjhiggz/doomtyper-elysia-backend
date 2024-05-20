import Elysia from "elysia";
import { db } from "../../db/db";

export const GamesController = new Elysia().get(
  "/games",
  () => {
    return db.query.games.findMany().then((games) =>
      games.map((game) => ({
        ...game,
        words: JSON.stringify(game.words),
      }))
    );
  }
);
