import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Categories() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // UPDATE STATES
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // IMAGE UPLOAD
  const handleImageUpload = async () => {
    if (!file) {
      toast.error("Select image first");
      return;
    }

    try {
      setImageUploadLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        toast.error(result.message || "Upload failed");
        return;
      }

      setImage(result.imageUrl);
      setFile(null);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setImageUploadLoading(false);
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category/fetch-all");
      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message);
        return;
      }

      setCategories(data.category);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // CREATE CATEGORY
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success("Category created");

      setName("");
      setImage("");
      setFile(null);

      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      setDeleteLoading(id);

      const res = await fetch(`/api/category/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success("Category deleted");

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== id)
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  // UPDATE
  const handleUpdate = async (id) => {
    try {
      setUpdateLoading(true);

      const res = await fetch(`/api/category/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success("Category updated");

      setEditId(null);
      setEditName("");

      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Categories
        </h1>

        {/* CREATE CATEGORY */}
        <form
          onSubmit={handleCreate}
          className="space-y-4 mb-8"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            className="w-full border border-gray-400 p-3 rounded-lg"
          />

          <div className="flex gap-3">
            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              className="flex-1 border border-gray-400 p-3 rounded-lg"
            />

            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-slate-700 text-white px-4 rounded-lg"
            >
              {imageUploadLoading
                ? "Uploading..."
                : "Upload"}
            </button>
          </div>

          {image && (
            <img
              src={image}
              alt="preview"
              className="w-24 h-24 object-cover rounded-lg border border-gray-400"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* CATEGORY LIST */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex justify-between items-center border border-gray-400 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}

                {editId === cat._id ? (
                  <input
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                    className="border border-gray-400 p-2 rounded"
                  />
                ) : (
                  <span className="font-medium">
                    {cat.name}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {editId === cat._id ? (
                  <>
                    <button
                      onClick={() =>
                        handleUpdate(cat._id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      {updateLoading
                        ? "Saving..."
                        : "Save"}
                    </button>

                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(cat._id);
                      setEditName(cat.name);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDelete(cat._id)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  {deleteLoading === cat._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Categories;

