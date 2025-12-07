import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

import UserRoutes from "./Users/routes.js";
import ReviewRoutes from "./Reviews/routes.js";
import CrateRoutes from "./Crates/routes.js";
import FollowRoutes from "./Follows/routes.js";
import LikeRoutes from "./Likes/routes.js";
import SpotifyRoutes from "./Spotify/routes.js";

const app = express();

// Check if we're in production
const isProduction = process.env.NODE_ENV === "production";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/groove";

// Trust proxy - IMPORTANT for Render/Vercel (cookies won't work without this)
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL, // Set this in Render to your Vercel URL
    ].filter(Boolean), // Removes undefined/null values
    credentials: true,
  })
);

app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: CONNECTION_STRING,
      collectionName: "sessions",
    }),
    cookie: {
      secure: isProduction, // true in production (HTTPS), false locally
      sameSite: isProduction ? "none" : "lax", // "none" required for cross-site cookies
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

UserRoutes(app);
ReviewRoutes(app);
CrateRoutes(app);
FollowRoutes(app);
LikeRoutes(app);
SpotifyRoutes(app);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});