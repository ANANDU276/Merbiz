import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const wishlisted = isInWishlist(product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const name = product.name || "Product";

    if (wishlisted) {
      removeFromWishlist(product._id);
      toast.success(`${name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${name} added to wishlist`);
    }
  };

  const colorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    black: "bg-gray-800",
    white: "bg-white border border-gray-200",
    gray: "bg-gray-400",
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ½
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  const isOnSale =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      className="relative bg-white p-4 rounded-lg flex flex-col h-full shadow-sm transition-all group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          SALE
        </div>
      )}

      {/* Wishlist Icon */}
      <button
        className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
        onClick={toggleWishlist}
        title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        aria-label="Toggle Wishlist"
      >
        {wishlisted ? (
          <SolidHeart className="w-5 h-5 text-red-500" />
        ) : (
          <OutlineHeart className="w-5 h-5 text-gray-400 hover:text-red-400" />
        )}
      </button>

      {/* Image + Add to Cart */}
      <div className="relative flex-grow flex items-center justify-center p-4 overflow-hidden">
        <motion.img
          src={product.image[0] || "/default-product.png"}
          alt={product.name || "Product"}
          className="w-full h-48 object-contain transition-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onError={(e) => {
            e.target.src = "/default-product.png";
          }}
        />

        {/* Add to Cart: Hover only on lg+, always visible on sm/md */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-center py-2 z-10
            transition-transform duration-300
            lg:translate-y-full lg:group-hover:translate-y-0
          `}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (product.stock > 0) {
                addToCart(product);
                toast.success(`${product.name || "Product"} added to cart!`);
              } else {
                toast.error(`${product.name || "Product"} is out of stock!`);
              }
            }}
            className={`w-full text-sm font-medium ${
              product.stock === 0
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-col flex-grow">
        {product.category && (
          <span className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
            {product.category}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {product.name || "Unnamed Product"}
        </h3>

        {/* Color Dots */}
        {product.colors?.length > 0 && (
          <div className="flex space-x-2 mt-2">
            {product.colors.map((color, index) => (
              <span
                key={index}
                className={`w-4 h-4 rounded-full border ${
                  colorMap[color.toLowerCase()] || "bg-gray-300"
                }`}
                title={color}
              ></span>
            ))}
          </div>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mt-2">
            <div className="flex mr-1">{renderRating(product.rating)}</div>
            <span className="text-xs text-gray-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Price and Stock */}
        <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <div className="text-base font-bold text-gray-900">
              ₹{product.price?.toFixed(2) || "0.00"}
              {isOnSale && (
                <span className="text-sm text-gray-400 line-through ml-2 font-normal">
                  ₹{product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {product.stock !== undefined && (
              <div
                className={`text-xs mt-1 ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay link */}
      <Link
        to={`/products/${product._id}`}
        className="absolute inset-0 z-0"
        aria-label={`View ${product.name || "product"} details`}
      />
    </div>
  );
};

export default ProductCard;
