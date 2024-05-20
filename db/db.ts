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
// for migrations
const migrationClient = postgres(
  "postgresql://postgres:postgres@localhost:5432/postgres",
  { max: 1 }
);

migrate(drizzle(migrationClient), {
  migrationsFolder: "drizzle",
});
// for query purposes
const queryClient = postgres(
  "postgresql://postgres:postgres@localhost:5432/postgres"
);
export const db = drizzle(queryClient, {
  schema: {
    games,
    scores,
    users,
    scoresRelations,
    usersRelations,
  },
});
