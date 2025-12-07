import mongoose from "mongoose";

const crateAlbumSchema = new mongoose.Schema(
  {
    spotifyAlbumId: { type: String, required: true },
    albumName: { type: String, required: true },
    artistName: { type: String, required: true },
    albumImage: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const crateSchema = new mongoose.Schema(
  {
    _id: String,
    user: { type: String, ref: "UserModel", required: true },
    title: { type: String, required: true, maxLength: 100 },
    description: { type: String, maxLength: 500, default: "" },
    isPublic: { type: Boolean, default: true },
    albums: [crateAlbumSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "crates" }
);

export default crateSchema;