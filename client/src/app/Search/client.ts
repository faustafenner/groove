import axios from "axios";

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const SPOTIFY_API = `${HTTP_SERVER}/api/spotify`;

export const searchAlbums = async (query: string) => {
  const response = await axios.get(
    `${SPOTIFY_API}/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

export const getAlbumById = async (spotifyId: string) => {
  const response = await axios.get(`${SPOTIFY_API}/albums/${spotifyId}`);
  return response.data;
};