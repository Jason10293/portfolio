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

export const fetchNowPlaying = async (
  signal?: AbortSignal
): Promise<NowPlayingResponse> => {
  const response = await fetch("/api/now-playing", { signal });

  if (!response.ok) {
    throw new Error(`Now playing request failed: ${response.status}`);
  }

  return response.json();
};

export const fetchTopArtists = async (
  signal?: AbortSignal
): Promise<TopArtistsResponse> => {
  const response = await fetch("/api/top-artists", { signal });

  if (!response.ok) {
    throw new Error(`Top artists request failed: ${response.status}`);
  }

  return response.json();
};

export const fetchListeningHistory = async (
  signal?: AbortSignal
): Promise<ListeningHistoryResponse> => {
  const response = await fetch("/api/listening-history", { signal });

  if (!response.ok) {
    throw new Error(`Listening history request failed: ${response.status}`);
  }

  return response.json();
};
