import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer'

// register user
export const register = catchAsyncError(async (req, res, next) => {
  const { username, email, password, avatar } = req.body;
  if (!username || !email || !password){
    return next(errorHandler(400, "Please fill all the fields"));
  }
  // check if user already exists
  const user = await User.findOne({ email });
  if (user) return next(errorHandler(401, "User already exists"));
  // hash password
  let hashPassword;
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }
  // create new user
  const newUser = new User({ username, email, password: hashPassword, avatar });
  await newUser.save();
  const { password: pass, ...userInfo } = newUser._doc;
  res
    .status(201)
    .json({
      success: true,
      message: "User registered successfully",
      user: userInfo,
    });
});

// login user
export const login = catchAsyncError(async (req, res, next) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return next(errorHandler(400, "Please fill all the fields"));
  }
  
  const user = await User.findOne({
    $or: [
      {email: login},
      {username: login}
    ]
  });
  if (!user) return next(errorHandler(404, "User not found"));
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(errorHandler(401, "Invalid credentials"));
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  const { password: pass, ...userInfo } = user._doc;
  res
    .status(200)
    .json({
      success: true,
      message: "User logged in successful",
      user: userInfo,
    });
});

// google
export const google = catchAsyncError(async (req, res, next) => {
  const { email, username, avatar } = req.body;
  if (!email || !username || !avatar) {
    return next(errorHandler(400, "Please fill all the fields"));
  }
  const existingUser = await User.findOne({ email });
if (existingUser) {
  const token = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { password, ...userInfo } = existingUser._doc;

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: userInfo,
  });
}

  // create new user
  const randomPassword =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const hashPassword = await bcrypt.hash(randomPassword, 10);
  const newUser = new User(
    {
      username: username
        ? username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8)
        : "user" + Math.random().toString(36).slice(-8),
        email,
        password:hashPassword,
        avatar
    });
    await newUser.save();
    const token = jwt.sign({id: newUser._id},
         process.env.JWT_SECRET_KEY,
         { expiresIn: '7d' }
        )
        res.cookie("token", token, {
            httpOnly:true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const { password: passCode, ...userDetails } = newUser._doc;
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: userDetails
        });
});

// logout api
export const logout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });

});

// forgotPassword api
export const forgotPassword = catchAsyncError(async(req, res, next) => {
  const { email } = req.body;
  if(!email) return next(errorHandler(400, 'Please enter email to reset your password'));
  const user = await User.findOne({email});
  if(!user) return next(errorHandler(404, 'User not found!'))
    const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    }
  })
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    text: `Please click on the following link to reset your password ${resetUrl}`
  }
  await transporter.sendMail(mailOptions)
  res.status(200).json({success:true, message: "Password reset link sent successful"})
})

// reset-password api
export const resetPassword = catchAsyncError(async(req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if(!password) return next(errorHandler(400, 'Password is required'));
  const user = await User.findOne({resetPasswordToken: token, resetPasswordExpire: {$gt:Date.now()}});
  if(!user) return next(errorHandler(400, "Invalid token or expired"))
    user.password = await bcrypt.hash(password,10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire =  undefined;
  await user.save();
  res.status(200).json({success:true, message:'Password reset successful'})

})