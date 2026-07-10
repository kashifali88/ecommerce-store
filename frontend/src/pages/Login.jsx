import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import {  FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import OAuth from '../components/OAuth';
import { useSelector, useDispatch } from 'react-redux'
import { clearError, loginFailure, loginStart, loginSuccess } from '../redux/authSlice';
import { toast } from "react-toastify";
import Spinner from '../components/Spinner'


function Login() {
         const BACKEND = import.meta.env.VITE_BACKEND_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      login: "",
      password: ""
    })
    const dispatch = useDispatch();
    const {  loading, error } = useSelector((state) => state.auth);
    
    const navigate = useNavigate();


    // useEffect for error
    useEffect(() => {
      dispatch(clearError())
    },[])

    // handle input change for form submission
    const handleChange = (e) => {
      setFormData((prev) => ({...prev, [e.target.id]:e.target.value}))
    }

    // submitting form
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(loginStart());
        const res= await fetch(`${BACKEND}/api/auth/login`, {
          method: "POST",
          headers :{
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok || data.success === false) {
          dispatch(loginFailure(data.message || "failed to login"))
          toast.error(data.message || "failed to login");
          return;
        }
        dispatch(loginSuccess(data.user));        
        toast.success("Login In successful")
        navigate("/")

      } catch (error) {
        dispatch(loginFailure(error.message))
        toast.error(error.message)
      }
    }
    
  return (
   <div className="container mx-auto px-4 min-h-screen">
    <div className="flex flex-col max-w-md mx-auto mt-12 p-8 gap-3 bg-white rounded-xl shadow-xl border border-gray-100">
  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
    
    <h2 className="text-2xl font-semibold text-center text-gray-900">
      Sign In
    </h2>
    <div className="relative">
    <input
      type="text"
      id="login"
      onChange={handleChange}
      value={formData.login}
      placeholder="Email or Username"
      required
      className="w-full border  border-gray-300 rounded-full pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
    />
    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>

 {/* PASSWORD FIELD */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />
          <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ' />

          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

    <button
      type="submit"
      className="w-full bg-black text-white py-3 rounded-full font-medium hover:opacity-90 transition"
    >
      {loading ? <Spinner /> : "Login"}
    </button>
  </form>
        <OAuth />
        {error && <p className='text-sm text-red-600'>{error}</p>}
    <div className="flex justify-between items-center text-sm" >
        <span className='text-gray-500'>Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link></span>
        <Link to="/forgot-password" className=" text-gray-500 block ">Forgot your password?</Link>
    </div>
  </div>
</div>
  )
}

export default Login;


