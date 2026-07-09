import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserCircle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaSignOutAlt,
  FaTrashAlt,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logOutFailure,
  logOutStart,
  logOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/authSlice";
import { Link, useNavigate } from 'react-router-dom'

const Account = () => {
  const [file, setFile] = useState(null);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const { currentUser, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  // upload image
  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_PROFILE_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    if (!res.ok || result.error) {
      toast.error("Image upload failed");
      return null;
    }

    return result.secure_url;
  };

  // UPDATE USER
  const updateUser = async(e) => {
     e.preventDefault();

  const changingUsername =
    formData.username !== currentUser.username;

  const changingEmail =
    formData.email !== currentUser.email;

  const changingPassword =
    formData.newPassword || formData.confirmPassword;


  // Username/email change requires current password
  if ((changingUsername || changingEmail) && !formData.currentPassword) {
    toast.error("Please enter current password to update profile");
    return;
  }


  // Password change requires current password
  if (changingPassword && !formData.currentPassword) {
    toast.error("Please enter current password to update password");
    return;
  }


  // New password requires confirm password
  if (formData.newPassword && !formData.confirmPassword) {
    toast.error("Please confirm your new password");
    return;
  }


  // Check password match
  if (
    formData.newPassword &&
    formData.newPassword !== formData.confirmPassword
  ) {
    toast.error("Passwords do not match");
    return;
  }


  // Same password check
  if (
    formData.currentPassword &&
    formData.newPassword &&
    formData.currentPassword === formData.newPassword
  ) {
    toast.error("New password cannot be same as current password");
    return;
  }
     try {
       dispatch(updateUserStart());
       let avatar = currentUser?.avatar;
       if (file) {
         avatar = await handleImageUpload();
       }
       const res = await fetch("/api/user/update", {
         method: "PUT",
         headers: {
           "Content-Type": "application/json"
         },
         credentials: "include",
         body: JSON.stringify({ ...formData, avatar })
       });
     const data = await res.json();
     if (!res.ok || data.success === false) {
       dispatch(updateUserFailure(data.message || "Failed to update profile"));
       toast.error(data.message || "Failed to update profile");
       return;
     }
     dispatch(updateUserSuccess(data.user));
     toast.success("User updated successful")
     setFormData((prev) => ({
       ...prev,
       currentPassword: "",
       newPassword: "",
       confirmPassword: "",
     }))
     setFile(null);
     } catch (error) {
       toast.error("Failed to update profile", { description: error.message });
     }
   };
//  logout user
const handleLogout = async () => {
  try {
    dispatch(logOutStart());
    const res = await fetch("/api/auth/logout", {
      method:"POST",
      credentials: "include"
    })
    const data = await res.json();
    if(!res.ok || data.success === false) {
      dispatch(logOutFailure(data.message || "Logout failed"));
      toast.error(data.message)
      return;
    }
    dispatch(logOutSuccess(data.user))
    toast.success("Logout success")
    navigate("/login")
  } catch (error) {
    dispatch(logOutFailure(error.message || "An error occurred during logout"))
    toast.error(error.message)
  }
}

// delete user
const handleDeleteAccount = async() => {
  if(!deletePassword) {
    toast.error("Please enter password to delete your account")
    return
  }
  try {
    dispatch(deleteUserStart())
    const res = await fetch("/api/user/delete", {
      method: "DELETE",
      credentials:"include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({password:deletePassword})
    })
    const data = await res.json();
    if(!res.ok || data.success===false){
   dispatch(deleteUserFailure(data.message || "Failed to delete user"))
   toast.error(data.message)
   return
    }
    dispatch(deleteUserSuccess())
    toast.success("Account deleted success")
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
    toast.error(error.message)
  }
}
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-3xl">
          <div className="flex items-center gap-6">

            <div className="relative">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-[110px]" />
              )}

              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full"
              >
                <FaCamera />
              </button>

              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {currentUser?.username}
              </h2>
              <p>{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* SINGLE FORM */}
        <form
          onSubmit={updateUser}
          className="bg-white p-6 rounded-2xl space-y-6"
        >

          {/* username */}
          <div>
            <label>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          {/* email */}
          <div>
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          {/* password */}
          <div>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
            <Link to="/forgot-password" className="text-sky-600 text-sm underline mt-2">forgot-password?</Link>
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            className="hover:opacity-90 bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FaSave />
            {loading? <p>loading...</p> : <p>Update</p>}
          </button>
        </form>
       
        {/* Account Actions */}
<div className="bg-white p-6 rounded-2xl">
  <h2 className="text-2xl font-bold mb-6">Account Actions</h2>

  <div className="flex flex-col sm:flex-row gap-4">
    <button
      type="button"
      onClick={handleLogout}
      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
    >
      <FaSignOutAlt />
      Logout
    </button>

    <button
    onClick={() => setDeleteModelOpen(true)}
      type="button"
      className="flex-1 hover:bg-red-100 flex items-center justify-center gap-2 rounded-xl border border-red-500 px-6 py-3 text-red-600 transition "
    >
      <FaTrashAlt />
      Delete Account
    </button>
  </div>
</div>
      </div> 
      { deleteModelOpen && (
           <>
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-gray-400 p-6 rounded-lg w-80">
        <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
        <p className="text-sm text-gray-300 mb-4">
          Please enter your password to confirm account deletion.
        </p>
        <input
          type="password"
          placeholder="Password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          className="bg-gray-600 text-gray-300 placeholder:text-gray-400 border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Link to="/forgot-password" className="flex justify-baseline mt-1 block text-xs text-gray-400 hover:text-white cursor-pointer">
          Forgot your password?
        </Link>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setDeleteModelOpen(false)}
            className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
      </div>
      </>
      
        )}
    </div>
  );
};

export default Account;