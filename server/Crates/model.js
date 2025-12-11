import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("CrateModel", schema); //create and export the Crate model
export default model;