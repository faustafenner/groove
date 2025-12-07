import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    _id: String,
    user: { type: String, ref: "UserModel", required: true },
    spotifyAlbumId: { type: String, required: true },
    albumName: { type: String, required: true },
    artistName: { type: String, required: true },
    albumImage: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true, maxLength: 5000 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "reviews" }
);

reviewSchema.index({ user: 1, spotifyAlbumId: 1 }, { unique: true });

export default reviewSchema;