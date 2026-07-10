import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

function CategoryList() {
  const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const categoryLoading = new Array(13).fill(null);
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/category/fetch-all`);
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message);
        return;
      }
      setCategories(data.category);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="mx-auto py-4 px-4 md:px-10">
      <div className="flex items-center  justify-between gap-4 scroll-none overflow-scroll">
        {loading
          ? categoryLoading.map((el, index) => (
              <div
                key={index}
                className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-slate-200 animate-pulse"
              />
            ))
          : categories?.map((category, index) => (
              <Link
                to={`/products/category/${encodeURIComponent(category?.name)}`}
                className="cursor-pointer"
                key={category?._id || index}
              >
                <div className="flex items-center justify-center border border-gray-200 w-14 h-14 md:w-18 md:h-18 rounded-full overflow-hidden ">
                  <img
                    className="p-2 h-full object-scale-down hover:scale-110 transition-all"
                    src={category?.image}
                    alt={category?.name}
                  />
                </div>
                <p className="text-center text-sm md:text-base font-semibold text-gray-500">
                  {category?.name}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default CategoryList;
