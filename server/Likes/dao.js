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

  // Crate likes
  const findLikesByCrate = (crateId) => {
    return model.find({ crate: crateId }).populate("user", "-password");
  };

  const hasUserLikedCrate = (userId, crateId) => {
    return model.findOne({ user: userId, crate: crateId });
  };

  const likeCrate = (userId, crateId) => {
    return model.create({
      _id: uuidv4(),
      user: userId,
      crate: crateId,
    });
  };

  const unlikeCrate = (userId, crateId) => {
    return model.deleteOne({ user: userId, crate: crateId });
  };

  const countCrateLikes = (crateId) => {
    return model.countDocuments({ crate: crateId });
  };

  return {
    findLikesByReview,
    hasUserLiked,
    like,
    unlike,
    countLikes,
    findLikesByCrate,
    hasUserLikedCrate,
    likeCrate,
    unlikeCrate,
    countCrateLikes,
  };
}