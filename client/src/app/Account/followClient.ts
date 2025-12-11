import axios from "axios"; //for http requests

const axiosWithCredentials = axios.create({ withCredentials: true }); //axios instance that includes credentials like cookies
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER; //points to server

//follower/following functionality

//retrieves followers of a user, returns array of users
export const getFollowers = async (userId: string) => {
  const response = await axios.get(`${HTTP_SERVER}/api/users/${userId}/followers`);
  return response.data;
};

//retrieves users that a user is following, returns array of users
export const getFollowing = async (userId: string) => {
  const response = await axios.get(`${HTTP_SERVER}/api/users/${userId}/following`);
  return response.data;
};

//retrieves follower and following counts for a user, returns object with counts
export const getFollowCounts = async (userId: string) => {
  const response = await axios.get(`${HTTP_SERVER}/api/users/${userId}/follow-counts`);
  return response.data;
};

//checks if the current user is following another user, returns boolean
export const checkIsFollowing = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${HTTP_SERVER}/api/users/${userId}/is-following`
  );
  return response.data;
};

//follows a user, returns server response
export const followUser = async (userId: string) => {
  const response = await axiosWithCredentials.post(
    `${HTTP_SERVER}/api/users/${userId}/follow`
  );
  return response.data;
};

//unfollows a user, returns server response
export const unfollowUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(
    `${HTTP_SERVER}/api/users/${userId}/follow`
  );
  return response.data;
};