import { getAccessToken, spotifyErrorResponse } from "./_spotify.js";

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const spotifyResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (spotifyResponse.status === 204) {
      return res.status(200).json({ playing: false });
    }

    if (!spotifyResponse.ok) {
      const message = await spotifyResponse.text();
      console.error("Currently playing error:", spotifyResponse.status, message);
      return res.status(502).json({
        playing: false,
        error: "SPOTIFY_API_REQUEST_FAILED",
      });
    }

    const data = await spotifyResponse.json();
    return res.status(200).json({
      playing: data.is_playing,
      title: data.item?.name,
      artist: data.item?.artists?.map((artist) => artist.name).join(", "),
      album: data.item?.album?.name,
      albumArt: data.item?.album?.images?.[0]?.url,
      progressMs: data.progress_ms,
      durationMs: data.item?.duration_ms,
    });
  } catch (error) {
    const response = spotifyErrorResponse(error);
    return res.status(response.status).json({ playing: false, ...response.body });
  }
}
