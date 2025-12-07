import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function FollowsDao() {
  const findFollowers = (userId) => {
    return model.find({ following: userId }).populate("follower", "-password");
  };

  const findFollowing = (userId) => {
    return model.find({ follower: userId }).populate("following", "-password");
  };

  const isFollowing = (followerId, followingId) => {
    return model.findOne({ follower: followerId, following: followingId });
  };

  const follow = (followerId, followingId) => {
    return model.create({
      _id: uuidv4(),
      follower: followerId,
      following: followingId,
    });
  };

  const unfollow = (followerId, followingId) => {
    return model.deleteOne({ follower: followerId, following: followingId });
  };

  const countFollowers = (userId) => {
    return model.countDocuments({ following: userId });
  };

  const countFollowing = (userId) => {
    return model.countDocuments({ follower: userId });
  };

  return {
    findFollowers,
    findFollowing,
    isFollowing,
    follow,
    unfollow,
    countFollowers,
    countFollowing,
  };
}