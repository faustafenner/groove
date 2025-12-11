/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"; //for http requests

const axiosWithCredentials = axios.create({ withCredentials: true }); //axios instance that includes credentials like cookies

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER; //points to server
export const USERS_API = `${HTTP_SERVER}/api/users`; //user-related endpoints

//sends email and password to server for signin
export const signin = async (credentials: { email: string; password: string }) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
  return response.data;
};

//retrieves the profile of the currently signed-in user, used in Session.tsx, returns user data
export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data;
};

//sends user data to server for signup, retutrns created user
export const signup = async (user: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data;
};

//signs out the current user, returns server response
export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

//updates user data on the server, returns updated user
export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  return response.data;
};

//finds a user by their ID, returns user data
export const findUserById = async (id: string) => {
  const response = await axios.get(`${USERS_API}/${id}`);
  return response.data;
};

//retrieves all users from the server, returns array of users
export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

//deletes a user by their ID, returns server response
export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return response.data;
};