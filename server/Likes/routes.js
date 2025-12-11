import LikesDao from "./dao.js";

export default function LikeRoutes(app) {
  const dao = LikesDao(); //instantiate dao

  //routes for dao like methods

  //get like count for a review
  const getLikeCount = async (req, res) => {
    const { reviewId } = req.params; //extract review ID from route params
    const count = await dao.countLikes(reviewId); //get like count from dao
    res.json({ count });
  };

  //check if current user has liked a review
  const checkLiked = async (req, res) => {
    const { reviewId } = req.params; //extract review ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //if no user logged in, return liked: false
    if (!currentUser) {
      res.json({ liked: false });
      return;
    }
 
    const like = await dao.hasUserLiked(currentUser._id, reviewId); //check if user has liked the review
    res.json({ liked: !!like });
  };

  //like a review
  const likeReview = async (req, res) => {
    const { reviewId } = req.params; //extract review ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //if no user logged in, return error
    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    //check if user has already liked the review
    const existing = await dao.hasUserLiked(currentUser._id, reviewId);
    if (existing) {
      res.status(400).json({ message: "Already liked" });
      return; //if user has already liked, return error
    }
 
    await dao.like(currentUser._id, reviewId); //like the review
    const count = await dao.countLikes(reviewId); //get updated like count
    res.json({ count }); //return updated count
  };

  //unlike a review
  const unlikeReview = async (req, res) => {
    const { reviewId } = req.params; //extract review ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //if no user logged in, return error

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    await dao.unlike(currentUser._id, reviewId); //unlike the review
    const count = await dao.countLikes(reviewId); //get updated like count
    res.json({ count });
  };

  //define routes and associate them with handlers
  app.get("/api/reviews/:reviewId/likes/count", getLikeCount);
  app.get("/api/reviews/:reviewId/likes/check", checkLiked);
  app.post("/api/reviews/:reviewId/likes", likeReview);
  app.delete("/api/reviews/:reviewId/likes", unlikeReview);

}