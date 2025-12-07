import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CratesDao() {
  const findAllPublicCrates = () => {
    return model
      .find({ isPublic: true })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
  };

  const findCrateById = (crateId) => {
    return model.findOne({ _id: crateId }).populate("user", "-password");
  };

  const findCratesByUser = (userId, includePrivate = false) => {
    const query = includePrivate
      ? { user: userId }
      : { user: userId, isPublic: true };
    return model.find(query).populate("user", "-password").sort({ createdAt: -1 });
  };

  const findRecentCrates = (limit = 10) => {
    return model
      .find({ isPublic: true })
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .limit(limit);
  };

  const createCrate = (crate) => {
    const newCrate = { ...crate, _id: uuidv4(), albums: [] };
    return model.create(newCrate);
  };

  const updateCrate = (crateId, updates) => {
    return model.updateOne(
      { _id: crateId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  };

  const deleteCrate = (crateId) => {
    return model.deleteOne({ _id: crateId });
  };

  const addAlbumToCrate = (crateId, album) => {
    return model.updateOne(
      { _id: crateId },
      {
        $push: { albums: album },
        $set: { updatedAt: new Date() },
      }
    );
  };

  const removeAlbumFromCrate = (crateId, spotifyAlbumId) => {
    return model.updateOne(
      { _id: crateId },
      {
        $pull: { albums: { spotifyAlbumId } },
        $set: { updatedAt: new Date() },
      }
    );
  };

  return {
    findAllPublicCrates,
    findCrateById,
    findCratesByUser,
    findRecentCrates,
    createCrate,
    updateCrate,
    deleteCrate,
    addAlbumToCrate,
    removeAlbumFromCrate,
  };
}