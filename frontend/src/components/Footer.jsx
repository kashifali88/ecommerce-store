import React from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="container mx-auto px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/">
              <h2 className="text-2xl font-bold text-gray-900">
                Ecommerce <span className="text-red-500">Store</span>
              </h2>
            </Link>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Shop quality products with fast delivery, secure checkout, and
              easy returns.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white">
                <FiFacebook size={17} />
              </a>
              <a className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white">
                <FiInstagram size={17} />
              </a>
              <a className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white">
                <FiTwitter size={17} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
              Quick Links
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <Link to="/" className="block text-gray-500 hover:text-red-500">
                Home
              </Link>
              <Link to="/cart" className="block text-gray-500 hover:text-red-500">
                Cart
              </Link>
              <Link to="/account" className="block text-gray-500 hover:text-red-500">
                My Account
              </Link>
              <Link to="/login" className="block text-gray-500 hover:text-red-500">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
              Categories
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <Link to="/" className="block text-gray-500 hover:text-red-500">
                Airpodes
              </Link>
              <Link to="/" className="block text-gray-500 hover:text-red-500">
                Mobiles
              </Link>
              <Link to="/" className="block text-gray-500 hover:text-red-500">
                TV
              </Link>
              <Link to="/" className="block text-gray-500 hover:text-red-500">
                Watches
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <FiMapPin className="text-red-500" />
                Pakistan
              </p>
              <p className="flex items-center gap-2">
                <FiPhone className="text-red-500" />
                +92 3195378220
              </p>
              <p className="flex items-center gap-2">
                <FiMail className="text-red-500" />
                support@ecommercestore.com
              </p>
            </div>

            <div className="mt-5 flex overflow-hidden rounded-md border border-gray-200">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-2 text-sm outline-none"
              />
              <button className="bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © 2026 Ecommerce Store. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm text-gray-500">
            <Link to="/" className="hover:text-red-500">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-red-500">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;