import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function ReviewsDao() {

  //dao methods for review operations

  //retrieves reviews for a specific album
  const findReviewsByAlbum = (spotifyAlbumId) => {
    return model
      .find({ spotifyAlbumId }) //find reviews matching the album ID
      .populate("user", "-password") //populate user details excluding passwords
      .sort({ createdAt: -1 }); //sort by most recent first
  };

  //retrieves reviews written by a specific user
  const findReviewsByUser = (userId) => {
    return model
      .find({ user: userId }) //find reviews by the user ID
      .populate("user", "-password") //populate user details excluding passwords
      .sort({ createdAt: -1 }); //sort by most recent first
  };

  //retrieves the most recent reviews
  const findRecentReviews = (limit = 10) => {
    return model
      .find() //find all reviews
      .populate("user", "-password") //populate user details excluding passwords
      .sort({ createdAt: -1 }) //sort by most recent first
      .limit(limit); //limit the number of results to 10
  };

  //finds a review by its unique ID
  const findReviewById = (reviewId) => {
    return model.findOne({ _id: reviewId }).populate("user", "-password"); //populate user details excluding passwords
  };

//finds if a user has already reviewed a specific album
  const findUserReviewForAlbum = (userId, spotifyAlbumId) => {
    return model.findOne({ user: userId, spotifyAlbumId });
  };

  //creates a new review with the provided details
  const createReview = (review) => {
    const newReview = { ...review, _id: uuidv4() }; //generate unique ID for the review
    return model.create(newReview);
  };

  //updates an existing review's details
  const updateReview = (reviewId, updates) => {
    return model.updateOne(
      { _id: reviewId },
      { $set: { ...updates, updatedAt: new Date() } } //set updatedAt to current date
    );
  };

  //deletes a review by its unique ID
  const deleteReview = (reviewId) => {
    return model.deleteOne({ _id: reviewId });
  };

  //export all DAO methods
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