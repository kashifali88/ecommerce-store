import Cart from "../models/cartModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";

// Add to Cart
export const addToCart = catchAsyncError(async (req, res, next) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({user:req.user.id})
  if(!cart){
    // new cart
    cart = await Cart.create({user:req.user.id, items: [{productId, quantity}]})
  } else {
    // check where product already in a cart
    const existingProductIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (existingProductIndex >= 0) {
       // increase just quantity 
        cart.items[existingProductIndex].quantity += quantity
    } else {
        // else  add new product
        cart.items.push({productId, quantity})
    }
  }
  await cart.save();
  res.status(200).json({success:true, message:'item added to cart', cart})
})

// update cart
export const updateCartItem = catchAsyncError(async (req, res, next) => {
  const {itemId, quantity } = req.body;
  if(!itemId || quantity < 1) return next(errorHandler(400, 'Invalid itemId or quantity'));
  const cart = await Cart.findOne({user:req.user._id})
  if(!cart) return next(errorHandler(404, 'Cart not found'));
  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
  if(itemIndex === -1) return next(errorHandler(404, 'Item not found in cart'));
  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  res.status(200).json({success:true, message:'Cart item updated', cart})

})

// delete cart item
export const deleteCartItem = catchAsyncError(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user:req.user._id});
  if(!cart) return next(errorHandler(404, 'Cart not found'));
  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
  if(itemIndex === -1) return next(errorHandler(404, 'Item not found in cart'));
  cart.items.splice(itemIndex, 1);
  await cart.save();
  res.status(200).json({success:true, message: "Cart item removed", cart});
})

// get user cart
export const getUserCart = catchAsyncError(async(req, res, next) => {
    const cart = await Cart.findOne({user:req.user.id}).populate("items.productId");
    if(!cart) return next(errorHandler(404, 'No item found in cart' ))
       res.status(200).json({success:true, cart}) 
})

























// Clear Cart
export const clearCart = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(errorHandler(404, "Cart not found"));
  }

  cart.items = [];
  cart.totalQuantity = 0;
  cart.totalPrice = 0;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart,
  });
});