import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock,  FaUser } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import OAuth from '../components/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, registerFailure, registerStart, registerSuccess } from '../redux/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: ""
    })
    const { error, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useEffect
    useEffect(() => {
  dispatch(clearError());
}, []);


    // handle change for form inputs
    const handleChange = (e) => {
      setFormData((prev) => ({
        ...prev, [e.target.id]:e.target.value
      }))
    }

    // submit form data to backend
    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        dispatch(registerStart());
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
        
      if (!res.ok || data.success === false) {
        dispatch(registerFailure(data.message || "Registration failed"));
        toast.error(data.message || "Registration failed");
        return;
      }
       dispatch(registerSuccess(data.user));
      toast.success("Registration successful");
      navigate("/login")
      } catch (error) {
        dispatch(registerFailure("An error occurred during registration"));
      }
    }

  return (
   <div className="container mx-auto px-4 min-h-screen">
    <div className="flex flex-col max-w-md mx-auto mt-12 p-8 gap-3 bg-white rounded-xl shadow-xl border border-gray-100">
  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
    
    <h2 className="text-2xl font-semibold text-center text-gray-900">
      Sign Up
    </h2>
    <div className='relative'>
    <input
      type="text"
      id="username"
      onChange={handleChange}
      value={formData.username}
      placeholder="Username"
      required
      className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
    />
    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
    </div>
    <div className='relative'>
    <input
      type="text"
      id="email"
      onChange={handleChange}
      value={formData.email}
      placeholder="Email"
      required
      className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
    />
    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>

   {/* PASSWORD FIELD */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
            />
            <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
  
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
          {loading ? <Spinner /> : "Register"}
    </button>
  </form>
    <OAuth />
    {error && <p className='text-red-600 text-sm'>{error}</p>}
    <div className="flex justify-between items-center text-sm" >
        <span className='text-gray-500'>Already have an account? <Link to="/login" className="text-blue-500 hover:underline">
        login
        </Link></span>
\    </div>

  </div>
</div>
  )
}

export default Register