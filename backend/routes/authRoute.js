import express from 'express';
import { forgotPassword, google, login, logout, register, resetPassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const authRouter =  express.Router();

authRouter.post("/register",register);
authRouter.post("/login", login);
authRouter.post("/google", google);
authRouter.post("/logout",verifyToken, logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.put("/reset-password/:token", resetPassword);


export default authRouter;


