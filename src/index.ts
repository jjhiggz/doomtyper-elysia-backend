import { Elysia } from "elysia";
import { GamesController } from "./controllers/games.controller";
import { ScoresController } from "./controllers/scores.controller";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .use(GamesController)
  .use(ScoresController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
