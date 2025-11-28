export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
}

export interface SpotifyArtistStat {
  id: string;
  name: string;
  rank: number;
  followers: number;
  genres: string[];
  image?: string;
}

export interface RecentTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationMs: number;
  playedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  imageUrls?: string[];
}
