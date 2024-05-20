import "dotenv/config";
import { defineConfig } from "drizzle-kit";
const DB_URL_RAW = Bun.env.DB_URL;
if (!DB_URL_RAW) throw new Error("DB_URL not found in env");

export const DB_URL = DB_URL_RAW;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
  migrations: {
    schema: "./db/schema.ts",
    table: "./db/migrations",
  },
});
