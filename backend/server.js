import express from "express";
import { getAccessToken } from "./auth.js";

const app = express();

app.get("/now-playing", async (req, res) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (resp.status === 204 || resp.status > 400) {
      return res.json({ playing: false });
    }

    const data = await resp.json();
    res.json({
      playing: data.is_playing,
      title: data.item?.name,
      artist: data.item?.artists?.map((a) => a.name).join(", "),
      album: data.item?.album?.name,
      albumArt: data.item?.album?.images?.[0]?.url,
      progressMs: data.progress_ms,
      durationMs: data.item?.duration_ms,
    });
  } catch (error) {
    console.error("Now playing error:", error);
    res.status(500).json({ playing: false, error: "Failed to load track." });
  }
});

app.get("/top-artists", async (req, res) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!resp.ok) {
      const message = await resp.text();
      console.error("Top artists error:", message);
      return res.status(502).json({ artists: [] });
    }

    const data = await resp.json();
    const artists =
      data.items?.map((artist, index) => ({
        id: artist.id,
        name: artist.name,
        rank: index + 1,
        genres: artist.genres,
        followers: artist.followers?.total ?? 0,
        image: artist.images?.[0]?.url,
      })) ?? [];

    res.json({ artists });
  } catch (error) {
    console.error("Top artists fetch failed:", error);
    res.status(500).json({ artists: [] });
  }
});

app.get("/listening-history", async (req, res) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!resp.ok) {
      const message = await resp.text();
      console.error("Recently played error:", message);
      return res.status(502).json({ tracks: [], minutesThisMonth: 0 });
    }

    const data = await resp.json();
    const items = Array.isArray(data.items) ? data.items : [];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let monthMs = 0;
    const tracks = items.map((item) => {
      const track = item.track ?? {};
      const playedAt = item.played_at;
      const durationMs = track.duration_ms ?? 0;
      if (playedAt && new Date(playedAt) >= startOfMonth) {
        monthMs += durationMs;
      }

      return {
        id: track.id ? `${track.id}-${playedAt}` : playedAt,
        title: track.name ?? "Unknown Track",
        artist: Array.isArray(track.artists)
          ? track.artists.map((a) => a.name).join(", ")
          : "Unknown Artist",
        album: track.album?.name ?? "Unknown Album",
        coverUrl: track.album?.images?.[0]?.url ?? "",
        durationMs,
        playedAt,
      };
    });

    res.json({
      tracks: tracks.slice(0, 10),
      minutesThisMonth: Math.max(0, Math.round(monthMs / 60000)),
    });
  } catch (error) {
    console.error("Listening history fetch failed:", error);
    res.status(500).json({ tracks: [], minutesThisMonth: 0 });
  }
});

app.listen(3000);
