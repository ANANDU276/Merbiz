import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaRegHeart,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, loading } =
    useWishlist();
  const { addToCart } = useCart();
  const [processing, setProcessing] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleMoveToCart = async (product) => {
    setProcessing(product._id);
    try {
      await addToCart(product);
      await removeFromWishlist(product._id);
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleRemove = async (productId) => {
    setProcessing(productId);
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setProcessing(null);
    }
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const moveSelectedToCart = async () => {
    setProcessing("bulk");
    try {
      for (const productId of selectedItems) {
        const product = wishlist.find((p) => p._id === productId);
        if (product) {
          await addToCart(product);
          await removeFromWishlist(productId);
        }
      }
      setSelectedItems([]);
    } catch (error) {
      console.error("Error moving items to cart:", error);
    } finally {
      setProcessing(null);
    }
  };

  const selectAllItems = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map((product) => product._id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full"
        >
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaRegHeart className="text-3xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't saved any items to your wishlist. Start shopping to add
            items you love!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="bg-white border border-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
            >
              Continue Shopping
            </Link>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium flex items-center justify-center gap-2"
            >
              Browse Products <FaChevronRight className="text-xs" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <FaChevronRight className="mx-2 text-xs" />
          <span className="text-gray-800 font-medium">Wishlist</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">
              My Wishlist ({wishlist.length})
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {selectedItems.length > 0 && (
              <button
                onClick={moveSelectedToCart}
                disabled={processing === "bulk"}
                className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-gray-900 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors disabled:opacity-70"
              >
                {processing === "bulk" ? (
                  <svg
                    className="animate-spin h-4 w-4 text-gray-900"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <FaShoppingCart />
                )}
                Move {selectedItems.length} to Cart
              </button>
            )}
            <button
              onClick={selectAllItems}
              className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-blue-600 hover:border-blue-800"
            >
              {selectedItems.length === wishlist.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 hidden sm:grid">
            <div className="col-span-5 font-medium text-gray-700">Product</div>
            <div className="col-span-2 font-medium text-gray-700">Price</div>
            <div className="col-span-3 font-medium text-gray-700">Actions</div>
            <div className="col-span-2 font-medium text-gray-700 text-right">
              Remove
            </div>
          </div>

          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-12 gap-4 p-4 border-b items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-12 sm:col-span-5 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product._id)}
                    onChange={() => toggleSelectItem(product._id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-4"
                  />
                  <div className="flex items-center">
                    <Link
                      to={`/products/${product._id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={product.image[0] || "/placeholder-product.jpg"}
                        alt={product.title}
                        className="w-16 h-16 object-contain border rounded-md"
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                    </Link>
                    <div className="ml-4">
                      <Link
                        to={`/products/${product._id}`}
                        className="text-gray-800 hover:text-blue-600 font-medium line-clamp-2"
                      >
                        {product.title}
                      </Link>
                      <p className="text-gray-500 text-sm mt-1">
                        {product.category}
                      </p>
                      <div className="sm:hidden mt-2">
                        <span className="font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block col-span-2">
                  <span className="font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="col-span-7 sm:col-span-3">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={processing === product._id}
                    className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors disabled:opacity-70 w-full sm:w-auto"
                  >
                    {processing === product._id ? (
                      <svg
                        className="animate-spin h-4 w-4 text-gray-900"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaShoppingCart />
                    )}
                    Move to Cart
                  </button>
                </div>

                <div className="col-span-5 sm:col-span-2 flex justify-end">
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={processing === product._id}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove from wishlist"
                  >
                    {processing === product._id ? (
                      <svg
                        className="animate-spin h-4 w-4 text-gray-400"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Recommendations Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recommended For You
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {/* Placeholder for recommended products */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <div className="w-full h-full animate-pulse bg-gray-200"></div>
                </div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
