import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import AdminProductCard from '../../components/admin/AdminProductCard';

function AdminProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);



  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
       const res = await fetch("/api/product/fetch-all");
    const data = await res.json();    
    if (!res.ok || data.success === false) {
      setError(data.message || "Failed to fetch products");
      return;
    }
    setProducts(data.products)
    setError(null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

    useEffect(() => {
      fetchProducts()
    },[])

  return (
    <div className='min-h-screen p-4'>
      <div>
        <h1 className='text-lg font-semibold mb-6'>All Products</h1>
        <div className='grid sm:grid-cols-2  gap-6 md:grid-cols-3 lg:grid-cols-4'>
         { products.map((product) => (
          <AdminProductCard key={product._id} product = {product} setProducts={setProducts} />
         ))}
        </div>
      </div>
      
    </div>
  )
}

export default AdminProducts