import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    // Find user and exclude sensitive fields
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("[Auth Middleware] JWT Verification Error:", error.message);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
      error: error.message,
    });
  }
};

export default authorize;
