import { relations } from "drizzle-orm";
import {
  integer,
  index,
  text,
  serial,
  boolean,
  pgTable,
  json,
  timestamp,
  real,
} from "drizzle-orm/pg-core";

export const games = pgTable("game", {
  id: serial("serial").primaryKey(),
  words: json("words").notNull(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const users = pgTable("users", {
  id: serial("serial").primaryKey(),
  tokenId: text("token_id"),
  password_digest: text("password_digest"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  username: text("username").notNull(),
});

export const scores = pgTable(
  "scores",
  {
    id: serial("serial").primaryKey(),
    time_complete: real("time_complete").notNull(),
    accuracy: real("accuracy").notNull(),
    wpm: real("wpm").notNull(),
    words_correct: integer("words_correct").notNull(),
    words_incorrect: integer("words_incorrect").notNull(),
    characters_missed: json("characters_missed"),
    user_id: integer("user_id").notNull(),
    game_id: integer("game_id").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    gameIdx: index("index_scores_on_game_id").on(table.game_id),
    userIdx: index("index_scores_on_user_id").on(table.user_id),
    gameId: integer("game_id").references(() => games.id),
    userId: integer("user_id").references(() => users.id),
  })
);

export const scoresRelations = relations(scores, ({ one }) => ({
  users: one(users, {
    fields: [scores.user_id],
    references: [users.id],
  }),
  games: one(games, {
    fields: [scores.game_id],
    references: [games.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  scores: many(scores),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  scores: many(scores),
}));
