import FollowsDao from "./dao.js";

export default function FollowRoutes(app) {
  const dao = FollowsDao(); //instantiate dao

  //routes for dao follow methods
 
  //get followers of a user
  const getFollowers = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const followers = await dao.findFollowers(userId); //get followers from dao
    res.json(followers.map((f) => f.follower)); //return array of follower user objects
  };

  //get users followed by a user
  const getFollowing = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const following = await dao.findFollowing(userId); //get following from dao
    res.json(following.map((f) => f.following)); //return array of following user objects
  };


  //check if current user is following another user
  const checkFollowing = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //if no user logged in, return isFollowing: false
    if (!currentUser) {
      res.json({ isFollowing: false });
      return;
    }

    //check follow status from dao
    const follow = await dao.isFollowing(currentUser._id, userId);
    res.json({ isFollowing: !!follow });
  };

  //get follower and following counts for a user
  const getFollowCounts = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const [followers, following] = await Promise.all([  //runs both counts in parallel
      dao.countFollowers(userId), //count followers
      dao.countFollowing(userId), //count following
    ]);
    res.json({ followers, following });
  };

  //follow a user
  const followUser = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //ensure user is logged in

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    //prevent following oneself
    if (currentUser._id === userId) {
      res.status(400).json({ message: "Cannot follow yourself" });
      return;
    }

    const existing = await dao.isFollowing(currentUser._id, userId); //check if already following
    if (existing) {
      res.status(400).json({ message: "Already following" });
      return;
    }

    await dao.follow(currentUser._id, userId); //create follow relationship
    res.sendStatus(200); //return success status
  };

  //unfollow a user
  const unfollowUser = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //ensure user is logged in

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    await dao.unfollow(currentUser._id, userId); //remove follow relationship
    res.sendStatus(200); //return success status
  };

  //define routes and associate them with handlers
  app.get("/api/users/:userId/followers", getFollowers);
  app.get("/api/users/:userId/following", getFollowing);
  app.get("/api/users/:userId/is-following", checkFollowing);
  app.get("/api/users/:userId/follow-counts", getFollowCounts);
  app.post("/api/users/:userId/follow", followUser);
  app.delete("/api/users/:userId/follow", unfollowUser);
}