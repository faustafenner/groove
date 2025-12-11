import CratesDao from "./dao.js";

export default function CrateRoutes(app) {
  const dao = CratesDao();

  //function to check for PRO user
  const requireProUser = (req, res, next) => {
    const currentUser = req.session["currentUser"]; //get current user from session
    if (!currentUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    //only PRO users and admins can create crates
    if (currentUser.role !== "PRO" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "PRO membership required" });
      return;
    }
    next();
  };

  //handler to find recent crates
  const findRecentCrates = async (req, res) => {
    const { limit } = req.query; //get limit from query params
    const crates = await dao.findRecentCrates(parseInt(limit) || 10);
    res.json(crates);
  };

  //handler to find all public crates
  const findAllPublicCrates = async (req, res) => {
    const crates = await dao.findAllPublicCrates(); //get all public crates from dao
    res.json(crates);
  };

  //handler to find crates by a specific user
  const findCratesByUser = async (req, res) => {
    const { userId } = req.params; //extract user ID from route params
    const crates = await dao.findCratesByUser(userId);
    res.json(crates);
  };

  //handler to find a crate by its ID
  const findCrateById = async (req, res) => {
    const { crateId } = req.params; //extract crate ID from route params
    const crate = await dao.findCrateById(crateId);

    //if crate not found, return 404
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    res.json(crate);
  };

  //handler to create a new crate
  const createCrate = async (req, res) => {
    const currentUser = req.session["currentUser"]; //get current user from session
    const { title, description } = req.body; //extract crate details from request body

    //create crate via dao
    const newCrate = await dao.createCrate({
      user: currentUser._id,
      title,
      description,
    });

    const populatedCrate = await dao.findCrateById(newCrate._id); //populate user details
    res.json(populatedCrate);
  };

  //handler to update an existing crate
  const updateCrate = async (req, res) => {
    const { crateId } = req.params; //extract crate ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //find the crate to update
    const crate = await dao.findCrateById(crateId);
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    //only the crate owner can update the crate
    if (crate.user._id !== currentUser._id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { title, description } = req.body; //extract updated details from request body

    //update crate via dao
    await dao.updateCrate(crateId, { title, description });
    const updatedCrate = await dao.findCrateById(crateId);
    res.json(updatedCrate);
  };

  //handler to delete a crate
  const deleteCrate = async (req, res) => {
    const { crateId } = req.params; //extract crate ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //find the crate to delete

    const crate = await dao.findCrateById(crateId);
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }
//only the crate owner or an admin can delete the crate
    if (crate.user._id !== currentUser._id && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await dao.deleteCrate(crateId);
    res.sendStatus(200);
  };

  //handler to add an album to a crate
  const addAlbumToCrate = async (req, res) => {
    const { crateId } = req.params; //extract crate ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    const crate = await dao.findCrateById(crateId);
    if (!crate) {
      res.status(404).json({ message: "Crate not found" });
      return;
    }

    //only the crate owner can add albums
    if (crate.user._id !== currentUser._id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { spotifyAlbumId, albumName, artistName, albumImage } = req.body; //extract album details from request body

    //check if album already exists in crate

    const alreadyExists = crate.albums.some(
      (a) => a.spotifyAlbumId === spotifyAlbumId
    );
    if (alreadyExists) {
      res.status(400).json({ message: "Album already in crate" });
      return;
    }

    //add album via dao
    await dao.addAlbumToCrate(crateId, {
      spotifyAlbumId,
      albumName,
      artistName,
      albumImage,
    });

    const updatedCrate = await dao.findCrateById(crateId);
    res.json(updatedCrate);
  };

  //handler to remove an album from a crate
  const removeAlbumFromCrate = async (req, res) => {
    const { crateId, spotifyAlbumId } = req.params; //extract crate ID and album ID from route params
    const currentUser = req.session["currentUser"]; //get current user from session

    //find the crate

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

  //define routes
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