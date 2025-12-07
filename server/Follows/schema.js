import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    _id: String,
    follower: { type: String, ref: "UserModel", required: true },
    following: { type: String, ref: "UserModel", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "follows" }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

export default followSchema;