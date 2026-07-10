import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/auth/forgot-password`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email})
      });
      const data = await res.json();
      if(!res.ok || !data.success){
        toast.error(data.message);
        return;
      }
      toast.success(
        "Password reset link sent to your email"
      );
      setEmail("");
    } catch(error){
      toast.error(error.message);
    } finally{
      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">


        <h1 className="text-3xl font-bold text-center mb-3">
          Forgot Password?
        </h1>


        <p className="text-gray-500 text-center mb-6">
          Enter your email and we will send you a password reset link.
        </p>



        <form onSubmit={handleSubmit}>


          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            required
          />


          <button
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
          >

            {
              loading 
              ? "Sending..."
              : "Send Reset Link"
            }

          </button>
        </form>

        <Link
          to="/login"
          className="block text-center mt-5 text-blue-600"
        >
          Back to Login
        </Link>


      </div>

    </div>

  );
};


export default ForgotPassword;