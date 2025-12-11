import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("LikeModel", schema); //create and export the Like model
export default model;