import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function LikesDao() {
  const findLikesByReview = (reviewId) => {
    return model.find({ review: reviewId }).populate("user", "-password");
  };

  const hasUserLiked = (userId, reviewId) => {
    return model.findOne({ user: userId, review: reviewId });
  };

  const like = (userId, reviewId) => {
    return model.create({
      _id: uuidv4(),
      user: userId,
      review: reviewId,
    });
  };

  const unlike = (userId, reviewId) => {
    return model.deleteOne({ user: userId, review: reviewId });
  };

  const countLikes = (reviewId) => {
    return model.countDocuments({ review: reviewId });
  };

  return {
    findLikesByReview,
    hasUserLiked,
    like,
    unlike,
    countLikes,
  };
}