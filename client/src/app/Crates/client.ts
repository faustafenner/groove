import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const CRATES_API = `${HTTP_SERVER}/api/crates`;

export const findAllPublicCrates = async () => {
  const response = await axios.get(`${CRATES_API}/public`);
  return response.data;
};

export const findCratesByUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${CRATES_API}/user/${userId}`);
  return response.data;
};

export const findCrateById = async (crateId: string) => {
  const response = await axiosWithCredentials.get(`${CRATES_API}/${crateId}`);
  return response.data;
};

export const createCrate = async (crate: {
  title: string;
  description?: string;
  isPublic?: boolean;
}) => {
  const response = await axiosWithCredentials.post(CRATES_API, crate);
  return response.data;
};

export const updateCrate = async (
  crateId: string,
  updates: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  }
) => {
  const response = await axiosWithCredentials.put(
    `${CRATES_API}/${crateId}`,
    updates
  );
  return response.data;
};

export const deleteCrate = async (crateId: string) => {
  const response = await axiosWithCredentials.delete(`${CRATES_API}/${crateId}`);
  return response.data;
};

export const addAlbumToCrate = async (
  crateId: string,
  album: {
    spotifyAlbumId: string;
    albumName: string;
    artistName: string;
    albumImage: string;
  }
) => {
  const response = await axiosWithCredentials.post(
    `${CRATES_API}/${crateId}/albums`,
    album
  );
  return response.data;
};

export const removeAlbumFromCrate = async (crateId: string, spotifyAlbumId: string) => {
  const response = await axiosWithCredentials.delete(
    `${CRATES_API}/${crateId}/albums/${spotifyAlbumId}`
  );
  return response.data;
};

// Like functionality
export const getCrateLikeCount = async (crateId: string) => {
  const response = await axios.get(`${CRATES_API}/${crateId}/likes/count`);
  return response.data.count;
};

export const checkIfCrateLiked = async (crateId: string) => {
  const response = await axiosWithCredentials.get(
    `${CRATES_API}/${crateId}/likes/check`
  );
  return response.data.liked;
};

export const likeCrate = async (crateId: string) => {
  const response = await axiosWithCredentials.post(
    `${CRATES_API}/${crateId}/likes`
  );
  return response.data.count;
};

export const unlikeCrate = async (crateId: string) => {
  const response = await axiosWithCredentials.delete(
    `${CRATES_API}/${crateId}/likes`
  );
  return response.data.count;
};