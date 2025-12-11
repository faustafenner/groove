import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    _id: String, //review ID
    user: { type: String, ref: "UserModel", required: true }, //reference to user
    spotifyAlbumId: { type: String, required: true }, //Spotify album ID
    albumName: { type: String, required: true }, //album name
    artistName: { type: String, required: true }, //artist name
    albumImage: { type: String }, //album image URL
    rating: { type: Number, required: true, min: 1, max: 5 }, //rating from 1 to 5
    content: { type: String, required: true, maxLength: 5000 }, //review content
    createdAt: { type: Date, default: Date.now }, //creation timestamp
    updatedAt: { type: Date, default: Date.now }, //last update timestamp
  },
  { collection: "reviews" } //name of mongobdb collection
);

reviewSchema.index({ user: 1, spotifyAlbumId: 1 }, { unique: true }); //unique index to prevent multiple reviews by same user for same album

export default reviewSchema;