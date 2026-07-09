import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  updateCartItem,
  removeCartItem,
} from "../../redux/cartSlice";

function UserCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: cartItems,
    loading,
    totalPrice,
    totalQuantity,
  } = useSelector((state) => state.cart);

  // fetch cart api
  const fetchUserCart = async () => {
    try {
      dispatch(fetchCartStart());

      const res = await fetch("/api/cart", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(fetchCartFailure(data.message || "Failed to fetch cart"));
        toast.error(data.message || "Failed to fetch cart");
        return;
      }

      dispatch(fetchCartSuccess(data.cart));
    } catch (error) {
      dispatch(fetchCartFailure(error.message || "Failed to fetch cart"));
      toast.error(error.message || "Failed to fetch cart");
    }
  };

  //  update cart api
  const handleUpdateCart = async (itemId, quantity) => {
    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId, quantity }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to update cart item");
        return;
      }
      dispatch(updateCartItem({ id: itemId, quantity }));
      toast.success("Cart item updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update cart item");
    }
  };

  //   delete cart api
  const deleteCartItem = async (itemId) => {
    try {
      const res = await fetch(`/api/cart/delete/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to remove cart item");
        return;
      }
      dispatch(removeCartItem({ id: itemId }));
      toast.success("Cart item removed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to remove cart item");
    }
  };

  
  useEffect(() => {
    fetchUserCart();
  }, []);

  const subtotal = totalPrice || 0;
  const delivery = 0;
  const total = subtotal + delivery;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 md:px-10">
      <div className="container mx-auto">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="mt-1 text-sm text-gray-500">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          <Link
            to="/"
            className="text-sm font-semibold text-red-500 hover:text-red-600"
          >
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <span className="text-4xl">🛒</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Looks like you have not added anything yet. Start shopping and
              your products will appear here.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-md bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.productId;
                const itemSubtotal = item.quantity * (product?.price || 0);

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 md:p-5"
                  >
                    <div className="flex gap-4">
                      <Link
                        to={`/product/${product?._id}`}
                        className="h-28 w-28 md:h-32 md:w-32 flex-shrink-0 rounded-md bg-gray-100 p-3"
                      >
                        <img
                          src={product?.images?.[0]}
                          alt={product?.productName}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <div>
                            <Link to={`/product/${product?._id}`}>
                              <h2 className="font-semibold text-gray-900 line-clamp-2">
                                {product?.productName}
                              </h2>
                            </Link>

                            <p className="mt-1 text-sm text-gray-500">
                              {product?.stock > 0 ? "In Stock" : "Out of Stock"}
                            </p>
                          </div>

                          <button
                            onClick={() => deleteCartItem(item._id)}
                            className="h-9 w-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Remove item"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="inline-flex w-fit items-center rounded-md border border-gray-200">
                            <button
                              onClick={() =>
                                handleUpdateCart(item._id, item.quantity - 1)
                              }
                              className="h-9 w-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              <FiMinus size={16} />
                            </button>

                            <span className="w-10 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleUpdateCart(item._id, item.quantity + 1)
                              }
                              className="h-9 w-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="font-bold text-red-600">
                              RS {product?.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              Subtotal: RS {itemSubtotal}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="h-fit rounded-lg border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>{totalQuantity}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>RS {subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>RS {total}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/checkout")
                }
                className="mt-6 w-full rounded-md bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
              >
                Proceed to Checkout
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                Secure checkout and easy returns
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCart;
