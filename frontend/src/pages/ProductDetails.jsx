import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useDispatch } from 'react-redux'
import { addToCartStart, addToCartSuccess, addToCartFailure } from "../redux/cartSlice";
import { toast } from "react-toastify";
import HorizontalCard from "../components/HorizontalCard";

function ProductDetails() {
      const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState({});
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const { id } = useParams();
  const dispatch = useDispatch()

  const fetchSingleProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND}/api/product/fetch-single/${id}`);
      const result = await res.json();

      if (!res.ok || result.success === false) {
        setError(result.message || "failed to fetch product");
        return;
      }

      setData(result.product);
      setActiveImage(result.product?.images?.[0] || "");
    } catch (error) {
      setError(error.message || "failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

 

  const handleAddToCart = async(productId) => {
try {
  dispatch(addToCartStart())
  const res = await fetch(`${BACKEND}/api/cart/add`, {
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({quantity:1, productId})
  })
  const data = await res.json();
  if(!res.ok || data.success === false){
    dispatch(addToCartFailure(data.message || "failed to add item to cart"))
    return;
  }
  dispatch(addToCartSuccess(data.cart))
  toast.success("Item added to cart")
} catch (error) {
  dispatch(addToCartFailure(error.message || "Failed to add item to cart"))
}
  }

  useEffect(() => {
    if (id) {
      fetchSingleProduct();
    }
  }, [id]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 md:px-10">

      {loading && (
        <div className="flex items-center justify-center my-32 mx-auto">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto rounded-md border border-red-200 bg-red-50 p-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      {!loading && !error && data?._id && (
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-4 md:p-8 rounded-lg shadow-sm">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[520px]">
              {data?.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-md border bg-gray-100 p-2 ${
                    activeImage === image
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${data?.productName} ${index + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>

            <div className="w-full bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[320px] md:min-h-[520px]">
              <img
                src={activeImage || data?.images?.[0]}
                alt={data?.productName}
                className="max-h-[480px] w-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-red-500 uppercase tracking-wide">
              {data?.category?.name || "Product"}
            </p>

            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {data?.productName}
            </h1>

            <p className="mt-5 text-gray-600 leading-7">
              {data?.description}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <p className="text-3xl font-bold text-red-600">
                RS {data?.price}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Inclusive of all taxes
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  data?.stock > 0
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {data?.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>

              {data?.stock > 0 && (
                <span className="text-sm text-gray-500">
                  {data?.stock} items available
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={()=>handleAddToCart(data?._id)} className="w-full sm:w-44 rounded-md bg-red-500 px-6 py-3 text-white font-semibold hover:bg-red-600 transition">
                Add to Cart
              </button>

              <button className="w-full sm:w-44 rounded-md border border-gray-300 px-6 py-3 text-gray-800 font-semibold hover:bg-gray-100 transition">
                Buy Now
              </button>
            </div>

            <div className="mt-8 border-t pt-5 text-sm text-gray-500 space-y-2">
              <p>Free delivery available on selected orders.</p>
              <p>Easy returns and secure checkout.</p>
            </div>
          </div>
        </div>
      )}
  <HorizontalCard category={"Airpodes"} heading={"Recommended Products"} loading={loading}  handleAddToCart={handleAddToCart}/>
    </div>
  );
}

export default ProductDetails;