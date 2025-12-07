import FollowsDao from "./dao.js";

export default function FollowRoutes(app) {
  const dao = FollowsDao();

  const getFollowers = async (req, res) => {
    const { userId } = req.params;
    const followers = await dao.findFollowers(userId);
    res.json(followers.map((f) => f.follower));
  };

  const getFollowing = async (req, res) => {
    const { userId } = req.params;
    const following = await dao.findFollowing(userId);
    res.json(following.map((f) => f.following));
  };

  const checkFollowing = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.json({ isFollowing: false });
      return;
    }

    const follow = await dao.isFollowing(currentUser._id, userId);
    res.json({ isFollowing: !!follow });
  };

  const getFollowCounts = async (req, res) => {
    const { userId } = req.params;
    const [followers, following] = await Promise.all([
      dao.countFollowers(userId),
      dao.countFollowing(userId),
    ]);
    res.json({ followers, following });
  };

  const followUser = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (currentUser._id === userId) {
      res.status(400).json({ message: "Cannot follow yourself" });
      return;
    }

    const existing = await dao.isFollowing(currentUser._id, userId);
    if (existing) {
      res.status(400).json({ message: "Already following" });
      return;
    }

    await dao.follow(currentUser._id, userId);
    res.sendStatus(200);
  };

  const unfollowUser = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    await dao.unfollow(currentUser._id, userId);
    res.sendStatus(200);
  };

  app.get("/api/users/:userId/followers", getFollowers);
  app.get("/api/users/:userId/following", getFollowing);
  app.get("/api/users/:userId/is-following", checkFollowing);
  app.get("/api/users/:userId/follow-counts", getFollowCounts);
  app.post("/api/users/:userId/follow", followUser);
  app.delete("/api/users/:userId/follow", unfollowUser);
}