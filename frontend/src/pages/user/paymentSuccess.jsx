import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">

        <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-5" />

        <h1 className="text-3xl font-bold mb-3">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been received successfully and your order is being processed.
        </p>

        <div className="space-y-3">

          <Link
            to="/orders"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;