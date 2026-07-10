import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaBox, FaUser } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { logOutFailure, logOutStart, logOutSuccess } from "../redux/authSlice";
import { toast } from "react-toastify";
import { fetchCartFailure, fetchCartStart, fetchCartSuccess } from "../redux/cartSlice";

function Header() {
    const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const { totalQuantity } = useSelector((state) => state.cart)

  // logout user
  const handleLogOut = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch(`${BACKEND}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(logOutFailure(data.message || "Logout failed"));
        toast.error(data.message || "Logout failed");
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      toast.success("Logout success");
    } catch (error) {
      dispatch(logOutFailure(error.message));
    }
  };

  const fetchUserCart = async() => {
    try {
      dispatch(fetchCartStart())
      const res = await fetch(`${BACKEND}/api/cart`,{
      credentials:"include"
    })
    const data = await res.json();
    if(!res.ok || data.success === false) {
      dispatch(fetchCartFailure(data.message || "Failed to fetch cart"))
      return
    }
      dispatch(fetchCartSuccess(data.cart))
    } catch (error) {
      dispatch(fetchCartFailure(error.message || "failed to fetch user cart"))
    }
    
  }

  const searchProducts = async(query,e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND}/api/product/search?query=${query}`);
      const data = await res.json();
      if(!res.ok || data.success === false) {
        toast.error(data.message || "Failed to search products");
        return
      }
      navigate(`/search?query=${encodeURIComponent(query)}`);
      // Handle the search results (data.products) as needed
    } catch (error) {
      toast.error(error.message || "Failed to search products");
    }
  }
  useEffect(() => {
    if(currentUser) {
      fetchUserCart()
    }
  },[currentUser])
  return (
  <header className="shadow-sm py-4 px-4 md:px-10">
    <div className="container mx-auto flex flex-col gap-3">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <Link to="/">
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
            Ecommerce <span className="text-red-500">Store</span>
          </h1>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={(e) => searchProducts(searchQuery, e)}
          className="hidden lg:flex w-md border border-gray-400 rounded-full px-4 py-2 items-center gap-2"
        >
          <input
            type="text"
            placeholder="Search products..."
            className="border-none outline-none w-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button type="submit">
            <CiSearch size={22} className="text-gray-500 cursor-pointer" />
          </button>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {currentUser && (
            <Link to="/cart" className="relative">
              <HiOutlineShoppingCart size={24} className="text-gray-700" />

              <span className="absolute -top-2 -right-2 text-white text-xs bg-red-600 rounded-full w-4 h-4 flex items-center justify-center">
                {totalQuantity}
              </span>
            </Link>
          )}

          <div className="relative">
            {currentUser ? (
              <img
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9 h-9 cursor-pointer rounded-full border-2 border-gray-300"
                src={currentUser?.avatar}
                alt=""
              />
            ) : (
              <Link
                to="/login"
                className="text-md font-semibold cursor-pointer hover:underline text-gray-700"
              >
                Sign In
              </Link>
            )}

            {profileMenuOpen && (
              <>
                <div
                  onClick={() => setProfileMenuOpen(false)}
                  className="fixed inset-0 bg-black/10 z-40"
                />

                <div className="absolute right-0 bg-white mt-3 rounded-xl w-50 border overflow-hidden border-gray-200 shadow-lg z-50">
                  <div className="px-4 py-3 text-sm">
                    {currentUser?.role !== "admin" && (
                      <p className="flex items-center px-3 py-2 gap-2 whitespace-nowrap text-gray-500 font-semibold">
                        <FaUser size={14} />
                        <span>
                          Username:{" "}
                          <span className="text-blue-600">
                            {currentUser?.username}
                          </span>
                        </span>
                      </p>
                    )}

                    <div className="space-y-1">
                      {currentUser?.role !== "admin" && (
                        <Link
                          to="/account"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center px-3 py-2 gap-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        >
                          <FaUser size={14} />
                          <span>Account</span>
                        </Link>
                      )}

                      {currentUser?.role === "admin" && (
                        <Link
                          to="/admin-panel"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center px-3 py-2 gap-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        >
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                     
                     {currentUser?.role === 'user' && (
                      <Link
                      to="/orders"
                        onClick={() => 
                          setProfileMenuOpen(false)}
                        className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                      >
                        <FaBox size={14} />
                        <span>Orders</span>
                      </Link>
                      )}

                      <button
                        onClick={() => {
                          handleLogOut();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600"
                      >
                        <FiLogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <form
        onSubmit={(e) => searchProducts(searchQuery, e)}
        className="flex lg:hidden border border-gray-300 rounded-full px-4 py-2 items-center gap-2"
      >
        <input
          type="text"
          placeholder="Search products..."
          className="w-full outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button type="submit">
          <CiSearch size={22} className="text-gray-500 cursor-pointer" />
        </button>
      </form>
    </div>
  </header>
);
}

export default Header;

