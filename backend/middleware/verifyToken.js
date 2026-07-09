import { errorHandler } from "../utils/errorHandler.js"
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";


export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(errorHandler(401, "Not authorized"));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id);

  if (!user) return next(errorHandler(404, "User not found"));

  req.user = user; // REAL DB USER (not token data)
  next();
};