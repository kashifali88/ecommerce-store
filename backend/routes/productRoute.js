import { createProduct, deleteProduct, fetchAllProducts, fetchProductsByCategory, fetchSingleProduct, searchProducts, updateProduct } from "../controllers/productController.js";
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import express from 'express'
import Product from "../models/ProductModel.js";

const productRouter = express.Router();

productRouter.post("/create", verifyToken, verifyAdmin, createProduct)
productRouter.get("/fetch-all",  fetchAllProducts)
productRouter.get("/category/:category",  fetchProductsByCategory)
productRouter.get("/search", searchProducts)
productRouter.get("/fetch-single/:id",  fetchSingleProduct)
productRouter.put("/update/:id",  updateProduct)
productRouter.delete("/delete/:id",  verifyToken, verifyAdmin, deleteProduct);
productRouter.put("/fix-category", async (req, res) => {
  const result = await Product.updateMany(
    { category: "6a35177a58fa7d8bc9f6f8fc" },
    { $set: { category: "6a378b5d6c2cff6d311fc400" } }
  );

  res.json(result);
});


export default productRouter;