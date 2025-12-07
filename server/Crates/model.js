import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("CrateModel", schema);
export default model;