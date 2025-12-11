import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    _id: String, //follow ID
    follower: { type: String, ref: "UserModel", required: true }, //follower user reference
    following: { type: String, ref: "UserModel", required: true }, //following user reference
    createdAt: { type: Date, default: Date.now }, //creation timestamp
  },
  { collection: "follows" } //name of mongodb collection
);

followSchema.index({ follower: 1, following: 1 }, { unique: true }); //unique index to prevent multiple follows by same user

export default followSchema;