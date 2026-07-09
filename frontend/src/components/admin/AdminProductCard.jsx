import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";


export default function AdminProductCard({ product, setProducts }) {
  const navigate = useNavigate();
  
  const handleDeleteProduct = async(id) => {
    try {
      const res = await fetch(`/api/product/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials:"include"
    })
    const data = await res.json();
    if (!res.ok || data.success === false) {
      toast.error(data.message || "Failed to delete product")
      return;
    }
    setProducts((prev) => prev.filter((p) => p._id !== id))
    toast.success('Product deleted successful')

    } catch (error) {
      toast.error(error.message)
    }
    

  }
  return (
    <div className=" shadow-md overflow-hidden group">

  <div className="overflow-hidden h-46 w-46">
    <img
      src={product?.images[0]}
      alt={product.productName}
      className="w-full h-full object-cover group-hover:scale-105 transition"
    />
  </div>

  <div className="p-2 flex flex-col flex-1">

    <h3 className="text-sm font-medium line-clamp-1">
      {product.productName}
    </h3>

    <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mt-1">
      {product.description}
    </p>

    <div className="flex justify-between items-center mt-1">
      <span className="text-sm font-bold text-sky-600">
        Rs {product.price}
      </span>

      <span className="text-[10px] text-gray-500">
        Stock: {product.stock}
      </span>
    </div>

    {/* BUTTONS */}
        <div className="flex items-center gap-2 mt-3">

          <button onClick={()=> navigate(`/admin-panel/update-product/${product._id}`)} className="hover:bg-sky-700 hover:text-white flex-1 border border-gray-400 rounded-md py-2 flex items-center justify-center cursor-pointer">
            <FiEdit2 className="w-4 h-4" />
          </button>

          <button onClick={() => handleDeleteProduct(product._id)}  className="flex-1 border border-gray-400 rounded-md py-2 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white cursor-pointer">
            <FiTrash2 className="w-4 h-4" />
          </button>

        </div>
  </div>
</div>
  );
}