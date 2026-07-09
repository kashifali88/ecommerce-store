import express from 'express';
import { createOrder, fetchOrders, getAllOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from "../middleware/verifyAdmin.js"

const orderRouter = express.Router();


orderRouter.post("/create",verifyToken, createOrder);
orderRouter.get("/orders",verifyToken, fetchOrders);
orderRouter.get("/admin/orders",verifyToken, verifyAdmin, getAllOrders);




export default orderRouter;