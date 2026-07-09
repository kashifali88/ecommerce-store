import React, { useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchAllOrders = async () => {
    try {
      const res = await fetch("/api/order/admin/orders", {
        credentials: "include",
      });

      const data = await res.json();

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
    fetchAllOrders();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading Orders...
      </div>
    );
  }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <FaBox className="text-red-500" />
        All Orders
      </h1>


      {orders.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold">
            No Orders Found
          </h2>
        </div>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-6"
            >

              {/* Order Header */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-300 pb-4">

                <div>
                  <p className="font-bold">
                    Order ID
                  </p>
                  <p className="text-sm text-gray-500 break-all">
                    {order._id}
                  </p>
                </div>


                <div>
                  <p className="font-bold">
                    Customer
                  </p>

                  <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.shippingAddress.email}
                  </p>
                </div>


                <div>
                  <p className="font-bold">
                    Payment
                  </p>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {order.paymentMethod}
                  </span>
                </div>


                <div>
                  <p className="font-bold">
                    Total
                  </p>

                  <p className="text-red-500 font-bold">
                    RS {order.totalAmount}
                  </p>
                </div>

              </div>



              {/* Products */}

              <div className="mt-5 space-y-3">

                <h3 className="font-bold text-lg">
                  Products
                </h3>


                {order.products.map((product,index)=>(

                  <div
                    key={index}
                    className="flex items-center gap-4 border border-gray-300 rounded-lg p-3"
                  >

                    <img
                      src={product.image}
                      className="w-16 h-16 object-contain border border-gray-300 rounded"
                    />


                    <div>

                      <p className="font-semibold">
                        {product.title}
                      </p>

                      <p className="text-gray-500">
                        Qty: {product.quantity}
                      </p>

                      <p className="text-red-500">
                        RS {product.price}
                      </p>

                    </div>

                  </div>

                ))}

              </div>



              {/* Status */}

              <div className="mt-5 flex justify-between items-center">

                <p>
                  Status:
                  <span className="ml-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    {order.orderStatus}
                  </span>
                </p>


                <p className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

              </div>


            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default AdminOrders;