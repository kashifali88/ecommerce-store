import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function FilterProducts() {
      const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryName = decodeURIComponent(category || "");

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND}/api/product/category/${categoryName}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to fetch products");
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchCategoryProducts();
    }
  }, [categoryName]);

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
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-500 uppercase tracking-wide">
              Category
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900 capitalize">
              {categoryName}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </p>
          </div>

          <Link
            to="/"
            className="text-sm font-semibold text-red-500 hover:text-red-600"
          >
            Back to Home
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No products found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              There are no products available in this category right now.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-md bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="h-44 bg-gray-100 p-4">
                    <img
                      src={product?.images?.[0]}
                      alt={product?.productName}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </div>
                </Link>

                <div className="p-3">
                  <Link to={`/product/${product._id}`}>
                    <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-gray-900 hover:text-red-500">
                      {product?.productName}
                    </h2>
                  </Link>

                  <p className="mt-2 text-lg font-bold text-red-600">
                    RS {product?.price}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {product?.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>

                  <Link
                    to={`/product/${product._id}`}
                    className="mt-3 block rounded-md bg-red-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterProducts;