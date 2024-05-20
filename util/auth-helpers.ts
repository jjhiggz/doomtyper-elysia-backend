import { hash, compare } from "bcrypt";
import { db } from "../db/db";
import { users } from "../db/schema";
import { sql } from "drizzle-orm";

export const createUser = async (
  username: string,
  password: string
) => {
  const password_digest = await hash(password, 11);

  const [user] = await db
    .insert(users)
    .values({
      username,
      password_digest,
    })
    .returning();

  const { password_digest: _, ...sanitizedUser } = user;

  return sanitizedUser;
};

export const doesUserExist = async (username: string) => {
  const user = await db.query.users.findFirst({
    where: sql`${users.username} = ${username}`,
  });

  return !!user;
};

export const authenticateUser = async (
  username: string,
  password: string
) => {};

export const getToken = async (username: string) => {};
