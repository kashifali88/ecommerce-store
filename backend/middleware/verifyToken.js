
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(errorHandler(401, "Not authorized: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("Authentication error:", error.message);
    return next(errorHandler(401, "Invalid or expired token"));
  }
};
