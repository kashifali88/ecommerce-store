import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
  const { currentUser } = useSelector((state) => state.auth);
  return currentUser ? <Navigate to="/" /> : <Outlet />
}

export default PublicRoute