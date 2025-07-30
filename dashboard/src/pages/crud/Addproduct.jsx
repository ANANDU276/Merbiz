import React, { useState } from "react";
import {
  FaPlus,
  FaArrowLeft,
  FaUpload,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export default function AddProduct() {
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
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");

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
    if (formData.image.length !== 3)
      newErrors.image = "Exactly 3 product image are required";

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
      setFileError("You can upload only 3 image");
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
      await axios.post("http://localhost:5000/api/products", formData);
      alert("Product added successfully!");
      navigate("/products");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error adding product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Add New Product
          </h1>
          <Link to="/products">
            <button className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm md:text-base">
              <FaArrowLeft /> Back to Products
            </button>
          </Link>
        </div>

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

              {/* Right Side */}
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
                    Upload 3 image (JPG/PNG, max 2MB each)
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
                {/* No Option */}
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

                {/* Yes Option */}
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
                    <FaSpinner className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <FaPlus /> Add Product
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
