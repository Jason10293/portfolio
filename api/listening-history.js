import { getAccessToken } from "./_spotify.js";

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const spotifyResponse = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!spotifyResponse.ok) {
      const message = await spotifyResponse.text();
      console.error("Recently played error:", message);
      return res
        .status(502)
        .json({ tracks: [], minutesThisMonth: 0 });
    }

    const data = await spotifyResponse.json();
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
          ? track.artists.map((artist) => artist.name).join(", ")
          : "Unknown Artist",
        album: track.album?.name ?? "Unknown Album",
        coverUrl: track.album?.images?.[0]?.url ?? "",
        durationMs,
        playedAt,
      };
    });

    return res.status(200).json({
      tracks: tracks.slice(0, 10),
      minutesThisMonth: Math.max(0, Math.round(monthMs / 60000)),
    });
  } catch (error) {
    console.error("Listening history fetch failed:", error);
    return res.status(500).json({ tracks: [], minutesThisMonth: 0 });
  }
}
