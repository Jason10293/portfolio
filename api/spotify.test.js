import assert from "node:assert/strict";
import test from "node:test";

import {
  getAccessToken,
  SpotifyAuthError,
  spotifyErrorResponse,
} from "./_spotify.js";
import nowPlayingHandler from "./now-playing.js";

const spotifyEnvNames = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "SPOTIFY_REFRESH_TOKEN",
];

const withSpotifyEnv = async (values, callback) => {
  const previous = Object.fromEntries(
    spotifyEnvNames.map((name) => [name, process.env[name]])
  );

  try {
    for (const name of spotifyEnvNames) {
      if (values[name] === undefined) delete process.env[name];
      else process.env[name] = values[name];
    }
    await callback();
  } finally {
    for (const name of spotifyEnvNames) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
};

const createResponse = () => {
  const result = { statusCode: null, body: null };
  return {
    result,
    response: {
      status(code) {
        result.statusCode = code;
        return this;
      },
      json(body) {
        result.body = body;
        return this;
      },
    },
  };
};

test("reports missing Spotify credentials before making a request", async () => {
  await withSpotifyEnv({}, async () => {
    await assert.rejects(
      getAccessToken(),
      (error) =>
        error instanceof SpotifyAuthError &&
        error.code === "SPOTIFY_NOT_CONFIGURED"
    );
  });
});

test("maps configuration failures to a service-unavailable response", () => {
  const result = spotifyErrorResponse(
    new SpotifyAuthError("missing", "SPOTIFY_NOT_CONFIGURED")
  );
  assert.deepEqual(result, {
    status: 503,
    body: { error: "SPOTIFY_NOT_CONFIGURED" },
  });
});

test("returns normalized currently-playing data", async () => {
  const originalFetch = globalThis.fetch;
  const responses = [
    new Response(JSON.stringify({ access_token: "access", expires_in: 3600 }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
    new Response(
      JSON.stringify({
        is_playing: true,
        progress_ms: 42000,
        item: {
          name: "Test Track",
          duration_ms: 180000,
          artists: [{ name: "Test Artist" }],
          album: { name: "Test Album", images: [{ url: "cover.jpg" }] },
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    ),
  ];

  globalThis.fetch = async () => responses.shift();

  try {
    await withSpotifyEnv(
      {
        SPOTIFY_CLIENT_ID: "client",
        SPOTIFY_CLIENT_SECRET: "secret",
        SPOTIFY_REFRESH_TOKEN: "refresh",
      },
      async () => {
        const { response, result } = createResponse();
        await nowPlayingHandler({}, response);

        assert.equal(result.statusCode, 200);
        assert.deepEqual(result.body, {
          playing: true,
          title: "Test Track",
          artist: "Test Artist",
          album: "Test Album",
          albumArt: "cover.jpg",
          progressMs: 42000,
          durationMs: 180000,
        });
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
