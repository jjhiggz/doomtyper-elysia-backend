import { describe, it, expect, beforeEach } from "bun:test";
import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";
import { Static } from "@sinclair/typebox";
import {
  getGames,
  getScores,
  login,
  postScore,
  register,
} from "./requests";
import { v4 } from "uuid";
import { decode, sign } from "jsonwebtoken";
import { CreateScoreDto } from "../util/schemas";

const SGame = t.Object({
  id: t.Integer(),
  name: t.String(),
  words: t.String(),
  created_at: t.String(),
  updated_at: t.String(),
});

type Game = Static<typeof SGame>;

const allGames = (await getGames()) as Game[];
const firstGame = allGames[0];

describe("e2e", () => {
  describe("games", () => {
    it("should get me games in the correct type", async () => {
      const games = await getGames().then((games) => {
        return Value.Check(t.Array(SGame), games);
      });
      expect(games).toBeTrue();
    });
  });

  describe("register", () => {
    it("correct login errorMessages for username being taken", async () => {
      let status = 0;

      await register("jon@jon.com", "password$!@#123");
      const result = await register(
        "jon@jon.com",
        "password"
      ).then((response) => {
        status = response.status;
        return response.json();
      });

      expect(result?.username).toEqual([
        "has already been taken",
      ]);
      expect(status).toBe(422);
    });

    it("correct login errorMessages for password too short", async () => {
      let status = 0;
      const username = v4();
      const result = await register(
        username,
        "passwor"
      ).then((response) => {
        status = response.status;
        return response.json();
      });

      expect(status).toBe(422);

      expect(
        result?.password?.includes(
          "is too short (minimum is 8 characters)"
        )
      ).toBeTrue();
    });

    it("A succesful register should have a user-ish object and a status code of 201", async () => {
      const response = await register(v4(), "password");
      expect(response.status).toBe(200);
      const json = await response.json();

      const isArray = Array.isArray(json);

      const typeofit = typeof json;

      expect(typeofit).toBe("object");
      expect(isArray).toBe(false);
    });
  });
});

describe("authenticated shit", () => {
  let user: { username: string; id: number };
  let password = "password";

  beforeEach(async () => {
    user = await register(v4(), password)
      .then((response) => response.json())
      .then((result) => {
        return result;
      });
  });

  describe("creating a score", () => {});

  describe("login", () => {
    it("should return a JWT that works", async () => {
      await login(user.username, password)
        .then(async (response) => response.json())
        .then(async (data) => {
          const userFromToken = await decode(data.token);
          // @ts-ignore
          expect(userFromToken?.user_id).toBe(user.id);
          // @ts-ignore
          expect(userFromToken?.username).toBe(
            user.username
          );
        });
    });

    it("If username not found", async () => {
      await login("poopmaster9000", "password")
        .then(async (response) => {
          expect(response.status).toBe(200);
          return response.json();
        })
        .then(async (data) => {
          expect(data).toEqual({
            error: "username not found ",
          });
        });
    });

    it("If invalid password", async () => {
      await login(user.username, "wrongpassword")
        .then(async (response) => {
          expect(response.status).toBe(200);
          return response.json();
        })
        .then((data) => {
          expect(data).toEqual({
            error: "bad password",
          });
        });
    });
  });

  describe("As logged in user", async () => {
    let token: string;

    beforeEach(async () => {
      token = await login(user.username, password)
        .then((response) => response.json())
        .then((result) => result.token);
    });

    const scoreData: CreateScoreDto = {
      accuracy: 100,
      game_id: firstGame.id,
      id: 1,
      time_complete: 1,
      words_correct: 1,
      words_incorrect: 0,
      wpm: 1,
    };

    it("should show 404 with invalid token", async () => {
      const badJWTSecret =
        "WVyqMYIv9jhxV/HrsqaplaVuQnEcS69Q7O48dL1jh7DfFRUMmDM1yBM4SI5la0UEMFWooMOlpTSTBLQ2oSaNvc8UlZWfAhNhqt7BAD5dFKm6GO03Pypv11RCj11iA21isQnOVoDt+0GloV6bDo84cq7p6yN0vfJBj+yjeg+rnm9GBvvzjw6FlBzGP/EcTmbMxu0nUwSoMwLL2JeA/N/wR+hLoQ09ZuOwbwNRdUL9p4r4LObI3pK0lCCk0TzSkJOm6FIlw3AdwF14Fb063ydeXrs7hrYWJECy6vTGaa5wtzs2pWyue3L2cXspL+VzVVNy69B/WmzTNZ0edTBtL9epRg==";

      const badToken = sign(
        { id: -1, userId: -1 },
        badJWTSecret
      );
      await postScore({
        token: badToken,
        score: scoreData,
      }).then((response) => {
        expect(response.status).toBeOneOf([404, 500]);
      });
    });

    it("should show happy with valid token", async () => {
      await postScore({
        token,
        score: scoreData,
      })
        .then((response) => {
          // Shape should be
          expect(response.ok).toBe(true);
          return response.json();
        })
        .then((result) => {
          const resultScoreShape = t.Object({
            id: t.Number(),
            time_complete: t.Number(),
            accuracy: t.Number(),
            wpm: t.Number(),
            words_correct: t.Number(),
            words_incorrect: t.Number(),
            game_id: t.Number(),
            user_id: t.Number(),
          });
          expect(
            Value.Check(resultScoreShape, result)
          ).toBe(true);
        });
    });

    // it("should fetch me scores", async () => {
    //   const result = await getScores(token).then(
    //     (response) => response.json()
    //   );
    // });
  });
});
