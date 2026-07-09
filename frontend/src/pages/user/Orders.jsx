import React, { useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/order/orders", {
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      
      if (!res.ok || !data.success) {
        toast.error(data.message);
        return;
      }

      setOrders(data.orders);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <FaBox className="text-red-500" />
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold">
            No Orders Found
          </h2>

          <p className="text-gray-500 mt-2">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-xl p-6"
            >

              <div className="flex flex-col md:flex-row md:justify-between gap-3 border-b pb-4">

                <div>
                  <h2 className="font-bold">
                    Order ID
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {order._id}
                  </p>
                </div>

                <div>
                  <h2 className="font-bold">
                    Date
                  </h2>

                  <p>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h2 className="font-bold">
                    Payment
                  </h2>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    {order.paymentMethod}
                  </span>
                </div>

                <div>
                  <h2 className="font-bold">
                    Total
                  </h2>

                  <p className="font-semibold text-red-500">
                    RS {order.totalAmount}
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-4">

                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-center border rounded-lg p-3"
                  >

                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 object-contain border rounded"
                    />

                    <div className="flex-1">

                      <h3 className="font-semibold">
                        {product.title}
                      </h3>

                      <p className="text-gray-500">
                        Quantity : {product.quantity}
                      </p>

                      <p className="text-red-500 font-bold">
                        RS {product.price}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Orders;