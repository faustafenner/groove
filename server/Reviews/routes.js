import ReviewsDao from "./dao.js";

export default function ReviewRoutes(app) {
  const dao = ReviewsDao();

  const findRecentReviews = async (req, res) => {
    const { limit } = req.query;
    const reviews = await dao.findRecentReviews(parseInt(limit) || 10);
    res.json(reviews);
  };

  const findReviewsByAlbum = async (req, res) => {
    const { spotifyAlbumId } = req.params;
    const reviews = await dao.findReviewsByAlbum(spotifyAlbumId);
    res.json(reviews);
  };

  const findReviewsByUser = async (req, res) => {
    const { userId } = req.params;
    const reviews = await dao.findReviewsByUser(userId);
    res.json(reviews);
  };

  const createReview = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Must be logged in to review" });
      return;
    }

    const { spotifyAlbumId, albumName, artistName, albumImage, rating, content } =
      req.body;

    const existingReview = await dao.findUserReviewForAlbum(
      currentUser._id,
      spotifyAlbumId
    );
    if (existingReview) {
      res.status(400).json({ message: "You already reviewed this album" });
      return;
    }

    const newReview = await dao.createReview({
      user: currentUser._id,
      spotifyAlbumId,
      albumName,
      artistName,
      albumImage,
      rating,
      content,
    });

    const populatedReview = await dao.findReviewById(newReview._id);
    res.json(populatedReview);
  };

  const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const review = await dao.findReviewById(reviewId);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (review.user._id !== currentUser._id && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await dao.deleteReview(reviewId);
    res.sendStatus(200);
  };

  app.get("/api/reviews/recent", findRecentReviews);
  app.get("/api/reviews/album/:spotifyAlbumId", findReviewsByAlbum);
  app.get("/api/reviews/user/:userId", findReviewsByUser);
  app.post("/api/reviews", createReview);
  app.delete("/api/reviews/:reviewId", deleteReview);
}