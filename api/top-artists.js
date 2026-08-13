import { getAccessToken, spotifyErrorResponse } from "./_spotify.js";

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const spotifyResponse = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!spotifyResponse.ok) {
      const message = await spotifyResponse.text();
      console.error("Top artists error:", spotifyResponse.status, message);
      return res
        .status(502)
        .json({ artists: [], error: "SPOTIFY_API_REQUEST_FAILED" });
    }

    const data = await spotifyResponse.json();
    const artists =
      data.items?.map((artist, index) => ({
        id: artist.id,
        name: artist.name,
        rank: index + 1,
        genres: artist.genres,
        followers: artist.followers?.total ?? 0,
        image: artist.images?.[0]?.url,
      })) ?? [];

    return res.status(200).json({ artists });
  } catch (error) {
    const response = spotifyErrorResponse(error);
    return res.status(response.status).json({ artists: [], ...response.body });
  }
}
