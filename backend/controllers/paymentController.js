import stripe from "../config/stripe.js";
import Payment from "../models/paymentModel.js";
import { catchAsyncError } from '../utils/catchAsyncError.js'

export const createCheckoutSession = catchAsyncError(async (req, res, next) => {
    const { orderId, products, totalAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: products.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.title,
            images: [item.image],
          },

          unit_amount: item.price * 100,
        },

        quantity: item.quantity,
      })),

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/payment-success`,

      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    const payment = await Payment.create({
      orderId,

      userId: req.user.id,

      stripeSessionId: session.id,

      amount: totalAmount,

      status: "pending",
    });

    res.status(200).json({
      success: true,
      url: session.url,
      payment,
    });

})
