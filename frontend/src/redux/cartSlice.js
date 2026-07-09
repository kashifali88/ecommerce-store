import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action) => {
      state.loading = false;
      const items = action.payload.items || [];
      state.items = items;
      state.totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      state.totalPrice = items.reduce(
        (total, item) =>
          total + (item.productId?.price || item.price || 0) * item.quantity,
        0,
      );
    },
    fetchCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      ((state.totalQuantity = action.payload.items.reduce(
        (total, item) => total + item.quantity,
        0,
      )),
        (state.totalPrice = action.payload.items.reduce(
          (total, item) => total + (item.price || 0) * item.quantity,
          0,
        )));
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);

      if (item) {
        const price = item.productId?.price || item.price || 0;

        state.totalQuantity += quantity - item.quantity;
        state.totalPrice += (quantity - item.quantity) * price;
        item.quantity = quantity;
      }
    },
    removeCartItem: (state, action) => {
      const { id } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.quantity * item.price;
        state.items = state.items.filter((item) => item._id !== id);
      }
    },
    clearCart: (state) => {
      ((state.items = []), (state.totalQuantity = 0));
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCartFailure,
  addToCartStart,
  addToCartSuccess,
  updateCartItem,
  removeCartItem,
  fetchCartStart,
  fetchCartFailure,
  fetchCartSuccess,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
