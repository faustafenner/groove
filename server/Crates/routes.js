import CratesDao from "./dao.js";

export default function CrateRoutes(app) {
  const dao = CratesDao();

  const requireProUser = (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    if (currentUser.role !== "PRO" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "PRO membership required" });
      return;
    }
    next();
  };

  const findRecentCrates = async (req, res) => {
    const { limit } = req.query;
    const crates = await dao.findRecentCrates(parseInt(limit) || 10);
    res.json(crates);
  };

  const findAllPublicCrates = async (req, res) => {
    const crates = await dao.findAllPublicCrates();
    res.json(crates);
  };

  const findCratesByUser = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session["currentUser"];
    const includePrivate = currentUser && currentUser._id === userId;
    const crates = await dao.findCratesByUser(userId, includePrivate);
    res.json(crates);
  };

  const findCrateById = async (req, res) => {
    const { crateId } = req.params;
    const crate = await dao.findCrateById(crateId);

    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    res.json(crate);
  };

  const createCrate = async (req, res) => {
    const currentUser = req.session["currentUser"];
    const { title, description } = req.body;

    const newCrate = await dao.createCrate({
      user: currentUser._id,
      title,
      description,
    });

    const populatedCrate = await dao.findCrateById(newCrate._id);
    res.json(populatedCrate);
  };

  const updateCrate = async (req, res) => {
    const { crateId } = req.params;
    const currentUser = req.session["currentUser"];

    const crate = await dao.findCrateById(crateId);
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    if (crate.user._id !== currentUser._id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { title, description } = req.body;
    await dao.updateCrate(crateId, { title, description });
    const updatedCrate = await dao.findCrateById(crateId);
    res.json(updatedCrate);
  };

  const deleteCrate = async (req, res) => {
    const { crateId } = req.params;
    const currentUser = req.session["currentUser"];

    const crate = await dao.findCrateById(crateId);
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    if (crate.user._id !== currentUser._id && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await dao.deleteCrate(crateId);
    res.sendStatus(200);
  };

  const addAlbumToCrate = async (req, res) => {
    const { crateId } = req.params;
    const currentUser = req.session["currentUser"];

    const crate = await dao.findCrateById(crateId);
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    if (crate.user._id !== currentUser._id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { spotifyAlbumId, albumName, artistName, albumImage } = req.body;

    const alreadyExists = crate.albums.some(
      (a) => a.spotifyAlbumId === spotifyAlbumId
    );
    if (alreadyExists) {
      res.status(400).json({ message: "Album already in crate" });
      return;
    }

    await dao.addAlbumToCrate(crateId, {
      spotifyAlbumId,
      albumName,
      artistName,
      albumImage,
    });

    const updatedCrate = await dao.findCrateById(crateId);
    res.json(updatedCrate);
  };

  const removeAlbumFromCrate = async (req, res) => {
    const { crateId, spotifyAlbumId } = req.params;
    const currentUser = req.session["currentUser"];

    const crate = await dao.findCrateById(crateId);
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    if (crate.user._id !== currentUser._id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await dao.removeAlbumFromCrate(crateId, spotifyAlbumId);
    const updatedCrate = await dao.findCrateById(crateId);
    res.json(updatedCrate);
  };

  app.get("/api/crates/recent", findRecentCrates);
  app.get("/api/crates/public", findAllPublicCrates);
  app.get("/api/crates/user/:userId", findCratesByUser);
  app.get("/api/crates/:crateId", findCrateById);
  app.post("/api/crates", requireProUser, createCrate);
  app.put("/api/crates/:crateId", requireProUser, updateCrate);
  app.delete("/api/crates/:crateId", requireProUser, deleteCrate);
  app.post("/api/crates/:crateId/albums", requireProUser, addAlbumToCrate);
  app.delete(
    "/api/crates/:crateId/albums/:spotifyAlbumId",
    requireProUser,
    removeAlbumFromCrate
  );
}