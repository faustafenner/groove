import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export const getFollowers = async (userId: string) => {
  const response = await axios.get(`${HTTP_SERVER}/api/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId: string) => {
  const response = await axios.get(`${HTTP_SERVER}/api/users/${userId}/following`);
  return response.data;
};

export const getFollowCounts = async (userId: string) => {
  const response = await axios.get(`${HTTP_SERVER}/api/users/${userId}/follow-counts`);
  return response.data;
};

export const checkIsFollowing = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${HTTP_SERVER}/api/users/${userId}/is-following`
  );
  return response.data;
};

export const followUser = async (userId: string) => {
  const response = await axiosWithCredentials.post(
    `${HTTP_SERVER}/api/users/${userId}/follow`
  );
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(
    `${HTTP_SERVER}/api/users/${userId}/follow`
  );
  return response.data;
};