import express from 'express';
import { createCategory, deleteCategory, fetchAllCategory, fetchSingleCategory, updateCategory } from '../controllers/categoryController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const categoryRouter = express.Router();

categoryRouter.post("/create", verifyToken, verifyAdmin, createCategory);
categoryRouter.get("/fetch-all", fetchAllCategory);
categoryRouter.get("/fetch-single/:id", fetchSingleCategory);
categoryRouter.put("/update/:id", verifyToken, verifyAdmin, updateCategory);
categoryRouter.delete("/delete/:id", verifyToken, verifyAdmin, deleteCategory);

export default categoryRouter;