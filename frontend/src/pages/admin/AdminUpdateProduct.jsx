import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function AdminUpdateProduct() {
      const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading]= useState(false)
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });
  const navigate = useNavigate();
  const { id } = useParams();

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/category/fetch-all`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to fetch categories");
        return;
      }

      setCategories(data.category);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (file) => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    try {
      setImageUploading(true);
      setImageUploaded(false);

      const data = new FormData();
      data.append("file", file);

      const res = await fetch(`${BACKEND}/api/upload`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(data.message || "Upload failed");
      }
      setImageUploaded(true);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.imageUrl],
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setImageUploading(false);
    }
  };

//   fetch product
 const fetchProduct = async () => {
    try {
        const res = await fetch(`${BACKEND}/api/product/fetch-single/${id}`,{
            credentials: 'include'
        })
        const data = await res.json();
        if(!res.ok || data.success === false) {
            toast.error(error.message || "failed to fetch product")
            return;
        }
        setFormData({
            productName: data.product.productName,
            description: data.product.description,
            price: data.product.price,
            stock: data.product.stock,
            category: data.product.category,
            images: data.product.images || [],
        })
    } catch (error) {
        toast.error(error.message || "failed to fetch products")
    }
}

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/product/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || "failed to create product");
        return;
      }
      toast.success("Product created");
      setFormData({
        productName: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        images: [],
      });
      setImageUploaded(false);
      setFile(null);
      navigate("/admin-panel/products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // remove image
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };



  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);
  console.log(formData);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Create Product</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* PRODUCT NAME */}
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product Name"
            className="border border-gray-300 p-3 rounded-lg"
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg "
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* PRICE & STOCK */}
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="border border-gray-300 p-3 rounded-lg"
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border border-gray-300 p-3 rounded-lg"
          />

          {/* IMAGE */}
          {/* IMAGE */}
          <div className="flex items-center gap-3">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border w-full border-gray-300 p-3 rounded-lg"
            />

            <button
              type="button"
              onClick={() => handleImageUpload(file)}
              className="bg-slate-700 text-white px-3 py-2 rounded"
            >
              {imageUploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* STATUS */}
          {imageUploaded && (
            <p className="text-green-500 text-sm mt-1">
              ✓ Image uploaded successfully
            </p>
          )}

          <div className="relative flex gap-2 flex-wrap mt-3">
            {formData.images?.map((img, index) => (
              <>
                <img
                  key={index}
                  src={img}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 left-18 cursor-pointer bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                >
                  ✕
                </button>
              </>
            ))}
          </div>
          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border border-gray-300 p-3 rounded-lg"
            rows="5"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminUpdateProduct;
