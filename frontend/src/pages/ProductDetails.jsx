import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../api/productsApi";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        if (!data) {
          throw new Error("Product not found");
        }
        setProduct(data);
        if (!data.image || !Array.isArray(data.image)) {
          data.image = ["", "", ""];
        } else {
          while (data.image.length < 3) {
            data.image.push("");
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };
    getProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleImageChange = (direction) => {
    setSelectedImageIndex((prev) => {
      if (direction === "next") {
        return prev === 2 ? 0 : prev + 1;
      } else {
        return prev === 0 ? 2 : prev - 1;
      }
    });
  };

  if (error)
    return (
      <div className="px-4 py-10 mx-auto text-center text-red-500">
        Error: {error}
      </div>
    );
  if (!product)
    return <div className="px-4 py-10 mx-auto text-center">Loading...</div>;

  return (
    <main className="px-4 py-10 mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{product.name}</span>
      </div>

      {/* Top Selling Badge */}
      {product.topSelling && (
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
          Top Selling Product
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Images Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails - exactly 3 images */}
              <div className="flex sm:flex-col gap-2">
                {product.image.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden ${
                      selectedImageIndex === idx
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Main Image with navigation */}
              <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center p-4 relative">
                {product.image[selectedImageIndex] ? (
                  <img
                    src={product.image[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-80 object-contain"
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Image not available</span>
                  </div>
                )}
                {/* Navigation arrows */}
                <button
                  onClick={() => handleImageChange("prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleImageChange("next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Category */}
            {product.category && (
              <div className="text-sm text-gray-500 mb-3">
                Category: {product.category}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold text-blue-600">
                ₹{product.price.toLocaleString()}
              </span>
              {product.stock && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm ml-1">
                  {product.rating.toFixed(1)} rating
                </span>
              </div>
            )}

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Quantity
              </h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center border-x border-gray-300 py-2">
                  {quantity}
                </span>
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => handleQuantityChange("increment")}
                  disabled={product.stock !== undefined && quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {product.stock !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  {product.stock} available
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button 
                className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
              <button 
                className="flex-1 bg-white border border-blue-600 text-blue-600 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Product Specifications</h3>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex">
                  <span className="text-gray-400 mr-2">•</span>
                  <strong>Category:</strong> {product.category || "N/A"}
                </li>
                <li className="flex">
                  <span className="text-gray-400 mr-2">•</span>
                  <strong>Stock:</strong> {product.stock || "N/A"}
                </li>
                {product.topSelling && (
                  <li className="flex">
                    <span className="text-gray-400 mr-2">•</span>
                    <strong>Status:</strong> Top Selling Product
                  </li>
                )}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Shipping & Returns</h3>
              <div className="text-sm space-y-2 text-gray-600">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong>Delivery:</strong> 2-4 business days
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong>Returns:</strong> 30-day return policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;