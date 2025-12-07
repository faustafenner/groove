import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const REVIEWS_API = `${HTTP_SERVER}/api/reviews`;

export const findRecentReviews = async (limit?: number) => {
  const response = await axios.get(
    `${REVIEWS_API}/recent${limit ? `?limit=${limit}` : ""}`
  );
  return response.data;
};

export const findReviewsByAlbum = async (spotifyAlbumId: string) => {
  const response = await axios.get(`${REVIEWS_API}/album/${spotifyAlbumId}`);
  return response.data;
};

export const findReviewsByUser = async (userId: string) => {
  const response = await axios.get(`${REVIEWS_API}/user/${userId}`);
  return response.data;
};

export const createReview = async (review: {
  spotifyAlbumId: string;
  albumName: string;
  artistName: string;
  albumImage: string;
  rating: number;
  content: string;
}) => {
  const response = await axiosWithCredentials.post(REVIEWS_API, review);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await axiosWithCredentials.delete(`${REVIEWS_API}/${reviewId}`);
  return response.data;
};