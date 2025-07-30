import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="px-4 py-10 mx-auto max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Cart</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Your Cart</h2>
              <div className="text-gray-600 text-sm">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </div>
            </div>

            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:shadow transition"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image[0] || "/default-product.png"}
                        alt={item.name || "Product"}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            ₹{item.price.toLocaleString()}
                          </p>
                          {item.storage && (
                            <p className="text-xs text-gray-500 mt-1">
                              Storage: {item.storage}
                            </p>
                          )}
                          {item.color && (
                            <p className="text-xs text-gray-500 mt-1">
                              Color: {item.color}
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="mx-3 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty Cart View
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
                  <p className="text-gray-600 mb-6">
                    Looks like you haven’t added anything to your cart yet.
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="lg:w-1/3">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Included</span>
                </div>

                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium mt-6 hover:bg-blue-700 transition">
                  Proceed to Checkout
                </button>
              </Link>

              <Link
                to="/"
                className="block text-center text-blue-600 hover:text-blue-800 mt-3 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
