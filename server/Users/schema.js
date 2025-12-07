import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    bio: { type: String, default: "", maxLength: 500 },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["USER", "PRO", "ADMIN"],
      default: "USER",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

export default userSchema;