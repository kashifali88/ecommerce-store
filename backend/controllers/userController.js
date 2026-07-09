import User from "../models/userModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//-----------------------------------------------ADMIN ONLY -------------------------------------------------//
// for admin
export const getAllUsers = catchAsyncError(async(req, res, next) => {
    const users = await User.find({});
    const safeUsers = users.map((user) => {
        const {password, ...userInfo} = user._doc;
        return userInfo;
    })
    res.status(200).json({success:true, users:safeUsers})

})
// for admin
export const getSingleUser = catchAsyncError(async(req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, 'User not found'));
    const {password, ...userInfo} = user._doc;
    res.status(200).json({success:true, user:userInfo})
})

// for admin
export const deleteUserForAdmin = catchAsyncError(async(req, res, next) => {
    const id = req.params.id;
    const deleteUser = await User.findByIdAndDelete(id);
    if(!deleteUser) return next(errorHandler(404, 'User not found'))
        res.status(200).json({success:true, message:"User Deleted", deleteUser})
});

export const updateUserRole = catchAsyncError(async(req, res, next) => {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) return next(errorHandler(400, 'Invalid role'));
    const user = await User.findByIdAndUpdate(req.params.id, {$set: {role}}, {new:true});
    if (!user) return next(errorHandler(404, "User not found"))
        const { password: pass, ...userInfo} = user._doc;
    res.status(201).json({success:true, message: "User role updated", user:userInfo})
})

//-----------------------------------------------USER ONLY -------------------------------------------------//
// fetchUser for user
export const fetchUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(errorHandler(404, "User not found"));
const {password: pass, ...userInfo} = user._doc
  return res.status(200).json({
    success: true,
    user:userInfo,
  });
});

// update user
export const updateUser = catchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user.id);
  if (!user) return next(errorHandler(404, "User not found"));

  // -----------------------
  // BASIC INFO UPDATE
  // -----------------------
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;
  if (req.body.avatar) user.avatar = req.body.avatar;

  // -----------------------
  // PASSWORD UPDATE (SECURE)
  // -----------------------
  if (req.body.currentPassword && req.body.newPassword) {

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isMatch) {
      return next(errorHandler(400, "Current password is incorrect"));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(errorHandler(400, "New passwords do not match"));
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
  }

  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.password = undefined

  res.status(200).json({
    success: true,
    message: "User updated",
    user
  });
});


// delete user for user
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(errorHandler(401, "Wrong credentials"));
  }
  await User.findByIdAndDelete(req.user.id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

