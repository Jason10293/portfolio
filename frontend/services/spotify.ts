export type NowPlayingResponse = {
  playing: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  progressMs?: number;
  durationMs?: number;
};

export type TopArtistsResponse = {
  artists: {
    id: string;
    name: string;
    rank: number;
    followers: number;
    genres: string[];
    image?: string;
  }[];
};

import { RecentTrack } from "../types";

export type ListeningHistoryResponse = {
  tracks: RecentTrack[];
  minutesThisMonth: number;
};

const fetchSpotifyJson = async <T>(
  path: string,
  signal?: AbortSignal
): Promise<T> => {
  const response = await fetch(path, {
    signal,
    headers: { Accept: "application/json" },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const code =
      body && typeof body.error === "string" ? body.error : `HTTP_${response.status}`;
    throw new Error(code);
  }

  if (body === null) {
    throw new Error("INVALID_SPOTIFY_RESPONSE");
  }

  return body as T;
};

export const fetchNowPlaying = async (
  signal?: AbortSignal
): Promise<NowPlayingResponse> => {
  return fetchSpotifyJson<NowPlayingResponse>("/api/now-playing", signal);
};

export const fetchTopArtists = async (
  signal?: AbortSignal
): Promise<TopArtistsResponse> => {
  return fetchSpotifyJson<TopArtistsResponse>("/api/top-artists", signal);
};

export const fetchListeningHistory = async (
  signal?: AbortSignal
): Promise<ListeningHistoryResponse> => {
  return fetchSpotifyJson<ListeningHistoryResponse>(
    "/api/listening-history",
    signal
  );
};
