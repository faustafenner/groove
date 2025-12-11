import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function LikesDao() {

  //dao methods for like operations

  //likes for specific review
  const findLikesByReview = (reviewId) => {
    return model.find({ review: reviewId }).populate("user", "-password"); //populate user details excluding passwords
  };

  //check if a user has liked a specific review
  const hasUserLiked = (userId, reviewId) => {
    return model.findOne({ user: userId, review: reviewId });
  };

  //like a review
  const like = (userId, reviewId) => {
    return model.create({
      _id: uuidv4(),
      user: userId,
      review: reviewId,
      crate: null,
    });
  };

  //unlike a review
  const unlike = (userId, reviewId) => {
    return model.deleteOne({ user: userId, review: reviewId });
  };

  //count likes for a review
  const countLikes = (reviewId) => {
    return model.countDocuments({ review: reviewId });
  };

  //export DAO methods
  return {
    findLikesByReview,
    hasUserLiked,
    like,
    unlike,
    countLikes,
  };
}