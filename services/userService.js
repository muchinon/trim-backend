import User from "../models/User.js";
import Url from "../models/Url.js";

export const createUser = async (email, password) => {
  const user = new User({ email, password });
  await user.save();
  return user;
};

export const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const getUserUrls = async (userId) => {
  const urls = await Url.find({ createdBy: userId }).select(
    "shortCode originalUrl -_id"
  );
  return urls;
};
