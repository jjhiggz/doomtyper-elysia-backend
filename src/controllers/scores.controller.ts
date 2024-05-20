import Elysia, { t } from "elysia";
import { AuthController } from "./auth.controller";
import { db } from "../../db/db";
import { scores } from "../../db/schema";
import { schemas } from "../../util/schemas";
import { sql } from "drizzle-orm";

export const ScoresController = new Elysia()
  .use(AuthController)
  .post(
    "/scores",
    async ({ user, body }) => {
      console.log("Creating a Score");
      console.log({
        user,
      });
      const [newScore] = await db
        .insert(scores)
        .values({
          ...body.score,
          user_id: user?.id!,
          words_incorrect: 0,
        })
        .returning();
      return newScore;
    },
    {
      requireUser: true,
      body: t.Object({ score: schemas.createScore }),
    }
  )
  .get(
    "/scores",
    async () => {
      const result = await db.query.scores.findMany({
        with: {
          users: {
            columns: {
              username: true,
            },
          },
        },
      });

      return result.map((score) => ({
        ...score,
        user: score.users,
      }));
    },
    {
      requireUser: true,
    }
  )
  .get(
    "/scores/:id",
    async ({ params }) => {
      const scoresForGame = await db.query.scores.findMany({
        where: sql`${scores.game_id} = ${params.id}`,
        orderBy: sql`${scores.time_complete} ASC`,
        with: {
          users: {
            columns: {
              username: true,
            },
          },
        },
      });

      return scoresForGame.map((score) => ({
        ...score,
        user: score.users,
      }));
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
