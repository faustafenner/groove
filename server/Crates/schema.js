import mongoose from "mongoose";

//schema for an album in a crate
//contains album details and the date it was added to the crate
//does not have an _id field as it is embedded in the crate schema
const crateAlbumSchema = new mongoose.Schema(
  {
    spotifyAlbumId: { type: String, required: true }, //Spotify album ID
    albumName: { type: String, required: true }, //album name
    artistName: { type: String, required: true }, //artist name
    albumImage: { type: String }, //album image URL
    addedAt: { type: Date, default: Date.now }, //date when album was added to crate
  },
  { _id: false } //no _id field as this is an embedded schema
);

//crate schema
const crateSchema = new mongoose.Schema(
  {
    _id: String, //crate ID
    user: { type: String, ref: "UserModel", required: true }, //reference to user who created the crate
    title: { type: String, required: true, maxLength: 100 }, //crate title
    description: { type: String, maxLength: 500, default: "" }, //crate description
    albums: [crateAlbumSchema], //array of albums in the crate
    createdAt: { type: Date, default: Date.now }, //creation timestamp
    updatedAt: { type: Date, default: Date.now }, //last update timestamp
  },
  { collection: "crates" } //name of mongodb collection
);

export default crateSchema; //export the crate schema