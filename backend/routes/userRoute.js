import { deleteUser, deleteUserForAdmin, fetchUser, getAllUsers, getSingleUser, updateUser, updateUserRole } from "../controllers/userController.js";
import {  verifyToken } from "../middleware/verifyToken.js"
import {  verifyAdmin } from "../middleware/verifyAdmin.js"
import express from 'express';

const userRouter = express.Router()
userRouter.get("/admin/get-users", verifyToken, verifyAdmin, getAllUsers);
userRouter.get("/admin/get-user/:id", verifyToken, verifyAdmin, getSingleUser);
userRouter.delete("/admin/delete-user/:id", verifyToken, verifyAdmin, deleteUserForAdmin);
userRouter.put("/admin/update-role/:id", verifyToken, verifyAdmin, updateUserRole);
userRouter.get("/fetch", verifyToken, fetchUser);
userRouter.put("/update", verifyToken, updateUser);
userRouter.delete("/delete", verifyToken, deleteUser);

export default userRouter;