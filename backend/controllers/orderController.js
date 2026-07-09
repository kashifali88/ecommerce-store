import { catchAsyncError } from '../utils/catchAsyncError.js';
import Order from '../models/orderModel.js'


export const createOrder = catchAsyncError(async (req, res, next) => {
const {  products, shippingAddress, paymentMethod, subTotal, totalAmount } = req.body;
const order = await Order.create({userId:req.user.id, products, shippingAddress, paymentMethod, subTotal, totalAmount});
await order.save();
res.status(201).json({
  success: true,
  order
});
})

export const fetchOrders = catchAsyncError(async(req, res, next) => {
  const orders = await Order.find({userId:req.user.id});
  res.status(200).json({success:true, orders})
})

// admin
export const getAllOrders = catchAsyncError(async(req,res, next) => {
  const orders = await Order.find({});
  res.status(200).json({success:true, orders})
})