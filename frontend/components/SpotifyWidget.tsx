import React, { useEffect, useMemo, useState } from "react";
import { RecentTrack, Song, SpotifyArtistStat } from "../types";
import {
  fetchListeningHistory,
  fetchNowPlaying,
  fetchTopArtists,
} from "../services/spotify";

interface SpotifyWidgetProps {
  variant?: "full" | "compact" | "minimal";
}

const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({ variant = "full" }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [nowPlayingError, setNowPlayingError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [artists, setArtists] = useState<SpotifyArtistStat[]>([]);
  const [artistsError, setArtistsError] = useState<string | null>(null);
  const [loadingNowPlaying, setLoadingNowPlaying] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [minutesListened, setMinutesListened] = useState<number | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let active = true;

    const loadNowPlaying = async () => {
      setLoadingNowPlaying(true);
      try {
        const data = await fetchNowPlaying();
        if (!active) return;

        if (data.playing && data.title) {
          const track: Song = {
            id: `live-${Date.now()}`,
            title: data.title,
            artist: data.artist ?? "Unknown Artist",
            album: data.album ?? "—",
            coverUrl: data.albumArt ?? "",
            durationMs: data.durationMs ?? 0,
            progressMs: data.progressMs ?? 0,
            isPlaying: true,
          };
          setCurrentSong(track);
          setProgress(track.progressMs);
          setIsLive(true);
          setNowPlayingError(null);
        } else {
          setCurrentSong(null);
          setProgress(0);
          setIsLive(false);
        }
      } catch (error) {
        if (!active) return;
        setCurrentSong(null);
        setProgress(0);
        setIsLive(false);
        setNowPlayingError("Unable to reach Spotify right now.");
      } finally {
        if (active) {
          setLoadingNowPlaying(false);
          setLastUpdated(new Date());
        }
      }
    };

    loadNowPlaying();
    const interval = setInterval(loadNowPlaying, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadArtists = async () => {
      setLoadingArtists(true);
      try {
        const data = await fetchTopArtists();
        if (!active) return;
        setArtists(data.artists);
        setArtistsError(null);
      } catch (error) {
        if (!active) return;
        setArtists([]);
        setArtistsError("Unable to load monthly artists.");
      } finally {
        if (active) setLoadingArtists(false);
      }
    };

    loadArtists();
    const interval = setInterval(loadArtists, 120000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setLoadingHistory(true);
      try {
        const data = await fetchListeningHistory();
        if (!active) return;
        setRecentTracks(data.tracks);
        setMinutesListened(data.minutesThisMonth);
        setHistoryError(null);
      } catch (error) {
        if (!active) return;
        setRecentTracks([]);
        setMinutesListened(null);
        setHistoryError("Unable to load listening history.");
      } finally {
        if (active) setLoadingHistory(false);
      }
    };

    loadHistory();
    const interval = setInterval(loadHistory, 180000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!currentSong || !currentSong.isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (!currentSong.durationMs) return prev + 1000;
        const next = prev + 1000;
        return Math.min(next, currentSong.durationMs);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSong]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const formatPlayedAt = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const headingColor = "text-neutral-400 dark:text-neutral-500";
  const textColor = "text-neutral-900 dark:text-neutral-50";
  const subTextColor = "text-neutral-500 dark:text-neutral-400";
  const accentColor = "bg-neutral-900 dark:bg-neutral-100";
  const barBg = "bg-neutral-100 dark:bg-neutral-800";
  const statusColor = isLive
    ? "text-emerald-500"
    : "text-neutral-400 dark:text-neutral-500";
  const progressPercent =
    currentSong && currentSong.durationMs > 0
      ? Math.min(100, (progress / currentSong.durationMs) * 100)
      : 0;
  const formattedArtistGenres = (artist: SpotifyArtistStat) =>
    artist.genres.slice(0, 2).join(", ") || "—";

  const nowPlayingTitle = useMemo(() => {
    if (loadingNowPlaying) return "Loading track…";
    if (!currentSong) return "Nothing playing right now.";
    return currentSong.title;
  }, [loadingNowPlaying, currentSong]);

  // Minimal Variant (Header / Inline)
  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 dark:text-neutral-300 animate-in fade-in duration-700">
        <div className="flex items-end gap-0.5 h-3 pb-0.5">
          <div className="w-0.5 h-2 bg-emerald-500 animate-[bounce_1s_infinite]"></div>
          <div className="w-0.5 h-3 bg-emerald-500 animate-[bounce_1.2s_infinite]"></div>
          <div className="w-0.5 h-1.5 bg-emerald-500 animate-[bounce_0.8s_infinite]"></div>
        </div>
        {currentSong ? (
          <div className="flex gap-1">
            <span className="text-neutral-900 dark:text-neutral-100">
              {currentSong.title}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">—</span>
            <span className="text-neutral-500 dark:text-neutral-300">
              {currentSong.artist}
            </span>
          </div>
        ) : (
          <span className="text-neutral-500 dark:text-neutral-400">
            {loadingNowPlaying ? "Connecting…" : "No active session"}
          </span>
        )}
      </div>
    );
  }

  // Full & Compact Variants
  return (
    <div className="flex flex-col gap-16 w-full">
      {/* Now Playing Section */}
      <div className="group">
        <h3
          className={`text-xs uppercase tracking-widest ${headingColor} mb-8 border-b border-neutral-100 dark:border-neutral-800 pb-2`}
        >
          Now Playing
        </h3>

        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-6">
          <div className="flex-1 space-y-2">
            <div
              className={`text-4xl md:text-5xl font-light tracking-tight ${textColor} leading-tight`}
            >
              {nowPlayingTitle}
            </div>
            <div className={`text-lg md:text-xl ${subTextColor}`}>
              {currentSong ? (
                <>
                  {currentSong.artist}{" "}
                  <span className="text-neutral-300 dark:text-neutral-600 mx-2">
                    —
                  </span>{" "}
                  {currentSong.album}
                </>
              ) : (
                "Check back soon."
              )}
            </div>
          </div>

          <div
            className={`text-xs uppercase tracking-widest ${statusColor} flex flex-col items-end gap-1`}
          >
            <span className={isLive ? "animate-pulse" : ""}>
              {isLive ? "● Live" : "● Offline"}
            </span>
            {lastUpdated && (
              <span className="text-[10px] normal-case text-neutral-400 dark:text-neutral-500">
                Updated{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`w-full h-1.5 ${barBg} mt-4 relative overflow-hidden rounded-full`}
        >
          <div
            className={`h-full ${accentColor} absolute top-0 left-0 transition-all duration-1000 ease-linear`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className={`flex justify-between text-[10px] uppercase mt-3 ${subTextColor} font-medium`}
        >
          <span>{currentSong ? formatTime(progress) : "--:--"}</span>
          <span>
            {currentSong && currentSong.durationMs
              ? formatTime(currentSong.durationMs)
              : "--:--"}
          </span>
        </div>

        {nowPlayingError && (
          <p className="text-xs text-rose-500 mt-3">{nowPlayingError}</p>
        )}
      </div>

      {/* Stats Section - Only shown in full variant */}
      {variant === "full" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
          <div>
            <h3
              className={`text-xs uppercase tracking-widest ${headingColor} mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-2`}
            >
              Top Artists (This Month)
            </h3>
            {loadingArtists ? (
              <p className="text-xs text-neutral-400">Fetching artists…</p>
            ) : artists.length ? (
              <div className="grid grid-cols-1 gap-0.5">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center justify-between py-2 px-2 -mx-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-medium w-6 ${headingColor}`}
                      >
                        0{artist.rank}
                      </span>
                      <div>
                        <p
                          className={`text-sm md:text-base ${textColor} font-medium`}
                        >
                          {artist.name}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          {formattedArtistGenres(artist)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {artist.followers.toLocaleString()} followers
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">
                No listening data for this period.
              </p>
            )}
            {artistsError && (
              <p className="text-xs text-rose-500 mt-3">{artistsError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <h3
                className={`text-xs uppercase tracking-widest ${headingColor}`}
              >
                Recent Plays
              </h3>
              <span className="text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                {minutesListened !== null
                  ? `${minutesListened.toLocaleString()} min this month`
                  : loadingHistory
                  ? "Calculating…"
                  : "No minutes tracked"}
              </span>
            </div>
            {loadingHistory ? (
              <p className="text-xs text-neutral-400">Fetching tracks…</p>
            ) : recentTracks.length ? (
              <div className="flex flex-col gap-1">
                {recentTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 py-2 px-2 -mx-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded-sm"
                  >
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt=""
                        className="w-12 h-12 rounded-sm object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm md:text-base ${textColor} font-medium truncate`}
                      >
                        {track.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {track.artist} · {track.album}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {track.durationMs
                          ? formatTime(track.durationMs)
                          : "--:--"}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {formatPlayedAt(track.playedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">
                No recent plays captured.
              </p>
            )}
            {historyError && (
              <p className="text-xs text-rose-500 mt-3">{historyError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifyWidget;
