import React, { useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate,  } from 'react-router-dom';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { toast } from 'react-toastify';
import { loginStart, loginFailure, loginSuccess, clearError } from '../redux/authSlice'



function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(clearError())
  },[])

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      dispatch(loginStart())
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        })
      })
        const data = await res.json();
        if (!res.ok || data.success === false) {
          dispatch(loginFailure(data.message || "google login failed"));
          toast.error(data.message || "google login failed")
          return;
        }
        dispatch(loginSuccess(data.user))
        toast.success("Google login successful")
        navigate("/")
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message);
    }
  }
  return (
    <div className="w-full">
      <button onClick={handleGoogleClick} type='button' className="relative w-full hover:opacity-90 bg-red-600 text-white font-medium  py-3 pr-4 pl-10 rounded-full border  flex items-center justify-center">
        <FaGoogle className="absolute left-4 text-white" size={20} />
        CONTINUE WITH GOOGLE
      </button>
    </div>
  )
}

export default OAuth
