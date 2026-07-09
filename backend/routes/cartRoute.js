import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addToCart,
} from "../controllers/cartController.js";
import { getUserCart, updateCartItem, deleteCartItem } from "../controllers/CartController.js";

const cartRouter = express.Router();

// Add product to cart
cartRouter.post("/add", verifyToken, addToCart);

//  Get logged-in user's cart
cartRouter.get("/", verifyToken, getUserCart);

// // Update quantity of a cart item
cartRouter.put("/update", verifyToken, updateCartItem);

// // Remove a product from cart
cartRouter.delete("/delete/:itemId", verifyToken, deleteCartItem);

// // Clear entire cart
// cartRouter.delete("/clear", verifyToken, clearCart);

export default cartRouter;