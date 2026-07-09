import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import uploadRouter from './routes/uploadRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRouter from './routes/paymentRoute.js';


dotenv.config();
const server = express();

server.use(cors({
    origin: "*"
}));
server.use(express.json());
server.use(cookieParser());

// routes
server.use("/api/auth", authRouter);
server.use("/api/user", userRouter);
server.use("/api/category", categoryRouter);
server.use("/api", uploadRouter);
server.use("/api/product", productRouter);
server.use("/api/cart", cartRouter);
server.use("/api/order", orderRouter);
server.use("/api/payment", paymentRouter);



// error handling middleware
server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
   console.log(`Server is running on PORT:${PORT}`);
   connectDB();
})
