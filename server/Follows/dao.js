import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function FollowsDao() {
  //dao methods for follow operations

  //retrieves followers of a specific user
  //returns an array of users who follow the specified user
  //populates follower details excluding passwords
  //sorts by creation date in descending order (most recent first)
  const findFollowers = (userId) => {
    return model.find({ following: userId }).populate("follower", "-password").sort({ createdAt: -1 });
  };

  //retrieves users that a specific user is following
  //returns an array of users being followed by the specified user
  //populates following details excluding passwords
  const findFollowing = (userId) => {
    return model.find({ follower: userId }).populate("following", "-password");
  };

  //checks if one user is following another
  //returns the follow object if exists, otherwise null
  const isFollowing = (followerId, followingId) => {
    return model.findOne({ follower: followerId, following: followingId }); //check existence of follow relationship
  };

  //creates a follow relationship between two users
  //returns the newly created follow object
  const follow = (followerId, followingId) => {
    return model.create({
      _id: uuidv4(), //generate unique ID for the follow relationship
      follower: followerId, //set follower user reference
      following: followingId, //set following user reference
    });
  };

  //removes a follow relationship between two users
  //returns the result of the delete operation
  const unfollow = (followerId, followingId) => {
    return model.deleteOne({ follower: followerId, following: followingId }); //delete the follow relationship
  };

  //counts the number of followers a user has
  //returns the count of users following the specified user
  const countFollowers = (userId) => {
    return model.countDocuments({ following: userId }); //count documents where the user is being followed
  };

  //counts the number of users a user is following
  //returns the count of users that the specified user is following
  const countFollowing = (userId) => {
    return model.countDocuments({ follower: userId }); //count documents where the user is the follower
  };

  //export DAO methods
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