import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    _id: String, //like ID
    user: { type: String, ref: "UserModel", required: true }, //reference to user
    review: { type: String, ref: "ReviewModel", required: true }, //reference to review
    createdAt: { type: Date, default: Date.now }, //creation timestamp
  },
  { collection: "likes" } //name of mongodb collection
);

likeSchema.index({ user: 1, review: 1 }, { unique: true, sparse: true }); //unique index to prevent multiple likes by same user for same review

export default likeSchema; //export the schema