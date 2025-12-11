import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const CRATES_API = `${HTTP_SERVER}/api/crates`;

//fetches recent crates from server, with optional limit
//if limit is provided, appends it as query parameter
export const findRecentCrates = async (limit?: number) => {
  const url = limit ? `${CRATES_API}/recent?limit=${limit}` : `${CRATES_API}/recent`;
  const response = await axios.get(url);
  return response.data;
};

//fetches all public crates from server
export const findAllPublicCrates = async () => {
  const response = await axios.get(`${CRATES_API}/public`);
  return response.data;
};

//fetches crates created by a specific user
export const findCratesByUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${CRATES_API}/user/${userId}`);
  return response.data;
};

//fetches a specific crate by its ID
export const findCrateById = async (crateId: string) => {
  const response = await axiosWithCredentials.get(`${CRATES_API}/${crateId}`);
  return response.data;
};

//creates a new crate on the server
export const createCrate = async (crate: {
  title: string;
  description?: string;
  isPublic?: boolean;
}) => {
  const response = await axiosWithCredentials.post(CRATES_API, crate);
  return response.data;
};

//updates an existing crate on the server
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

//deletes a crate by its ID
export const deleteCrate = async (crateId: string) => {
  const response = await axiosWithCredentials.delete(`${CRATES_API}/${crateId}`);
  return response.data;
};

//adds an album to a specific crate
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

//removes an album from a specific crate
export const removeAlbumFromCrate = async (crateId: string, spotifyAlbumId: string) => {
  const response = await axiosWithCredentials.delete(
    `${CRATES_API}/${crateId}/albums/${spotifyAlbumId}`
  );
  return response.data;
};