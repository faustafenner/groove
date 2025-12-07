import axios from "axios";

export default function SpotifyRoutes(app) {
  let accessToken = null;
  let tokenExpiry = null;

  const getAccessToken = async () => {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
      return accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;

    return accessToken;
  };

  const searchAlbums = async (req, res) => {
    const { q, limit } = req.query;

    if (!q) {
      res.status(400).json({ message: "Search query required" });
      return;
    }

    try {
      const token = await getAccessToken();

      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q,
          type: "album",
          limit: limit || 20,
        },
      });

      const albums = response.data.albums.items.map((album) => ({
        spotifyId: album.id,
        name: album.name,
        artist: album.artists[0]?.name,
        image: album.images[0]?.url,
        imageMedium: album.images[1]?.url,
        imageSmall: album.images[2]?.url,
        releaseDate: album.release_date,
        totalTracks: album.total_tracks,
      }));

      res.json(albums);
    } catch (error) {
console.error("Spotify search error:", error.response?.data || error.message);
      res.status(500).json({ message: "Failed to search albums" });
    }
  };

  const getAlbumById = async (req, res) => {
    const { spotifyId } = req.params;

    try {
      const token = await getAccessToken();

      const response = await axios.get(
        `https://api.spotify.com/v1/albums/${spotifyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const album = response.data;

      res.json({
        spotifyId: album.id,
        name: album.name,
        artist: album.artists[0]?.name,
        artists: album.artists.map((a) => a.name),
        image: album.images[0]?.url,
        imageMedium: album.images[1]?.url,
        releaseDate: album.release_date,
        totalTracks: album.total_tracks,
        label: album.label,
        tracks: album.tracks.items.map((t) => ({
          number: t.track_number,
          name: t.name,
          duration: t.duration_ms,
        })),
      });
    } catch (error) {
      console.error("Spotify album error:", error.message);
      res.status(500).json({ message: "Failed to get album" });
    }
  };

  app.get("/api/spotify/search", searchAlbums);
  app.get("/api/spotify/albums/:spotifyId", getAlbumById);
}