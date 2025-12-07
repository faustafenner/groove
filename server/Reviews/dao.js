import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function ReviewsDao() {
  const findReviewsByAlbum = (spotifyAlbumId) => {
    return model
      .find({ spotifyAlbumId })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
  };

  const findReviewsByUser = (userId) => {
    return model
      .find({ user: userId })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
  };

  const findRecentReviews = (limit = 10) => {
    return model
      .find()
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .limit(limit);
  };

  const findReviewById = (reviewId) => {
    return model.findOne({ _id: reviewId }).populate("user", "-password");
  };

  const findUserReviewForAlbum = (userId, spotifyAlbumId) => {
    return model.findOne({ user: userId, spotifyAlbumId });
  };

  const createReview = (review) => {
    const newReview = { ...review, _id: uuidv4() };
    return model.create(newReview);
  };

  const updateReview = (reviewId, updates) => {
    return model.updateOne(
      { _id: reviewId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  };

  const deleteReview = (reviewId) => {
    return model.deleteOne({ _id: reviewId });
  };

  return {
    findReviewsByAlbum,
    findReviewsByUser,
    findRecentReviews,
    findReviewById,
    findUserReviewForAlbum,
    createReview,
    updateReview,
    deleteReview,
  };
}