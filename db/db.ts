import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import {
  games,
  scores,
  scoresRelations,
  users,
  usersRelations,
} from "./schema";
import { DB_URL } from "../drizzle.config";
// for migrations
const migrationClient = postgres(DB_URL, { max: 1 });

migrate(drizzle(migrationClient), {
  migrationsFolder: "drizzle",
});
// for query purposes
const queryClient = postgres(DB_URL);

export const db = drizzle(queryClient, {
  schema: {
    games,
    scores,
    users,
    scoresRelations,
    usersRelations,
  },
});
