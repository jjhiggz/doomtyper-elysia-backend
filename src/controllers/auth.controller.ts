import Elysia from "elysia";
import { db } from "../../db/db";
import { sql } from "drizzle-orm";
import { users } from "../../db/schema";
import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { schemas } from "../../util/schemas";
import {
  createUser,
  doesUserExist,
} from "../../util/auth-helpers";

const JWT = Bun.env.JWT_SECRET ?? null;
if (!JWT) throw new Error("JWT_SECRET not found in env");

export const AuthController = new Elysia()
  .derive({ as: "scoped" }, async ({ headers }) => {
    const token =
      headers["authorization"]?.split("Bearer ")[1] ||
      headers["Authorization"]?.split("Bearer ")[1];

    if (!token)
      return {
        user: null,
      } as const;

    const verified = await Promise.resolve()
      .then(() => verify(token, JWT))
      .catch(() => null);

    if (!verified)
      return {
        user: null,
      };

    // @ts-ignore
    const id = verified?.id;

    const user = await db.query.users.findFirst({
      where: sql`${users.id} = ${id}`,
    });

    return {
      user,
    };
  })
  .post(
    "/login",
    async ({ body }) => {
      const user = await db.query.users.findFirst({
        where: sql`${users.username} = ${body.user.username}`,
      });

      if (!user) {
        return {
          error: "username not found ",
        };
      }

      if (!user.password_digest) {
        return {
          error: "username not found ",
        };
      }

      const valid = await compare(
        body.user.password,
        user.password_digest!
      );

      if (!valid) {
        return {
          error: "bad password",
        };
      }

      const { password_digest, ...sanitizedUser } = user;

      return {
        token: sign(
          { ...sanitizedUser, user_id: sanitizedUser.id },
          JWT
        ),
      };
    },
    {
      body: schemas.userTransaction,
    }
  )
  .post(
    "/users",

    async ({ body, set }) => {
      if (body.user.password.length < 8) {
        set.status = 422;
        return {
          password: [
            "is too short (minimum is 8 characters)",
          ],
        };
      }

      if (await doesUserExist(body.user.username)) {
        set.status = 422;
        return {
          username: ["has already been taken"],
        };
      }

      const newUser = await createUser(
        body.user.username,
        body.user.password
      );

      return newUser;
    },
    {
      body: schemas.userTransaction,
    }
  )
  .macro(({ onBeforeHandle }) => ({
    requireUser: (shouldRequireUser: boolean) => {
      onBeforeHandle(async ({ error, user }) => {
        if (!user && shouldRequireUser) return error(404);
      });
    },
  }));
