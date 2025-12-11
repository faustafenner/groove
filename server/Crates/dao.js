import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CratesDao() {

  //dao methods for crate operations
  
  //find all public crates
  const findAllPublicCrates = () => {
    return model 
      .find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });
  };

  //find a crate by its unique ID
  //returns the crate object if found, otherwise null
  //populates user details excluding passwords
  const findCrateById = (crateId) => {
    return model.findOne({ _id: crateId }).populate("user", "-password");
  };

  //find crates created by a specific user
  //returns an array of crate objects created by the user
  //populates user details excluding passwords
  //can include private crates if specified
  const findCratesByUser = (userId, includePrivate = false) => {
    return model.find({ user: userId }).populate("user", "-password").sort({ createdAt: -1 });
  };

  //finds the most recent crates
  //returns an array of crate objects sorted by creation date
  //populates user details excluding passwords
  //limits the number of results to a specified limit (default is 10)
  const findRecentCrates = (limit = 10) => {
    return model
      .find()
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .limit(limit);
  };

  //creates a new crate with the provided details
  //returns the newly created crate object
  //assigns a unique ID and initializes an empty albums array
  const createCrate = (crate) => {
    const newCrate = { ...crate, _id: uuidv4(), albums: [] };
    return model.create(newCrate);
  };

  //updates an existing crate's details
  //returns the result of the update operation
  //sets updatedAt to current date
  const updateCrate = (crateId, updates) => {
    return model.updateOne(
      { _id: crateId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  };

  //deletes a crate by its unique ID
  //returns the result of the delete operation
  //removes the crate from the database
  const deleteCrate = (crateId) => {
    return model.deleteOne({ _id: crateId });
  };

  //adds an album to a crate
  //returns the result of the update operation
  //pushes the album into the crate's albums array
  //sets updatedAt to current date
  const addAlbumToCrate = (crateId, album) => {
    return model.updateOne(
      { _id: crateId },
      {
        $push: { albums: album },
        $set: { updatedAt: new Date() },
      }
    );
  };

  //removes an album from a crate
  //returns the result of the update operation
  //pulls the album from the crate's albums array based on Spotify album ID
  //sets updatedAt to current date
  const removeAlbumFromCrate = (crateId, spotifyAlbumId) => {
    return model.updateOne(
      { _id: crateId },
      {
        $pull: { albums: { spotifyAlbumId } },
        $set: { updatedAt: new Date() },
      }
    );
  };

  //export DAO methods
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