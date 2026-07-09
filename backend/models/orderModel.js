import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      image: String,
      title: String,
      quantity: Number,
      price: Number,
    },
  ],

  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
  },

  paymentMethod: {
    type: String,
    enum: ["cod", "card"],
    default: "cod",
  },

  subTotal: Number,
  totalAmount: Number,

  orderStatus: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
},
{
  timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);
export default Order;