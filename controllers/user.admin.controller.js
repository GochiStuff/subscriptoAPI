// user.controller.js
import User from "../models/user.model.js";

// Get all users (admin/dev)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
