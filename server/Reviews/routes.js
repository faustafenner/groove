import ReviewsDao from "./dao.js";

export default function ReviewRoutes(app) {
  const dao = ReviewsDao(); //inialitze reviews dao

  //handler to retrieve recent reviews
  const findRecentReviews = async (req, res) => {
    const { limit } = req.query; //extract limit from query params
    const reviews = await dao.findRecentReviews(parseInt(limit) || 10); //call dao method, limit defaults to 10
    res.json(reviews); //send reviews as json response
  };

  //handler to retrieve reviews for a specific album
  const findReviewsByAlbum = async (req, res) => {
    const { spotifyAlbumId } = req.params; //extract album ID from route params
    const reviews = await dao.findReviewsByAlbum(spotifyAlbumId);
    res.json(reviews);
  };

  //handler to retrieve reviews written by a specific user
  const findReviewsByUser = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const reviews = await dao.findReviewsByUser(userId);
    res.json(reviews);
  };

  //handler to create a new review
  const createReview = async (req, res) => {
    const currentUser = req.session["currentUser"]; //get current user from session

    //ensure user is logged in
    if (!currentUser) {
      res.status(401).json({ message: "Must be logged in to review" });
      return;
    }

    //extract review details from request body
    const { spotifyAlbumId, albumName, artistName, albumImage, rating, content } =
      req.body;

      //check if user has already reviewed this album
    const existingReview = await dao.findUserReviewForAlbum(
      currentUser._id,
      spotifyAlbumId
    );
    //if so, return error
    if (existingReview) {
      res.status(400).json({ message: "You already reviewed this album" });
      return;
    }

    //create new review
    const newReview = await dao.createReview({
      user: currentUser._id,
      spotifyAlbumId,
      albumName,
      artistName,
      albumImage,
      rating,
      content,
    });

    //retrieve the populated review to return
    const populatedReview = await dao.findReviewById(newReview._id);
    res.json(populatedReview);
  };

  //handler to delete a review
  const deleteReview = async (req, res) => {
    const { reviewId } = req.params; //extract review ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //ensure user is logged in

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    //check if review exists
    const review = await dao.findReviewById(reviewId);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

      //only the review author or an admin can delete the review
    if (review.user._id !== currentUser._id && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    //delete the review
    await dao.deleteReview(reviewId);
    res.sendStatus(200);
  };

  //handler to update a review
  const updateReview = async (req, res) => {
    const { reviewId } = req.params; //extract review ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //ensure user is logged in

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    //check if review exists
    const review = await dao.findReviewById(reviewId);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    //only the review author can update the review
    if (review.user._id !== currentUser._id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    //extract updated details from request body
    const { rating, content } = req.body;

    await dao.updateReview(reviewId, { rating, content }); //update the review

    //retrieve and return the updated review
    const updatedReview = await dao.findReviewById(reviewId);
    res.json(updatedReview);
  };

  //define routes and associate them with handlers
  app.get("/api/reviews/recent", findRecentReviews);
  app.get("/api/reviews/album/:spotifyAlbumId", findReviewsByAlbum);
  app.get("/api/reviews/user/:userId", findReviewsByUser);
  app.post("/api/reviews", createReview);
  app.put("/api/reviews/:reviewId", updateReview);
  app.delete("/api/reviews/:reviewId", deleteReview);
}