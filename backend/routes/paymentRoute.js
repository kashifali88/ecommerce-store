import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/verifyToken.js";


const paymentRouter = express.Router();


paymentRouter.post(
    "/create-checkout-session",
    verifyToken,
    createCheckoutSession
);


export default paymentRouter;