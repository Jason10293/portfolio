const REQUIRED_ENV = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "SPOTIFY_REFRESH_TOKEN",
];

let cachedToken = null;
let tokenExpiresAt = 0;

export class SpotifyAuthError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "SpotifyAuthError";
    this.code = code;
  }
}

export async function getAccessToken() {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new SpotifyAuthError(
      `Missing Spotify environment variables: ${missing.join(", ")}`,
      "SPOTIFY_NOT_CONFIGURED"
    );
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET.trim();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN.trim();
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Spotify token refresh failed:", response.status, errorBody);
    throw new SpotifyAuthError(
      `Spotify rejected the configured credentials (${response.status}).`,
      "SPOTIFY_TOKEN_REFRESH_FAILED"
    );
  }

  const data = await response.json();
  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new SpotifyAuthError(
      "Spotify returned a token response without an access token.",
      "SPOTIFY_INVALID_TOKEN_RESPONSE"
    );
  }

  cachedToken = data.access_token;
  const expiresInSeconds = Number(data.expires_in) || 3600;
  tokenExpiresAt = Date.now() + Math.max(0, expiresInSeconds - 60) * 1000;
  return cachedToken;
}

export function spotifyErrorResponse(error) {
  if (error instanceof SpotifyAuthError) {
    return {
      status: error.code === "SPOTIFY_NOT_CONFIGURED" ? 503 : 502,
      body: { error: error.code },
    };
  }

  console.error("Unexpected Spotify error:", error);
  return { status: 500, body: { error: "SPOTIFY_UNAVAILABLE" } };
}
