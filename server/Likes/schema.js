import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    _id: String,
    user: { type: String, ref: "UserModel", required: true },
    review: { type: String, ref: "ReviewModel", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "likes" }
);

likeSchema.index({ user: 1, review: 1 }, { unique: true });

export default likeSchema;