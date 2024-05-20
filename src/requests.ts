import { CreateScoreDto } from "../util/schemas";

let newServer = true;

const url = newServer
  ? "http://localhost:3000"
  : "http://localhost:9000";

export const getGames = async () => {
  const response = await fetch(`${url}/games`);
  return response.json();
};

export const register = async (
  username: string,
  password: string
) => {
  return fetch(`${url}/users`, {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify({ user: { username, password } }),
  });
};

export const login = async (
  username: string,
  password: string
) => {
  return fetch(`${url}/login`, {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify({ user: { username, password } }),
  });
};

export const getGame = async (id: string) => {
  const response = await fetch(`${url}/games/${id}`);
  return response.json();
};

export const createScore = async ({
  scoreData,
  token,
}: {
  token: string;
  scoreData: {
    game_id: string;
    time_complete: number;
    words_correct: number;
    accuracy: number;
    wpm: number;
  };
}) => {
  return fetch(`${url}/scores`, {
    method: "POST",
    headers: {
      ["Authorization"]: `Bearer ${token}`,
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify({
      redirect: "follow",
      score: {
        game_id: scoreData.game_id,
        time_complete: scoreData.time_complete,
        words_correct: scoreData.words_correct,
        accuracy: scoreData.accuracy,
        wpm: scoreData.wpm,
      },
    }),
  }).then((response) => response.text());
};

export const postScore = ({
  token,
  score,
}: {
  token: string;
  score: CreateScoreDto;
}) => {
  return fetch(`${url}/scores`, {
    headers: {
      ["Authorization"]: `Bearer ${token}`,
      ["Content-Type"]: "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      ...score,
    }),
  });
};

export const getScores = async (token: string) => {
  return fetch(`${url}/scores`, {
    headers: {
      ["Authorization"]: `Bearer ${token}`,
    },
  });
};
