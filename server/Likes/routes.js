import LikesDao from "./dao.js";

export default function LikeRoutes(app) {
  const dao = LikesDao();

  const getLikeCount = async (req, res) => {
    const { reviewId } = req.params;
    const count = await dao.countLikes(reviewId);
    res.json({ count });
  };

  const checkLiked = async (req, res) => {
    const { reviewId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.json({ liked: false });
      return;
    }

    const like = await dao.hasUserLiked(currentUser._id, reviewId);
    res.json({ liked: !!like });
  };

  const likeReview = async (req, res) => {
    const { reviewId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const existing = await dao.hasUserLiked(currentUser._id, reviewId);
    if (existing) {
      res.status(400).json({ message: "Already liked" });
      return;
    }

    await dao.like(currentUser._id, reviewId);
    const count = await dao.countLikes(reviewId);
    res.json({ count });
  };

  const unlikeReview = async (req, res) => {
    const { reviewId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    await dao.unlike(currentUser._id, reviewId);
    const count = await dao.countLikes(reviewId);
    res.json({ count });
  };

  app.get("/api/reviews/:reviewId/likes/count", getLikeCount);
  app.get("/api/reviews/:reviewId/likes/check", checkLiked);
  app.post("/api/reviews/:reviewId/likes", likeReview);
  app.delete("/api/reviews/:reviewId/likes", unlikeReview);

  // Crate likes routes
  const getCrateLikeCount = async (req, res) => {
    const { crateId } = req.params;
    const count = await dao.countCrateLikes(crateId);
    res.json({ count });
  };

  const checkCrateLiked = async (req, res) => {
    const { crateId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.json({ liked: false });
      return;
    }

    const like = await dao.hasUserLikedCrate(currentUser._id, crateId);
    res.json({ liked: !!like });
  };

  const likeCrate = async (req, res) => {
    const { crateId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const existing = await dao.hasUserLikedCrate(currentUser._id, crateId);
    if (existing) {
      res.status(400).json({ message: "Already liked" });
      return;
    }

    await dao.likeCrate(currentUser._id, crateId);
    const count = await dao.countCrateLikes(crateId);
    res.json({ count });
  };

  const unlikeCrate = async (req, res) => {
    const { crateId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    await dao.unlikeCrate(currentUser._id, crateId);
    const count = await dao.countCrateLikes(crateId);
    res.json({ count });
  };

  app.get("/api/crates/:crateId/likes/count", getCrateLikeCount);
  app.get("/api/crates/:crateId/likes/check", checkCrateLiked);
  app.post("/api/crates/:crateId/likes", likeCrate);
  app.delete("/api/crates/:crateId/likes", unlikeCrate);
}