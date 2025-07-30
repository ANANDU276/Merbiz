import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaSave,
  FaUpload,
  FaSpinner,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: [],
    rating: 4.5,
    topSelling: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        // Convert the single image to an array if needed
        const productData = response.data;
        const image = productData.image
          ? Array.isArray(productData.image)
            ? productData.image
            : [productData.image]
          : [];
        
        setFormData({
          ...productData,
          image: image,
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        setErrors({
          fetchError: "Failed to load product. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.price && parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.stock) newErrors.stock = "Stock quantity is required";
    if (formData.stock && parseInt(formData.stock) < 0)
      newErrors.stock = "Stock cannot be negative";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.image.length < 1)
      newErrors.image = "At least 1 product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileError("File size must be less than 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFileError("Only JPG, PNG files are allowed");
      return;
    }

    if (formData.image.length >= 3) {
      setFileError("You can upload maximum 3 image");
      return;
    }

    setFileError("");
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, result.secure_url],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setFileError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updated = [...formData.image];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, image: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, formData);
      navigate("/products", { state: { success: "Product updated successfully!" } });
    } catch (err) {
      console.error("Error updating product:", err);
      let errorMsg = "Failed to update product";
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setErrors({ submitError: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="mx-auto animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (errors.fetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <p className="text-red-600 mb-4">{errors.fetchError}</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Update Product
          </h1>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm md:text-base"
          >
            <FaArrowLeft /> Back to Products
          </Link>
        </div>

        {errors.submitError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {errors.submitError}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Product description..."
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full pl-8 px-3 py-2 border ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      } rounded-lg`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    } rounded-lg`}
                  >
                    <option value="">Select category</option>
                    <option value="headphone">Headphone</option>
                    <option value="controller">Controller</option>
                    <option value="watch">Watch</option>
                    <option value="books">Books</option>
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.stock ? "border-red-500" : "border-gray-300"
                    } rounded-lg`}
                    placeholder="Enter quantity"
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-600">{errors.stock}</p>
                  )}
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {formData.image.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${i}`}
                          className="h-20 w-20 object-cover rounded shadow"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                    {formData.image.length < 3 && (
                      <label className="cursor-pointer w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center rounded text-gray-500 hover:bg-gray-50">
                        {uploading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaUpload />
                        )}
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload up to 3 image (JPG/PNG, max 2MB each)
                  </p>
                  {fileError && (
                    <p className="text-sm text-red-600">{fileError}</p>
                  )}
                  {errors.image && (
                    <p className="text-sm text-red-600">{errors.image}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Top Selling - Radio Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top Selling
              </label>
              <div className="flex items-center gap-6 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="topSelling"
                    value="false"
                    checked={!formData.topSelling}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        topSelling: false,
                      }))
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="topSelling"
                    value="true"
                    checked={formData.topSelling}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        topSelling: true,
                      }))
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
              <Link to="/products">
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                disabled={submitting || uploading}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <FaSave /> Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}