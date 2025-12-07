import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function UsersDao() {
  const findAllUsers = () => {
    return model.find({}, { password: 0 });
  };

  const findUserById = (userId) => {
    return model.findOne({ _id: userId }, { password: 0 });
  };

  const findUserByEmail = (email) => {
    return model.findOne({ email });
  };

  const findUserByUsername = (username) => {
    return model.findOne({ username });
  };

  const findUserByCredentials = (email, password) => {
    return model.findOne({ email, password });
  };

  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };

  const updateUser = (userId, userUpdates) => {
    return model.updateOne({ _id: userId }, { $set: userUpdates });
  };

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