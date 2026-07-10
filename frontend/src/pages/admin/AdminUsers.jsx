import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

function AdminUsers() {
      const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/api/user/admin/get-users`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.message || "failed to fetch users");
        return;
      }
      setUsers(data.users);
    } catch (error) {
      setError(error.message || "failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // update role
  const handleRoleChange = async(id, newRole) => {
     const confirmChange = window.confirm(
      "Are you sure to change user role?",
    );
    if (!confirmChange) {
      return;
    }
try {
  const res = await fetch(`${BACKEND}/api/user/admin/update-role/${id}`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({role: newRole}),
    credentials: "include"
  });
const data = await res.json();
if (!res.ok || data.success === false){
  toast.error(data.message || "failed to update role");
  return;
}
toast.success("Role changed successful")
setUsers((prev) => prev.map((u) => u._id === id ? {...u, role:newRole} : u))
} catch (error) {
  toast.error(error.message || "failed to update role")
}
  }

  // delete user
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Do you really want to delete this user?",
    );
    if (!confirmDelete) {
      return;
    }
    try {
      setDeleteLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND}/api/user/admin/delete-user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.message || "failed to delete user");
        return;
      }
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      setError(error.message || "failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-6">Users</h1>
      {/* LOADING */}
      {loading && (
        <div className="flex  justify-center  py-32">
          <Spinner />
        </div>
      )}

      {/* ERROR */}
      {!loading && error && <p className="text-red-500">{error}</p>}

      {/* EMPTY STATE */}
      {!loading && !error && users.length === 0 && (
        <p className="text-gray-500">No users found</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto bg-white  rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Avatar</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-t border-slate-300">
                  <td className="px-4 py-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">{user.username}</td>

                  <td className="px-4 py-3">{user.email}</td>

                  <td className="px-4 py-3">
                    <select
                     value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option  value="user">User</option>
                      <option  value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">{user._id}</td>

                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                  
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="cursor-pointer hover:opacity-90 px-3 py-1 rounded bg-red-500 text-white"
                    >
                      {deleteLoading ? <Spinner /> : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
