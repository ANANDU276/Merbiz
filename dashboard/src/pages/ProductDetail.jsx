import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaEdit,
  FaBoxOpen,
  FaTag,
  FaStar,
  FaLayerGroup,
  FaTrash,
  FaSpinner
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to load product. Please try again."
        );
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setDeleting(true);
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success("Product deleted successfully");
        navigate("/products");
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to delete product");
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="text-lg font-medium text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg font-medium text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FaArrowLeft /> Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg font-medium text-gray-600">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FaArrowLeft /> Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Top bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
          >
            <FaArrowLeft /> Back to Products
          </button>

          <div className="flex items-center gap-3">
            <Link
              to={`/products/updateproduct/${product._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <FaEdit /> Edit Product
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-70"
            >
              {deleting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaTrash />
              )}{" "}
              Delete
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Image */}
            <div className="col-span-1">
              <div className="relative pb-[100%] bg-gray-100 rounded-lg overflow-hidden shadow">
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/400?text=No+Image"
                  }
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400?text=No+Image";
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="col-span-2 space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FaBoxOpen className="text-blue-600" /> {product.name}
                </h1>
                <div className="mt-1 text-sm text-gray-500">
                  Product ID: {product._id}
                </div>
              </div>

              <div className="text-gray-600 leading-relaxed">
                {product.description}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={<FaTag className="text-blue-600" />} label="Price">
                  <span className="font-mono">₹{product.price.toFixed(2)}</span>
                </InfoRow>

                <InfoRow
                  icon={<FaLayerGroup className="text-blue-600" />}
                  label="Stock Status"
                >
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      {product.stock} available
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  )}
                </InfoRow>

                <InfoRow icon={<FaTag className="text-blue-600" />} label="Category">
                  <span className="capitalize">{product.category}</span>
                </InfoRow>

                <InfoRow icon={<FaStar className="text-blue-600" />} label="Rating">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < Math.floor(product.rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {product.rating.toFixed(1)}/5
                    </span>
                  </div>
                </InfoRow>

                {product.createdAt && (
                  <InfoRow
                    icon={<span className="text-blue-600">📅</span>}
                    label="Added on"
                  >
                    {new Date(product.createdAt).toLocaleDateString()}
                  </InfoRow>
                )}

                {product.updatedAt && (
                  <InfoRow
                    icon={<span className="text-blue-600">✏️</span>}
                    label="Last updated"
                  >
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </InfoRow>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-xl mt-0.5">{icon}</div>
      <div className="flex-1">
        <span className="block text-sm font-medium text-gray-500">{label}</span>
        <span className="block text-lg font-semibold text-gray-800">
          {children}
        </span>
      </div>
    </div>
  );
}