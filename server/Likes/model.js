import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("LikeModel", schema);
export default model;