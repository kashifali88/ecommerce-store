import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import Account from '../pages/user/Account'

function AdminPanel() {
    const { currentUser } = useSelector((state) => state.auth);
    const getLinkClass = ({ isActive }) =>
  `block border border-gray-300 rounded-lg w-full px-3 py-2 ${
    isActive ? "bg-blue-500 text-white" : "hover:bg-slate-300"
  }`;
  return (
    <div className='min-h-screen hidden md:flex'>
        <aside className='sticky top-0 bg-background h-screen w-full max-w-60 customShadow'>
            <div className='h-30  flex items-center justify-center'>
           {currentUser && (
            <div className='flex flex-col items-center justify-center '>
              <img
                className="w-16 h-16 cursor-pointer  rounded-full border-2 border-gray-300"
                src={currentUser?.avatar}
                alt=""
              />
              <p className='capitalize text-lg font-semibold'>{currentUser.username}</p>
              </div>
            )}
            </div>
            <div>
                <nav className='flex flex-col px-4 py-2 gap-2'>
                    <NavLink className={getLinkClass}  to="/admin-panel" end>Admin Panel</NavLink>
                    <NavLink className={getLinkClass}  to="/admin-panel/users">Users</NavLink>
                    <NavLink className={getLinkClass}  to="/admin-panel/orders">Orders</NavLink>
                    <NavLink className={getLinkClass}  to="/admin-panel/products">Products</NavLink>
                    <NavLink className={getLinkClass}  to="/admin-panel/create-product">Create-Product</NavLink>
                    <NavLink className={getLinkClass}  to="/admin-panel/categories">Categories</NavLink>
                </nav>
            </div>
        </aside>
        <main className='flex-1 p-4'>
          <h1 className='text-center text-2xl'>WELCOME TO ADMIN PANEL!</h1>
       <Outlet />
        </main>
    </div>
  )
}

export default AdminPanel