import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function SearchProducts() {
      const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BACKEND}/api/product/search?query=${encodeURIComponent(query)}`
      );

      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to search products");
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.message || "Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [query]);

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
        <div className="mb-8 rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            Search
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Results for "{query}"
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} found
              </p>
            </div>

            <Link
              to="/"
              className="w-fit rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-500"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {!query.trim() ? (
          <div className="rounded-lg border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Search for products
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Type a product name in the search bar to find what you need.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No products found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Try searching with a different product name or category.
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

export default SearchProducts;