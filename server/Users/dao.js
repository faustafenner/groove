import { v4 as uuidv4 } from "uuid"; //for generating unique IDs
import model from "./model.js"; //importing the user model

export default function UsersDao() {

  // Data Access Object (DAO) methods for user operations'

  // Retrieves all users, excluding passwords
  // Returns an array of user objects
  const findAllUsers = () => {
    return model.find({}, { password: 0 });
  };

  // Finds a user by their unique ID
  // Returns the user object if found, otherwise null
  const findUserById = (userId) => {
    return model.findOne({ _id: userId }, { password: 0 });
  };

  // Finds a user by their email address
  // Returns the user object if found, otherwise null
  const findUserByEmail = (email) => {
    return model.findOne({ email });
  };

  // Finds a user by their username
  // Returns the user object if found, otherwise null
  const findUserByUsername = (username) => {
    return model.findOne({ username });
  };

  // Finds a user by their email and password (for authentication)
  // Returns the user object if credentials match, otherwise null
  const findUserByCredentials = (email, password) => {
    return model.findOne({ email, password });
  };

  // Creates a new user with the provided details
  // Returns the newly created user object
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };

  // Updates an existing user's details
  // Returns the result of the update operation
  const updateUser = (userId, userUpdates) => {
    return model.updateOne({ _id: userId }, { $set: userUpdates });
  };

  // Deletes a user by their unique ID
  // Returns the result of the delete operation
  const deleteUser = (userId) => {
    return model.deleteOne({ _id: userId });
  };


  return {
    findAllUsers,
    findUserById,
    findUserByEmail,
    findUserByUsername,
    findUserByCredentials,
    createUser,
    updateUser,
    deleteUser,
  };
}