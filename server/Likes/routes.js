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
}