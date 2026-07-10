import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCartFailure, addToCartStart, addToCartSuccess } from '../redux/cartSlice'

function HorizontalCard({ category, heading }) {
  const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [scroll, setScroll] = useState(0);
  const scrollRef = useRef();
  const loadingList = new Array(13).fill(null)
  const dispatch = useDispatch();

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND}/api/product/category/${category}`);
      const result = await response.json();
      if(!response.ok || result.success === false){
        toast.error("Failed to fetch products", {
         toastId: "fetch-products-error",
        });
        return;
      }
      setData(result.products);
    } catch (error) {
        toast.error("Failed to fetch products",{
            toastId: "fetchProducts error"
        })
    } finally {
      setLoading(false);
    }
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 300;
  };

//  handle add to cart
const handleAddToCart = async (productId) => {
try {
    dispatch(addToCartStart())
    const res = await fetch(`${BACKEND}/api/cart/add`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials:"include",
        body: JSON.stringify({productId, quantity:1})
    })
    const data = await res.json();
    if(!res.ok || data.success === false){
        dispatch(addToCartFailure(data.message || "failed to add item to cart"))
        return;
    }
    dispatch(addToCartSuccess(data.cart))
    toast.success("Product successfully added to cart")

} catch (error) {
    dispatch(addToCartFailure(error.message || "failed to add item to cart"))
}
}

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="relative container mx-auto my-6 px-2">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>
      <div
        ref={scrollRef}
        className=" flex  items-center gap-4 overflow-scroll transition-all scroll-none"
      >
        {data?.length > 6 && (
          <>
            <button
              onClick={scrollLeft}
              className="hidden bg-slate-200 md:flex items-center p-2 rounded-full shadow absolute -left-6"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={scrollRight}
              className="hidden bg-slate-200 md:flex items-center p-2 rounded-full shadow absolute -right-6 "
            >
              <FaChevronRight />
            </button>
          </>
        )}
        {loading ? (
              loadingList?.map((product, index) => (
            <div className="relative w-40 md:w-56 rounded-sm shadow flex-shrink-0">
              <div className="hover:scale-105 bg-slate-200 w-32 md:w-56 h-26 md:h-36 p-4 rounded">
               
                <p className="absolute top-0 left-1 text-slate-600 text-sm font-semibold tracking-wider">
                  
                </p>
              </div>
              <div className="p-2 ">
                <h2 className="line-clamp-1 font-semibold text-slate-600">
                 
                </h2>
                <h2 className="text-md line-clamp-1 bg-slate-200 p-2 font-semibold text-red-400">
                  
                </h2>
                <button className="text-sm p-3 w-full rounded-lg  font-semibold text-white bg-slate-200 ">
                
                </button>
              </div>
            </div>
          ))
        ) : (
          data?.slice(0, 6).map((product,index) => (
              <div key={product?._id}  className="relative w-40 md:w-56 rounded-sm shadow flex-shrink-0">
                <Link to={`/product/${product?._id}`}>
              <div to="/product-detail/:id" className="hover:scale-105 bg-slate-200 w-32 md:w-56 h-26 md:h-36 p-4 rounded">
                <img
                  src={product?.images[0]}
                  alt={product?.productName}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
                <p className="absolute top-0 left-1 text-slate-600 text-sm font-semibold tracking-wider">
                  {product.category.name}
                </p>
              </div>
                </Link>
              <div className="p-2 ">
                <Link to={`/product/${product._id}`}>
                <h2 className="line-clamp-1 font-semibold text-slate-600">
                  {product?.productName}
                </h2>
                </Link>
                <h2 className="text-md line-clamp-1 font-semibold text-red-400">
                  RS {product?.price}
                </h2>
                <button onClick={()=> handleAddToCart(product._id)} className="text-sm p-2 w-full rounded-lg hover:opacity-90  font-semibold text-white bg-red-500">
                  Add to cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HorizontalCard;
