import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

 const Checkout = () => {
    const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "cod", 
    });
 const dispatch = useDispatch();
 const { items: cartItems, totalPrice, totalQuantity } = useSelector((state) => state.cart);


 const subTotal = totalPrice || 0;
 const delivery = 0;
 const total = subTotal + delivery;
 const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]:e.target.value}))
 }

 const handleSubmitForm = async(e)=> {
e.preventDefault();
const orderData = {
    shippingAddress: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
    },

    paymentMethod: formData.paymentMethod,

    products: cartItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.images[0],
      title: item.productId.productName,
      quantity: item.quantity,
      price: item.productId.price,
    })),

    subTotal: subTotal,
    totalAmount: total,
  };
try {
    const res = await fetch("/api/order/create", {
        method: "POST",
        headers :{
            "Content-Type": "application/json"
        },
        credentials:"include",
        body: JSON.stringify(orderData)
    })
    const data = await res.json();
    if(!res.ok || data.success === false) {
        toast.error(data.message);
        return
    }
    if (formData.paymentMethod === "cod"){
        toast.success("Order created success");
        return;
    }
    if(formData.paymentMethod === "card") {
        const stripeRes = await fetch("/api/payment/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({orderId: data.order._id, products: orderData.products,
          totalAmount: total})
        })
        const stripeData = await stripeRes.json();
         if(!stripeRes.ok){
        toast.error(stripeData.message);
        return;
      }
       // Redirect to Stripe
      window.location.href = stripeData.url;
    }
} catch (error) {
    toast.error(error.message)
}
 }
  return (
   <div className="min-h-screen bg-gray-100 py-8">
  <form onSubmit={handleSubmitForm} className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* LEFT */}
    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow">

      <h2 className="text-2xl font-bold mb-6">
        Shipping Information
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3"
        />

        <input
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3"
        />

        <input
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 col-span-2"
        />

        <input
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 col-span-2"
        />

        <input
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 col-span-2"
        />

        <input
          placeholder="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3"
        />

        <input
          placeholder="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3"
        />

      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">
        Payment Method
      </h2>

      <div className="space-y-3">

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value={formData.paymentMethod === "cod"}
            onChange={handleChange}
            defaultChecked
          />
          Cash on Delivery
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value={formData.paymentMethod === "card"}
            onChange={handleChange}
            value="card"
          />
          Credit / Debit Card
        </label>

      </div>
    </div>

    {/* RIGHT */}
    <div className="bg-white rounded-xl p-6 shadow h-fit">

      <h2 className="text-2xl font-bold mb-5">
        Order Summary
      </h2>

      <div className="space-y-4">

        {cartItems.map((item)=>{

          const product=item.productId;

          return(

            <div
              key={item._id}
              className="flex gap-4"
            >

              <img
                src={product.images[0]}
                className="w-20 h-20 object-contain border border-gray-300 rounded"
              />

              <div className="flex-1">

                <h3 className="font-semibold">
                  {product.productName}
                </h3>

                <p className="text-sm text-gray-500">
                  Qty : {item.quantity}
                </p>

                <p className="font-bold text-red-500">
                  RS {product.price}
                </p>

              </div>

            </div>

          )

        })}

      </div>

      <div className="border-t border-gray-500 mt-6 pt-5 space-y-3">

        <div className="flex justify-between">
          <span>Items</span>
          <span>{totalQuantity}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>RS {subTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-green-600">
            Free
          </span>
        </div>

        <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>RS {total}</span>
        </div>
        <button className="mt-8 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
  Place Order
</button>

      </div>

    </div>

  </form>
</div>
  );
};
export default Checkout